import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { createRequire } from 'node:module'
import initSqlJs, { type Database, type SqlJsStatic, type SqlValue } from 'sql.js'

const require = createRequire(import.meta.url)
const legacyDataDirectory = process.env.LOCALAPPDATA
  ? join(process.env.LOCALAPPDATA, 'LearnEnglish')
  : join(homedir(), '.local', 'share', 'LearnEnglish')
const siteRoot = resolve(process.cwd())
const privateDataDirectory = resolve(siteRoot, '.private-data')
const databasePath = resolve(process.env.DATABASE_PATH ?? join(privateDataDirectory, 'learnenglish.sqlite'))

function isInside(directory: string, candidate: string) {
  const relativePath = relative(directory, candidate)
  return relativePath === '' || (relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath))
}

if (isInside(siteRoot, databasePath) && !isInside(privateDataDirectory, databasePath)) {
  throw new Error('DATABASE_PATH inside the project must stay in .private-data.')
}
mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 })
const legacyDatabasePath = join(legacyDataDirectory, 'learnenglish.sqlite')
if (!process.env.DATABASE_PATH && !existsSync(databasePath) && existsSync(legacyDatabasePath)) {
  copyFileSync(legacyDatabasePath, databasePath)
}

let sqlite: SqlJsStatic
export let db: Database
let initialization: Promise<void> | undefined

export function initializeDatabase() {
  if (!initialization) initialization = initializeDatabaseOnce()
  return initialization
}

async function initializeDatabaseOnce() {
  sqlite = await initSqlJs({ locateFile: (file) => require.resolve(`sql.js/dist/${file}`) })
  const existing = existsSync(databasePath) ? new Uint8Array(readFileSync(databasePath)) : undefined
  db = existing ? new sqlite.Database(existing) : new sqlite.Database()
  db.run(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_data (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expires_at ON sessions(expires_at);
  `)
  persistDatabase()
  if (process.platform !== 'win32') chmodSync(dirname(databasePath), 0o700)
  console.info(`Private database: ${databasePath}`)
}

export function getOne<T>(sql: string, parameters: SqlValue[] = []): T | undefined {
  const statement = db.prepare(sql)
  try {
    statement.bind(parameters)
    return statement.step() ? statement.getAsObject() as T : undefined
  } finally {
    statement.free()
  }
}

export function execute(sql: string, parameters: SqlValue[] = []) {
  db.run(sql, parameters)
  const changes = db.getRowsModified()
  persistDatabase()
  return { changes }
}

export function persistDatabase() {
  const temporaryPath = `${databasePath}.tmp`
  writeFileSync(temporaryPath, Buffer.from(db.export()), { mode: 0o600 })
  renameSync(temporaryPath, databasePath)
  if (process.platform !== 'win32') chmodSync(databasePath, 0o600)
}
