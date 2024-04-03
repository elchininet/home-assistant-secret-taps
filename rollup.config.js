import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

const commonPlugins = [
    nodeResolve(),
    json(),
    ts({
        browserslist: false
    })
];

const plugins = [
    ...commonPlugins,
    terser({
        output: {
            comments: false
        }
    })
];

export default [
    {
        plugins,
        input: 'src/checker.ts',
        output: {
            name: 'homeAssistantSecretTapsChecker',
            file: 'dist/home-assistant-secret-taps.js',
            format: 'iife'
        }
    },
    {
        plugins,
        input: 'src/home-assistant-secret-taps.ts',
        output: {
            file: 'dist/home-assistant-secret-taps-plugin.js',
            format: 'iife'
        }
    },
    {
        plugins: [
            ...commonPlugins,
            istanbul({
                exclude: [
                    'node_modules/**/*',
                    'package.json'
                ]
            })
        ],
        input: 'src/home-assistant-secret-taps.ts',
        output: {
            file: '.hass/config/www/home-assistant-secret-taps-plugin.js',
            format: 'iife'
        }
    }
];