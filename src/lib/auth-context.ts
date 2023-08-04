import { writable } from "svelte/store";
import type { User } from 'firebase/auth';

export type Auth = {
  user: User | null;
  token: string | null;
};

export const auth = writable({
  user: null,
  token: null
} as Auth);

