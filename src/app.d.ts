// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Db } from "mongodb"
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Db;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
