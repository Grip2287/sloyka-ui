import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { stories, url } from './stories.js';

const WIDTHS = [390, 1024, 1440];
for (const s of stories) {
  for (const theme of ['light', 'dark']) {
    for (const w of WIDTHS) {
      test(`${s.id} · ${theme} · ${w}`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(url(s.id, theme));
        await page.locator('#storybook-root > *').first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        expect(errors, 'JS errors').toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(0);
        const clipped = await page.evaluate(() => [...document.querySelectorAll('#storybook-root *')].filter(el => {
          const cs = getComputedStyle(el);
          if (cs.textOverflow === 'ellipsis' || /auto|scroll/.test(cs.overflowX) || cs.display === 'contents' || el.closest('svg')) return false;
          return el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1;
        }).map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}: ${el.scrollWidth}>${el.clientWidth}`));
        expect(clipped, 'content wider than its box').toEqual([]);
        await expect(page).toHaveScreenshot(`${s.id}--${theme}--${w}.png`, { fullPage: true });
        if (w === 1440) {
          const res = await new AxeBuilder({ page }).include('#storybook-root').disableRules(['region', 'landmark-unique', 'page-has-heading-one']).analyze();
          const bad = res.violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${v.id}: ${v.nodes.length} × ${v.nodes[0].target}`);
          expect(bad, 'axe serious/critical').toEqual([]);
        }
      });
    }
  }
}
