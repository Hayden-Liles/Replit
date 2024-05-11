import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import pkg from 'vite-plugin-monaco-editor';
const vitePluginMonacoEditor = pkg.default;

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      preserveSymlinks: true,
      // alias: {
      //   '@renderer': resolve('src/renderer/src')
      // }
    },
    plugins: [
      vue(),
      vitePluginMonacoEditor({
        customDistPath( root, buildOutDir, base){
          return root + '../../out/renderer'
        }
      })
    ]
  }
})
