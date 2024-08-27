import PocketBase from 'pocketbase';
declare namespace App {
	interface Locals {
		pocketBase: PocketBase;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	interface Word {
		word: string;
		shown: boolean;
	}
}

export { Word };