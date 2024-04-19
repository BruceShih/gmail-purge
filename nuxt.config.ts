import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: false,
  runtimeConfig: {
    public: {
      gapiClientId: process.env.NUXT_GAPI_CLIENT_ID || ''
    }
  },
  devServer: {
    https: {
      key: './localhost+2-key.pem',
      cert: './localhost+2.pem'
    }
  },
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxt/ui',
    'nuxt-vue3-google-signin'
  ],
  ui: {
    icons: ['lucide']
  },
  googleSignIn: {
    clientId: process.env.NUXT_GAPI_CLIENT_ID || ''
  }
})
