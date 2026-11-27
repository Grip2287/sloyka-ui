#!/usr/bin/env node
import { main } from '../dist/check/cli.js';

process.exitCode = main(process.argv.slice(2));
