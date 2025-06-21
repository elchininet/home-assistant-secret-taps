import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';
import replace from '@rollup/plugin-replace';

const commonPlugins = [
    nodeResolve(),
    json(),
    typescript({
        mapRoot: '/'
    })
];

console.log(__dirname);

const terserPlugin = terser({
    output: {
        comments: false
    }
});

export default [
    {
        plugins: [
            ...commonPlugins,
            terserPlugin
        ],
        input: 'src/checker.ts',
        output: {
            name: 'homeAssistantSecretTapsChecker',
            file: 'dist/home-assistant-secret-taps.js',
            format: 'iife'
        }
    },
    {
        plugins: [
            ...commonPlugins,
            terserPlugin
        ],
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
            }),
            replace({
                values: {
                    [`../..${__dirname}`]: __dirname,
                    [`..${__dirname}`]: __dirname,
                },
                preventAssignment: true,
                delimiters: ['', '']
            })
        ],
        input: 'src/home-assistant-secret-taps.ts',
        output: {
            file: 'dist/ha-plugin.js',
            format: 'iife'
        }
    }
];