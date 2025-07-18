/******************************************************************************/

// Annoyingly, wrangler doesn't use .env or .env.dev, which is too bad because
// then dotenv would Just Work (tm); instead, we need to manually pull the file
// to ensure that the right things get set in for the UI build.
import { config } from 'dotenv';
config({ path: ['.dev.vars'] });


import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';

import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


/******************************************************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientRoot = path.resolve(__dirname, 'client');

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const packageJson = fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8');
const version = JSON.parse(packageJson).version;

const isProduction = process.env.NODE_ENV === 'production';

console.log(`Client Build: ${process.env.NODE_ENV}`);
console.log(`Build Info:   ${commitHash}`);


/******************************************************************************/

const baseUrl =  'http://localhost:3000';


export default {
  input: path.resolve(clientRoot, 'src/main.jsx'),
  output: {
    dir: path.resolve(clientRoot, 'output'),
    format: 'esm',
    sourcemap: !isProduction,
    entryFileNames: 'assets/[name]-[hash].js',
    chunkFileNames: 'assets/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router', 'react-router-dom', 'history'],
      'ionic-vendor': ['@ionic/react', '@ionic/react-router', 'ionicons'],
      'clerk-vendor': ['@clerk/clerk-react', '@clerk/themes'],
    }
  },
  plugins: [
    del({ targets: path.resolve(clientRoot, 'output/*') }),
    copy({
      targets: [
        { src: path.resolve(clientRoot, 'static/*'), dest: path.resolve(clientRoot, 'output') }
      ]
    }),

    alias({
      entries: [
        { find: '@', replacement: path.resolve(clientRoot, 'src') },
        { find: '@assets', replacement: path.resolve(clientRoot, 'src/assets') },
        { find: '@context', replacement: path.resolve(clientRoot, 'src/context') },
        { find: '@utility', replacement: path.resolve(clientRoot, 'src/utility') },
        { find: '@components', replacement: path.resolve(clientRoot, 'src/components') },
        { find: '@icons', replacement: path.resolve(clientRoot, 'src/components/icons') },
        { find: '@modals', replacement: path.resolve(clientRoot, 'src/components/modals') },
        { find: '@pages', replacement: path.resolve(clientRoot, 'src/components/pages') },
        { find: '@query', replacement: path.resolve(clientRoot, 'src/query') },
        { find: '@schema', replacement: path.resolve(clientRoot, 'src/schema') },
        { find: '@spools', replacement: path.resolve(clientRoot, 'src/components/spools') },
        { find: '@inventory', replacement: path.resolve(clientRoot, 'src/components/inventory') },
        { find: '@ionic/react/css', replacement: path.resolve(__dirname, 'node_modules/@ionic/react/css') }
      ]
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      __CANNED_REQUESTS__: JSON.stringify(process.env.CANNED_REQUESTS),
      __CLERK_PUBLISHABLE_KEY__: JSON.stringify(process.env.CLERK_PUBLISHABLE_KEY),
      __APP_VERSION__: JSON.stringify(version),
      __COMMIT_HASH__: JSON.stringify(commitHash),
    }),
    resolve({
      extensions: ['.js', '.jsx', '.css'],
      browser: true
    }),
    commonjs(),
    babel({
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    postcss({
      extract: true,
      minimize: isProduction,
      sourceMap: !isProduction
    }),
    html({
      template: ({ files }) => {
        const template = fs.readFileSync(path.resolve(clientRoot, 'index.html'), 'utf8');
        const scripts = (files.js || [])
          .map(({ fileName }) => `<script type="module" src="/${fileName}"></script>`)
          .join('\n    ');
        const links = (files.css || [])
          .map(({ fileName }) => `<link rel="stylesheet" href="/${fileName}">`)
          .join('\n    ');

        return template
          .replace('</head>', `    ${links}\n  </head>`)
          .replace('</body>', `    ${scripts}\n  </body>`);
      },
    }),
    generateSW({
      swDest: path.resolve(clientRoot, 'output/sw.js'),
      globDirectory: path.resolve(clientRoot, 'output/'),
      globPatterns: ['**/*.{html,js,css,png,svg,ico,json}'],
      skipWaiting: true,
      clientsClaim: true,
    }),
    isProduction && terser()
  ],
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
    warn(warning);
  }
};


/******************************************************************************/
