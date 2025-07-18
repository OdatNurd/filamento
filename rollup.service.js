/******************************************************************************/


import 'dotenv/config';

import $path from '@axel669/rollup-dollar-path';
import fileRoutes from "@axel669/rollup-hono-files"
import replace from '@rollup/plugin-replace';
import resolve from "@rollup/plugin-node-resolve"
import terser from '@rollup/plugin-terser';

import jetpack from "fs-jetpack";
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';


/******************************************************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceRoot = path.resolve(__dirname, 'service');

const build_env = process.env.BUILD_ENV;
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const buildDate = execSync('date +"%Y-%m-%dT%H:%M:%S%z"').toString().trim();
const packageJson = jetpack.read('package.json', 'json');
const version = `${packageJson.version}-${commitHash}`;

console.log(`Server Build: ${build_env}`);
console.log(`Version:      ${version}`);
console.log(`Date:         ${buildDate}`);


/******************************************************************************/


const config = {
  input: path.resolve(serviceRoot, "src/main.js"),
  output: {
    file: path.resolve(serviceRoot, "output/main.js"),
    format: "esm"
  },

  onwarn(warning, handler) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      if(warning.message.includes('node_modules/hono/')) {
        return;
      }
    }
    handler(warning);
  },

  plugins: [
    $path({
        root: serviceRoot,
        paths: {
          $commit: "../commitReference.js",
        },
        extensions: [".js", ".mjs"]
    }),

    replace(
    {
      'preventAssignment': true,
      'process.env.BUILD_ENV': JSON.stringify(build_env),
      'process.env.VERSION': JSON.stringify(version),
      'process.env.BUILD_DATE': JSON.stringify(buildDate),
    }),

    fileRoutes({
      debug: true,
      source: path.resolve(serviceRoot, 'src/routes')
    }),

    resolve()
  ]
}


/******************************************************************************/


if (build_env === 'production') {
  config.plugins.push(terser());
}


/******************************************************************************/


export default config;
