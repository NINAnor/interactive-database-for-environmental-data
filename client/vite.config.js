import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { sentrySvelteKit } from '@sentry/sveltekit'

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  const extra = {}

  if (env.PROXY) {
    extra.server = {
      proxy: {
        '/api': env.PROXY,
        '/postgrest': env.PROXY,
      }
    }
  }

  return defineConfig({
    ...extra,
    plugins: [
      sentrySvelteKit({
        adapter: 'static',
        sourceMapsUploadOptions: {
          org: 'ninanor',
          project: 'fishboat-frontend'
        }
      }),
      sveltekit()
    ],
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}']
    },
    build: {
      chunkSizeWarningLimit: 4000
    }
  })
}
