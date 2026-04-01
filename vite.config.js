import { defineConfig, loadEnv } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isStaging = mode === 'staging'

  return {
    root: 'src',
    base: '/',
    publicDir: '../public',

    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : 'esbuild',

      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html')
        },
        output: {
          manualChunks: {
            'three': ['three'],
            'vendor': ['gsap', '@studio-freight/lenis'],
          },
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|glb|gltf/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        }
      },
      
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        },
      } : {},
      
      // Asset size warnings
      chunkSizeWarningLimit: 1000,
      
      // Performance optimizations
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // 4kb
    },
    
    plugins: [
      // HTML plugin for template processing
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: 'AsnanP | ML Engineer',
            description: 'Portfolio of Asnan P - Machine Learning Engineer',
            buildMode: mode,
          }
        }
      }),
      
      // Legacy browser support
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: !isProduction,
      }),
      
      // Compression plugin for production
      isProduction && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      
      isProduction && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      
      // PWA support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'AsnanP Portfolio',
          short_name: 'AsnanP',
          description: 'Machine Learning Engineer Portfolio',
          theme_color: '#8a2be2',
          background_color: '#0a0a0a',
          display: 'standalone',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,glb,gltf,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:glb|gltf)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: '3d-models-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        }
      })
    ].filter(Boolean),
    
    server: {
      port: 3000,
      open: true,
      hmr: {
        overlay: true,
      },
    },
    
    preview: {
      port: 4173,
      open: true,
    },
    
    optimizeDeps: {
      include: ['three', 'gsap', '@studio-freight/lenis'],
      exclude: [],
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@utils': resolve(__dirname, './src/utils'),
        '@styles': resolve(__dirname, './src/styles'),
        '@assets': resolve(__dirname, './src/assets'),
      }
    },
    
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      },
      devSourcemap: !isProduction,
    },
    
    esbuild: {
      legalComments: 'none',
      drop: isProduction ? ['console', 'debugger'] : [],
    },
  }
})
