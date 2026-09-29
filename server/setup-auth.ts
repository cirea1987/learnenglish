import { randomBytes, scryptSync } from 'node:crypto'
import { emitKeypressEvents } from 'node:readline'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { execute, initializeDatabase } from './database.js'

function readHidden(prompt: string) {
  return new Promise<string>((resolve, reject) => {
    if (!stdin.isTTY || !stdin.setRawMode) {
      reject(new Error('请在交互式终端运行 npm run auth:setup。'))
      return
    }

    stdout.write(prompt)
    emitKeypressEvents(stdin)
    stdin.setRawMode(true)
    stdin.resume()
    let value = ''

    const finish = (error?: Error) => {
      stdin.off('keypress', onKeypress)
      stdin.setRawMode(false)
      stdout.write('\n')
      error ? reject(error) : resolve(value)
    }

    const onKeypress = (character: string, key: { name?: string; ctrl?: boolean }) => {
      if (key.ctrl && key.name === 'c') return finish(new Error('已取消。'))
      if (key.name === 'return' || key.name === 'enter') return finish()
      if (key.name === 'backspace') {
        value = value.slice(0, -1)
        stdout.write('\b \b')
        return
      }
      if (character && character.length === 1 && !key.ctrl) {
        value += character
        stdout.write('*')
      }
    }

    stdin.on('keypress', onKeypress)
  })
}

async function main() {
  await initializeDatabase()
  const terminal = readline.createInterface({ input: stdin, output: stdout })
  try {
    const username = (await terminal.question('家长账号名: ')).trim()
    terminal.close()
    if (!username || username.length > 80) throw new Error('账号名需要为 1 至 80 个字符。')
    const password = await readHidden('家长密码（至少 12 位）: ')
    if (password.length < 12 || password.length > 200) throw new Error('密码长度需要为 12 至 200 个字符。')
    const confirmation = await readHidden('再次输入密码: ')
    if (password !== confirmation) throw new Error('两次输入的密码不一致。')

    const salt = randomBytes(16).toString('base64url')
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
    execute(`
      INSERT INTO app_meta (key, value) VALUES ('credentials', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `, [JSON.stringify({ username, passwordHash })])
    execute('DELETE FROM sessions')
    console.info('家长账号已创建或更新，已有登录会话已退出。')
  } finally {
    terminal.close()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : '初始化失败。')
  process.exitCode = 1
})
