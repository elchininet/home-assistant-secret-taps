import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const plugins = [
    nodeResolve(),
    json(),
    ts({
        browserslist: false
    }),
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
    }
];