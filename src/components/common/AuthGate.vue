<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <main class="auth-screen">
    <section class="auth-panel">
      <div class="mark">🔐</div>
      <p class="eyebrow">家庭学习空间</p>
      <template v-if="auth.status === 'checking'">
        <h1>正在确认安全连接</h1>
        <p class="hint">稍等一下，我们马上准备好。</p>
      </template>
      <template v-else-if="auth.status === 'conflict'">
        <h1>发现两份学习记录</h1>
        <p class="hint">选择要保留的记录。另一份会被替换，浏览器中的旧记录之后会清除。</p>
        <button class="choice primary" :disabled="auth.busy" @click="auth.resolveDataConflict('server')">保留服务器记录</button>
        <button class="choice secondary" :disabled="auth.busy" @click="auth.resolveDataConflict('browser')">用这台设备的旧记录</button>
      </template>
      <template v-else-if="auth.status === 'error'">
        <h1>安全服务暂时连不上</h1>
        <p class="hint">检查网络或服务器状态后再试。</p>
        <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>
        <button class="choice primary" :disabled="auth.busy" @click="auth.initialize()">重新连接</button>
      </template>
      <template v-else-if="auth.isDemoMode">
        <h1>开始体验</h1>
        <p class="hint">演示登录不验证身份，点一下即可进入学习空间。</p>
        <button class="choice primary" :disabled="auth.busy" @click="auth.login()">
          {{ auth.busy ? '正在进入…' : '游客体验' }}
        </button>
        <p class="privacy">演示进度只保存在此浏览器，不要输入真实个人信息。</p>
      </template>
      <template v-else-if="!auth.configured">
        <h1>先创建家长账号</h1>
        <p class="hint">首次使用前，请在服务器终端运行这条命令并按提示创建账号：</p>
        <code>npm run auth:setup</code>
        <p class="hint">密码不会显示在终端。创建完成后刷新本页登录。</p>
      </template>
      <template v-else>
        <h1>欢迎回来</h1>
        <p class="hint">登录后继续和你的伙伴学习。</p>
        <form class="login-form" @submit.prevent="auth.login()">
          <label>
            <span>家长账号</span>
            <input v-model.trim="auth.username" autocomplete="username" required maxlength="80" autofocus />
          </label>
          <label>
            <span>密码</span>
            <input v-model="auth.password" type="password" autocomplete="current-password" required maxlength="200" />
          </label>
          <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>
          <button class="choice primary" type="submit" :disabled="auth.busy">
            {{ auth.busy ? '正在登录…' : '进入学习空间' }}
          </button>
        </form>
        <p class="privacy">学习进度保存在家庭服务器，不会保存在此浏览器。</p>
      </template>
    </section>
  </main>
</template>

<style scoped>
.auth-screen { display: grid; place-items: center; min-height: 100vh; padding: 24px; background: radial-gradient(ellipse at top, #ffe1ed, transparent 52%), #fff4f7; }
.auth-panel { width: min(100%, 400px); padding: 28px; border: 1px solid #f4d7e1; border-radius: 20px; background: rgba(255,255,255,.94); box-shadow: 0 10px 0 #f2c4d2, 0 22px 55px rgba(119,58,85,.1); }
.mark { display: grid; place-items: center; width: 54px; height: 54px; margin-bottom: 18px; border-radius: 17px; background: #ffe3ec; font-size: 28px; }
.eyebrow { margin: 0 0 5px; color: #d94f78; font-size: 12px; font-weight: 800; }
h1 { margin: 0 0 8px; color: #493447; font-size: 24px; }
.hint, .privacy { color: #817382; font-size: 13px; line-height: 1.6; }
.auth-panel code { display: block; margin: 16px 0; padding: 12px; border-radius: 10px; background: #fff1f7; color: #a72f65; font-size: 14px; }
.login-form { display: grid; gap: 14px; margin-top: 22px; }
.login-form label { display: grid; gap: 6px; color: #5d4c5c; font-size: 12px; font-weight: 700; }
.login-form input { width: 100%; min-height: 46px; padding: 10px 12px; border: 1px solid #eadbe2; border-radius: 11px; background: #fffafd; color: #493447; font: inherit; font-size: 15px; }
.login-form input:focus { border-color: #e66d98; outline: 3px solid #ffe3ec; }
.choice { width: 100%; min-height: 46px; margin-top: 10px; border: 0; border-radius: 12px; font: inherit; font-weight: 800; cursor: pointer; }
.primary { background: linear-gradient(135deg, #f784a8, #df4c8d); box-shadow: 0 4px 0 #b93672; color: white; }
.secondary { background: #fff1f7; color: #b93672; }
.choice:disabled { opacity: .6; }
.error { margin: 0; color: #b42345; font-size: 12px; }
.privacy { margin: 18px 0 0; font-size: 11px; }
</style>
