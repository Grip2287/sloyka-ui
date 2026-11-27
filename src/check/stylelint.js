// Stylelint 16: { "extends": ["sloyka/stylelint"] }
import stylelint from 'stylelint';
import { importMessage, selectorHits, maskCss } from './scan-css.js';
import { slSelectorMessage } from './rules.js';

const { createPlugin, utils } = stylelint;

const make = (name, check) => {
  const ruleName = `sloyka/${name}`;
  const messages = utils.ruleMessages(ruleName, { rejected: text => text });
  const rule = primary => (root, result) => {
    if (!utils.validateOptions(result, ruleName, { actual: primary })) return;
    check(root, (node, index, text) => utils.report({ result, ruleName, node, index, endIndex: index + 1, message: messages.rejected(text) }));
  };
  rule.ruleName = ruleName;
  rule.messages = messages;
  return createPlugin(ruleName, rule);
};

// Текст селектора как в исходнике (с комментариями), чтобы позиция совпала с CLI.
const rawSelector = rule => (rule.raws.selector && rule.raws.selector.value === rule.selector ? rule.raws.selector.raw : rule.selector);

const noDeepImports = make('no-deep-imports', (root, report) => {
  root.walkAtRules(/^import$/i, atRule => {
    const message = importMessage(atRule.params);
    if (message) report(atRule, 0, message);
  });
});

const noSlOverrides = make('no-sl-css-overrides', (root, report) => {
  root.walkRules(rule => {
    for (const hit of selectorHits(maskCss(rawSelector(rule)))) report(rule, hit.index, slSelectorMessage(hit.token));
  });
});

export const plugins = [noDeepImports, noSlOverrides];
export default {
  plugins,
  rules: { 'sloyka/no-deep-imports': true, 'sloyka/no-sl-css-overrides': true },
};
