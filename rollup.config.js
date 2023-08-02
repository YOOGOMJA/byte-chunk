// import { RollupOptions } from "rollup";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import {dts} from "rollup-plugin-dts";
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

/**
 * @type {require('rollup').RollupOptions[]}
 */
const options = [
  {
    input: "src/index.ts",
    output: [
      {
        file: path.join(__dirname, "dist/index.esm.js"),
        format: "esm",
      },
      {
        file: path.join(__dirname, "dist/index.cjs.js"),
        format: "cjs",
      }
    ],
    plugins: [
      resolve({
        preferBuiltins : true
      }),
      commonjs(), 
      typescript(), 
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: path.join(__dirname , 'dist/index.d.ts'), format: "cjs" }],
    plugins: [
      resolve(),
      dts(),
    ],
  },
];

export default options;
