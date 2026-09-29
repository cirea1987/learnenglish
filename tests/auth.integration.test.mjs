import assert from 'node:assert/strict'
import { once } from 'node:events'
import { randomBytes, scryptSync } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const username = `test-${randomBytes(5).toString('hex')}`
const password = randomBytes(24).toString('base64url')
const dataDirectory = await mkdtemp(join(tmpdir(), 'learnenglish-auth-'))
let server
let database
let cookie = ''
let baseUrl = ''

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  })
}

try {
  const salt = randomBytes(16).toString('base64url')
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
  process.env.DATABASE_PATH = join(dataDirectory, 'test.sqlite')
  process.env.PORT = '0'

  const databaseModule = await import('../dist-server/database.js')
  await databaseModule.initializeDatabase()
  database = databaseModule.db
  databaseModule.execute("INSERT INTO app_meta (key, value) VALUES ('credentials', ?)", [JSON.stringify({ username, passwordHash })])
  const serverModule = await import('../dist-server/index.js')
  server = serverModule.server
  if (!server.listening) await once(server, 'listening')
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  baseUrl = `http://127.0.0.1:${address.port}`

  assert.equal((await request('/api/data')).status, 401)

  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'incorrect-password' }),
  })
  assert.equal(badLogin.status, 401)

  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  assert.equal(login.status, 200)
  const setCookie = login.headers.get('set-cookie') ?? ''
  assert.match(setCookie, /HttpOnly/i)
  assert.match(setCookie, /SameSite=Strict/i)
  cookie = setCookie.split(';')[0]
  assert.ok(cookie.startsWith('learnenglish_session='))

  const savedData = { app: { lastOpenedAt: 1 }, progress: { learnedLetters: ['A'] }, settings: { theme: 'cat' } }
  assert.equal((await request('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(savedData) })).status, 204)
  assert.deepEqual(await (await request('/api/data')).json(), savedData)

  const invalidData = await request('/api/data', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials: 'must not be accepted' }),
  })
  assert.equal(invalidData.status, 400)

  assert.equal((await request('/api/data', { method: 'DELETE' })).status, 204)
  assert.equal((await request('/api/auth/logout', { method: 'POST' })).status, 200)
  cookie = ''
  assert.equal((await request('/api/data')).status, 401)
  console.info('Authentication integration checks passed.')
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  if (server?.listening) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  database?.close()
  await rm(dataDirectory, { recursive: true, force: true })
}
