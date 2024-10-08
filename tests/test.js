import { expect, test } from '@playwright/test';

test('Index page layout should have elements visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Alias Web Game' })).toBeVisible();
	await expect(page).toHaveTitle('Alias Web Game');
	const gameCodeInput = page.getByPlaceholder('Enter game code');
	await expect(gameCodeInput).toBeVisible();
	await expect(gameCodeInput).toBeEditable();
	await expect(gameCodeInput).toHaveAttribute('type', 'text');
	await expect(page.getByRole('button', { name: 'Join game' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Create a new game' })).toBeVisible();
});

test('Header banner elements should exist', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Alias Web Game' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Theme' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Language' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
});

test('Theme dropdown functions correctly', async ({ page }) => {
	await page.goto('/');
	const themeButton = page.getByRole('button', { name: 'Theme' });
	await expect(themeButton).toBeVisible();
	await themeButton.click();
	const modeSwitch = page.getByTitle('Toggle light or dark mode.');
	await expect(modeSwitch).toBeVisible();
	if (await modeSwitch.isChecked()) {
		await modeSwitch.uncheck();
		expect(await page.evaluate(() => window.localStorage.getItem('modeCurrent'))).toEqual('false');
		expect(await page.evaluate(() => window.localStorage.getItem('modeUserPrefers'))).toEqual(
			'false'
		);
	} else {
		await modeSwitch.check();
		expect(await page.evaluate(() => window.localStorage.getItem('modeCurrent'))).toEqual('true');
		expect(await page.evaluate(() => window.localStorage.getItem('modeUserPrefers'))).toEqual(
			'true'
		);
	}
	const themes = [
		'Skeleton',
		'Wintry',
		'Modern',
		'Rocket',
		'Seafoam',
		'Vintage',
		'Sahara',
		'Hamlindigo',
		'Gold Nouveau',
		'Crimson'
	];
	for (const theme of themes) {
		const themeButton = page.getByRole('button', { name: theme });
		await expect(themeButton).toBeVisible();
		await themeButton.click();
		const themeCookie = (await page.context().cookies()).find((cookie) => cookie.name === 'theme');
		expect(themeCookie).toBeTruthy();
		expect(themeCookie?.value.toLowerCase()).toEqual(theme.toLowerCase().replace(' ', '-'));
	}
});
