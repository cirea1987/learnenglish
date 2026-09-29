import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { resolve } from 'node:path'
import express, { type NextFunction, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { execute, getOne, initializeDatabase } from './database.js'

const app = express()
const port = Number(process.env.PORT ?? 3001)
const production = process.env.NODE_ENV === 'production'
const publicOrigin = process.env.PUBLIC_ORIGIN
const cookieName = 'learnenglish_session'
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000
const allowedDataKeys = new Set(['app', 'progress', 'reward', 'settings', 'user', 'daily'])

if (production && (!publicOrigin || !publicOrigin.startsWith('https://'))) {
  throw new Error('Set PUBLIC_ORIGIN to the HTTPS origin before starting production.')
}
if (production) app.set('trust proxy', 1)

app.disable('x-powered-by')
app.use((_request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')
  if (production) response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})
app.use('/api', (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store')
  next()
})
app.use(express.json({ limit: '256kb', strict: true }))

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: '尝试次数过多，请 15 分钟后再试。' },
})

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.cookie
  if (!cookieHeader) return undefined
  for (const cookie of cookieHeader.split(';')) {
    const separator = cookie.indexOf('=')
    if (separator < 0) continue
    if (cookie.slice(0, separator).trim() === name) return cookie.slice(separator + 1).trim()
  }
  return undefined
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function setSessionCookie(response: Response, token: string, maxAgeSeconds: number) {
  const secure = production ? '; Secure' : ''
  response.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure}`)
}

function requireSession(request: Request, response: Response, next: NextFunction) {
  const token = getCookie(request, cookieName)
  if (!token) return response.status(401).json({ error: '请先登录。' })

  const tokenHash = hashToken(token)
  const session = getOne<{ expires_at: number }>('SELECT expires_at FROM sessions WHERE token_hash = ?', [tokenHash])
  if (!session || session.expires_at <= Date.now()) {
    execute('DELETE FROM sessions WHERE token_hash = ?', [tokenHash])
    setSessionCookie(response, '', 0)
    return response.status(401).json({ error: '登录已过期，请重新登录。' })
  }

  return next()
}

function verifyPassword(password: string, encoded: string) {
  const [salt, expectedHex] = encoded.split(':')
  if (!salt || !expectedHex) return false
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

function validDataPayload(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  return keys.length <= allowedDataKeys.size && keys.every((key) => allowedDataKeys.has(key))
}

function requireSameOrigin(request: Request, response: Response, next: NextFunction) {
  if (production && request.method !== 'GET' && request.get('origin') !== publicOrigin) {
    return response.status(403).json({ error: '请求来源无效。' })
  }
  return next()
}

app.get('/api/health', (_request, response) => response.json({ ok: true }))
app.use('/api/auth', requireSameOrigin)
app.get('/api/auth/config', (_request, response) => {
  return response.json({ configured: Boolean(getOne("SELECT value FROM app_meta WHERE key = 'credentials'")) })
})
app.get('/api/auth/status', (request, response) => {
  const token = getCookie(request, cookieName)
  if (!token) return response.json({ authenticated: false })
  const session = getOne<{ expires_at: number }>('SELECT expires_at FROM sessions WHERE token_hash = ?', [hashToken(token)])
  return response.json({ authenticated: Boolean(session && session.expires_at > Date.now()) })
})
app.post('/api/auth/login', loginLimiter, (request, response) => {
  const username = typeof request.body?.username === 'string' ? request.body.username.trim() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const row = getOne<{ value: string }>("SELECT value FROM app_meta WHERE key = 'credentials'")
  if (!row || username.length > 80 || password.length > 200) return response.status(401).json({ error: '账号或密码不正确。' })

  const credentials = JSON.parse(row.value) as { username: string; passwordHash: string }
  const usernameMatches = username === credentials.username
  const passwordMatches = verifyPassword(password, credentials.passwordHash)
  if (!usernameMatches || !passwordMatches) return response.status(401).json({ error: '账号或密码不正确。' })

  const token = randomBytes(32).toString('base64url')
  const expiresAt = Date.now() + sessionLifetimeMs
  execute('INSERT INTO sessions (token_hash, expires_at) VALUES (?, ?)', [hashToken(token), expiresAt])
  setSessionCookie(response, token, sessionLifetimeMs / 1000)
  return response.json({ authenticated: true })
})
app.post('/api/auth/logout', requireSession, (request, response) => {
  const token = getCookie(request, cookieName)
  if (token) execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)])
  setSessionCookie(response, '', 0)
  return response.json({ authenticated: false })
})

app.use('/api/data', requireSameOrigin, requireSession)
app.get('/api/data', (_request, response) => {
  const row = getOne<{ value: string }>('SELECT value FROM app_data WHERE id = 1')
  return response.json(row ? JSON.parse(row.value) : null)
})
app.put('/api/data', (request, response) => {
  if (!validDataPayload(request.body)) return response.status(400).json({ error: '学习数据格式无效。' })
  const serialized = JSON.stringify(request.body)
  if (Buffer.byteLength(serialized) > 200 * 1024) return response.status(413).json({ error: '学习数据超出允许大小。' })
  execute(`
    INSERT INTO app_data (id, value, updated_at) VALUES (1, ?, ?)
    ON CONFLICT(id) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `, [serialized, Date.now()])
  return response.status(204).end()
})
app.delete('/api/data', (_request, response) => {
  execute('DELETE FROM app_data WHERE id = 1')
  return response.status(204).end()
})

if (production) {
  const distDirectory = resolve(process.cwd(), 'dist')
  app.use(express.static(distDirectory, { index: false, dotfiles: 'deny' }))
  app.get(/^(?!\/api(?:\/|$)).*/, (_request, response) => response.sendFile(resolve(distDirectory, 'index.html')))
}

await initializeDatabase()
export const server = app.listen(port, production ? '0.0.0.0' : '127.0.0.1', () => {
  const address = server.address()
  console.info(`LearnEnglish API listening on port ${address && typeof address !== 'string' ? address.port : port}`)
})
