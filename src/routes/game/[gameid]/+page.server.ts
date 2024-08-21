import { error } from '@sveltejs/kit';
import { EOL } from 'node:os'  
import * as fs from 'fs';
import * as path from 'path';
/** @type {import('./$types').PageServerLoad} */
export async function load({ }) {
    const data: Word[] = [];
    try {
        const content = fs.promises.readFile(new URL('../../../../static/words_version6.csv', import.meta.url), 'latin1');
        const lines = (await content).toString().split(EOL);
        for(const element of lines) { 
            data.push({ word: element, shown: false });
        }
    } catch (e : Error) {
        throw error(500, e.message);
    }
	return { words: data };
}
