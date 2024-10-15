import { expect, test } from '@playwright/test';

test.describe('Layout header functionalities', () => {
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
			expect(await page.evaluate(() => window.localStorage.getItem('modeCurrent'))).toEqual(
				'false'
			);
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
			const themeCookie = (await page.context().cookies()).find(
				(cookie) => cookie.name === 'theme'
			);
			expect(themeCookie).toBeTruthy();
			expect(themeCookie?.value.toLowerCase()).toEqual(theme.toLowerCase().replace(' ', '-'));
		}
	});

	test('Language dropdown functions correctly', async ({ page }) => {
		await page.goto('/');
		const langButton = page.getByRole('button', { name: 'Language' });
		await expect(langButton).toBeVisible();
		await langButton.click();
		const englishLangButton = page.getByTitle('English');
		await expect(englishLangButton).toBeVisible();
		const finnishLangButton = page.getByTitle('Suomi');
		await expect(finnishLangButton).toBeVisible();
		const swedishLangButton = page.getByTitle('Svenska');
		await expect(swedishLangButton).toBeVisible();
		await finnishLangButton.click();
		expect(await page.evaluate(() => window.localStorage.getItem('locale'))).toEqual('fi');
		await expect(page.getByRole('button', { name: 'Kieli' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Teema' })).toBeVisible();
		await swedishLangButton.click();
		expect(await page.evaluate(() => window.localStorage.getItem('locale'))).toEqual('sv');
		await expect(page.getByRole('button', { name: 'Språk' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Tema' })).toBeVisible();
	});

	test('GitHub link functions correctly', async ({ page }) => {
		const pagePromise = page.context().waitForEvent('page');
		const githubLink = page.getByRole('link', { name: 'GitHub' });
		await expect(githubLink).toBeVisible();
		await githubLink.click();
		const newPage = await pagePromise;
		await expect(newPage).toHaveURL('https://github.com/phamduylong/AliasWebBased');
	});

	test('Clicking on logo text should redirect to home page', async ({ page }) => {
		await page.goto('/create');
		const indexPageURL = new URL(page.url()).origin;
		await page.click('text=Alias Web Game');
		await expect(page).toHaveURL(indexPageURL);
	});
});

test.describe('Index page', () => {
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

	test('Join game button should redirect to game page', async ({ page }) => {
		await page.goto('/');
		await page.fill('input[placeholder="Enter game code"]', '123456');
		await expect(page.locator('text=Join game')).toBeEnabled();
		await page.locator('text=Join game').click();
		await page.waitForURL('**/game?gameId=123456');
		expect(page.url()).toContain('/game?gameId=123456');
	});

	test('Create game link should redirect to create game page', async ({ page }) => {
		await page.goto('/');
		await page.locator('text=Create a new game').click();
		await page.waitForURL('**/create');
		expect(page.url()).toContain('/create');
	});
});

test.describe('Create game page', () => {
	test('Create game page layout should have elements visible', async ({ page }) => {
		await page.goto('/create');
		await expect(page.getByRole('heading', { name: 'Create a new game' })).toBeVisible();
		await expect(page).toHaveTitle('Create a new game');

		const team1Input = page.getByPlaceholder('Name of team 1 (max 16 characters)');
		await expect(team1Input).toBeVisible();
		await expect(team1Input).toBeEditable();
		await expect(team1Input).toHaveAttribute('type', 'text');

		const team2Input = page.getByPlaceholder('Name of team 2 (max 16 characters)');
		await expect(team2Input).toBeVisible();
		await expect(team2Input).toBeEditable();
		await expect(team2Input).toHaveAttribute('type', 'text');

		const useDefaultWordsSwitch = page.getByRole('switch', { name: 'Use default set of words' });
		await expect(useDefaultWordsSwitch).toBeVisible();
		await expect(useDefaultWordsSwitch).toBeEditable();

		const wordFileInput = page.getByLabel('File of words');
		await expect(wordFileInput).toBeVisible();
		await expect(wordFileInput).toBeEditable();
		await expect(wordFileInput).toHaveAttribute('type', 'file');
		
		await expect(page.getByRole('button', { name: 'Create game' })).toBeVisible();
	});

	test('Intermediate page UI to be visible', async ({ page }) => {
		await page.goto('/create');
		await page.fill('input[placeholder="Name of team 1 (max 16 characters)"]', 'Clippers');
		await page.fill('input[placeholder="Name of team 2 (max 16 characters)"]', 'Lakers');
		const useDefaultWordsSwitch = page.getByRole('switch', { name: 'Use default set of words' });
		await useDefaultWordsSwitch.click();
		const createGameButton = page.getByRole('button', { name: 'Create game' });
		await expect(createGameButton).toBeEnabled();
		await createGameButton.click();

		await expect(page.getByRole('heading', { name: 'Copy game URL' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Copy and share the game URL to play with friends' })).toBeVisible();
		const gameCodeInput = page.getByRole('textbox');
		await expect(gameCodeInput).toBeVisible();
		await expect(gameCodeInput).toHaveAttribute('readonly');
		await expect(gameCodeInput).toHaveAttribute('type', 'text');
		expect(await gameCodeInput.inputValue()).toContain(`${new URL(page.url()).origin}/game?gameId=`);
		await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
		await expect(page.getByText('Go to game')).toBeVisible();
	});

	test('Go to game button should redirect to game page', async ({ page }) => {
		await page.goto('/create');
		await page.fill('input[placeholder="Name of team 1 (max 16 characters)"]', 'Clippers');
		await page.fill('input[placeholder="Name of team 2 (max 16 characters)"]', 'Lakers');
		const useDefaultWordsSwitch = page.getByRole('switch', { name: 'Use default set of words' });
		await useDefaultWordsSwitch.click();
		const createGameButton = page.getByRole('button', { name: 'Create game' });
		await expect(createGameButton).toBeEnabled();
		await createGameButton.click();
		await expect(page.locator('text=Go to game')).toBeVisible();
		await page.locator('text=Go to game').click();
		await page.waitForURL('**/game?gameId=**');
		expect(page.url()).toContain('/game?gameId=');
	});
});