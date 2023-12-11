import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()

  pinia.use(createUnistorage())

  app.use(pinia)

  return {
    app,
    Pinia
  }
}
