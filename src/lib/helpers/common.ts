import type { Game } from '$lib/types';

/**
 * Shuffles the array passed to it
 * @param {Array} array Array to be shuffled
 * @see {@link https://stackoverflow.com/a/12646864/14126819}
 */
export function shuffleArray(array: any[]): void {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/**
 * Check if a Game object is in a valid state
 * @param {Game} game Game object to be validated
 * @returns {string[]} An array of error messages (if any)
 */
export function validateGame(game: Game): string[] {
	const erroneousMessages = [];
	if (!game) {
		erroneousMessages.push('Game is null');
	}

	if (!game.game_id || typeof game.game_id !== 'string' || game.game_id === '') {
		erroneousMessages.push('Game ID is invalid');
	}

	if (!game.team1 || typeof game.team1 !== 'string' || game.team1 === '') {
		erroneousMessages.push('Name of team 1 is invalid');
	}

	if (!game.team2 || typeof game.team2 !== 'string' || game.team2 === '') {
		erroneousMessages.push('Name of team 2 is invalid');
	}

	if (typeof game.team1_score !== 'number' || game.team1_score < 0) {
		erroneousMessages.push('Score of team 1 is invalid');
	}

	if (typeof game.team2_score !== 'number' || game.team2_score < 0) {
		erroneousMessages.push('Score of team 2 is invalid');
	}

	if (!game.words || game.words.length === 0) {
		erroneousMessages.push('Words array is empty');
	}

	return erroneousMessages;
}

export default { shuffleArray, validateGame };
