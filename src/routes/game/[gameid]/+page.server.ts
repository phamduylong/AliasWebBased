import { error } from '@sveltejs/kit';
import { EOL } from 'node:os'  
import * as fs from 'fs';
/** @type {import('./$types').PageServerLoad} */
export async function load({ }) {
    const data: Word[] = [];
    const url = new URL(`${import.meta.url}../../../../../lib/assets/words_version6.csv`);
    try {
        const content = fs.promises.readFile(url, 'latin1');
        const lines = (await content).toString().split(EOL);
        for(const element of lines) { 
            data.push({ word: element, shown: false });
        }
    } catch (e : Error) {
        throw error(500, e.message);
    }
	return { words: data };
}
