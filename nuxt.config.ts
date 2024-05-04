import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: false,
  devServer: {
    https: {
      key: './localhost+2-key.pem',
      cert: './localhost+2.pem'
    }
  },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/ui',
    'nuxt-vue3-google-signin',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],
  ui: {
    icons: ['lucide', 'logos']
  },
  googleSignIn: {
    clientId: process.env.NUXT_GAPI_CLIENT_ID || ''
  },
  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'zh',
        name: '繁體中文',
        file: 'zh.json'
      }
    ],
    detectBrowserLanguage: {
      useCookie: false
    }
  }
})
