import PocketBase from 'pocketbase';
declare global {
	declare namespace App {
		interface Locals {
			pocketBase: PocketBase;
		}

		interface Error {
			message: string;
		}
	}
}
