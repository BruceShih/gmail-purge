// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@nuxtjs/eslint-module',
    '@vueuse/nuxt',
    '@nuxt/ui',
    'nuxt-vue3-google-signin'
  ],
  ui: {
    icons: ['lucide']
  },
  googleSignIn: {
    clientId: '674563356111-l545qi51f8dnme6pf17n6a1pd3kacsjv.apps.googleusercontent.com',
  }
})
