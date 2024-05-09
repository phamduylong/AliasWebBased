import { error } from '@sveltejs/kit';
import * as fs from 'fs';
import * as path from 'path';
const __dirname = path.resolve();
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const data: Word[] = [];
	fs.readFile(new URL('../../../lib/words_version6.csv', import.meta.url), 'latin1', (readErr, readData) => {
		if (readErr) {
			console.log("got here");
			error(500, readErr?.message);
		}
		const readWords = readData.split('\r\n');
		readWords.forEach((currWord) => {
			data.push({ word: currWord, isshown: false });
		});
	});
	console.log(data);

	return { words: data };
}
