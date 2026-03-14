import { test, expect } from '@playwright/test'

test.describe('Login page visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations and transitions for stable screenshots
    await page.addInitScript(() => {
      const style = document.createElement('style')
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
      document.head.appendChild(style)
    })
  })

  test('desktop', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'Desktop only')

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    await expect(page).toHaveScreenshot('login-desktop.png', {
      maxDiffPixelRatio: 0.01,
    })
  })
})
