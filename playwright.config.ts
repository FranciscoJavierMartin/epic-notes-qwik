import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
const PORT = process.env.PORT || '3031';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: './tests/e2e',
	timeout: 15 * 1000,
	expect: {
		timeout: 5 * 1000,
	},
	fullyParallel: true,
	reporter: 'html',
	use: {
		baseURL: `http://localhost:${PORT}/`,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],
};

export default config;
