import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  console.log('createApp ==> ', import.meta.env)
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  app.use(pinia as any)
  return {
    app,
    Pinia
  }
}
