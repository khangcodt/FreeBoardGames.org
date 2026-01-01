/// <reference path='./typings.d.ts'/>

import childProcess from 'child_process';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { i18n, i18nRewrites, i18nRedirects } from './config/i18n';
import path from 'path';

const CHANNEL = process.env.CHANNEL || 'development';
const BABEL_ENV_IS_PROD = (process.env.BABEL_ENV || 'production') === 'production';
const VERSION = process.env.GIT_REV || getGitHash();

function getGitHash() {
  let hash = 'unknown';
  try {
    hash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {}
  return hash;
}

// Note: Removed deprecated packages:
// - webpackbar: Next.js 14 has built-in progress indicators
// - next-optimized-images: Next.js 14 has built-in image optimization via next/image
// - @zeit/next-workers: use native Web Workers or next-worker
// - i18next-hmr/plugin: Fast Refresh handles this in Next.js 14

export default {
  poweredByHeader: false,
  typescript: {
    // Skip type checking during build (using webpack transpileOnly for faster builds)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during build (can run separately)
    ignoreDuringBuilds: true,
  },
  // Public runtime config - evaluated at REQUEST TIME, not build time
  // This allows Coolify environment variables to be used at runtime
  publicRuntimeConfig: {
    // These values are read from environment variables when the server receives a request
    FBG_API_URL: process.env.FBG_API_URL || process.env.FBG_BACKEND_TARGET || 'http://localhost:3001',
    FBG_WS_URL: process.env.FBG_WS_URL || 'http://localhost:8001',
  },
  env: {
    CHANNEL,
    VERSION,
    BABEL_ENV_IS_PROD: String(BABEL_ENV_IS_PROD),
  },
  webpack: (config: any) => {
    // Find and disable Next.js's default image handling
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.png')
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.(jpg|jpeg|png|gif|svg|webp|mp3|wav)$/;
    }

    config.module.rules.push({
      test: /\.test.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });

    config.module.rules.push({
      test: /jest.(config|setup).(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });

    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    config.module.rules.push({
      test: /\.(webp|mp3|wav)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/media/',
            outputPath: 'static/media/',
            name: '[name].[hash].[ext]',
            esModule: false,
          },
        },
      ],
    });

    // Handle images with file-loader that works with CommonJS require()
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|gif|svg)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/media/',
            outputPath: 'static/media/',
            name: '[name].[hash].[ext]',
            esModule: false, // This makes it work with CommonJS require()
          },
        },
      ],
    });

    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TSConfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TSConfigPathsPlugin()];
    }

    if (!BABEL_ENV_IS_PROD) {
      config.optimization.minimizer = [];
    }

    return config;
  },
  i18n,
  rewrites: () => [...i18nRewrites()],
  redirects: () => [...i18nRedirects()],
};
