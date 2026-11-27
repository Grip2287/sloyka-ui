// expect: no-deep-imports@5, no-deep-imports@6, no-deep-imports@7, no-deep-imports@8, no-deep-imports@9, no-deep-imports@13, no-deep-imports@14
import { Button } from 'sloyka';
import 'sloyka/styles.css';
import tokens from 'sloyka/components.json';
import { Icon } from 'sloyka/dist/index.js';
import { core } from 'sloyka/src/react/core';
export * from '@grip2287/sloyka/dist/chunk.js';
const legacy = require('sloyka/dist/legacy.cjs');
const lazy = () => import('sloyka/src/lazy');
import { other } from './local';
import { okTemplates } from 'sloyka/templates/strogij.css';
export { Button, tokens, Icon, core, legacy, lazy, other, okTemplates };
import eq = require('sloyka/dist/eq');
const res = require.resolve('sloyka/src/res');
