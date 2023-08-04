<script lang="ts">
	import { page } from '$app/stores';
	import { initializeApp, type FirebaseApp } from 'firebase/app';
	import {auth, type Auth} from '$lib/auth-context';

	import {
		GoogleAuthProvider,
		getAuth,
		signInWithPopup,
		type User
	} from 'firebase/auth';
	import { onMount } from 'svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyCQi_vhXlImx0eTNSKWzoAA3g6aCRxGzi8',
		authDomain: 'beta-dodolandia.firebaseapp.com',
		databaseURL: 'https://beta-dodolandia.firebaseio.com',
		projectId: 'beta-dodolandia',
		storageBucket: 'beta-dodolandia.appspot.com',
		messagingSenderId: '265210792609',
		appId: '1:265210792609:web:08ac22cc70d490dee5fee0',
		measurementId: 'G-FWZL7KZRHM'
	};

	// Initialize Firebase
	let app: FirebaseApp | null = null;

	onMount(async () => {
		try {
			// check if firebase is already initialized and user is logged in
			if (!app) {
				app = initializeApp(firebaseConfig);
			}
			const fAuth = getAuth();
			fAuth.onAuthStateChanged((_user) => {
			  auth.set({ user: _user } as Auth);
				// set cookie with user info
				document.cookie = `user=${JSON.stringify(_user)}`;
			});
		} catch (error) {
			console.log(error);
		}
	});

	const login = async () => {
		try {
			console.log('login');
			const provider = new GoogleAuthProvider();
			const auth = getAuth();
			const result = await signInWithPopup(auth, provider);
			console.log('result', result);
		} catch (error) {
			console.log(error);
		}
	};

	let y: number;
</script>

{#if $auth.user === null}
	<button 
	class="login-button"
	on:click={login}>login</button>
{:else}
	<main class="main-content">
		<slot />
	</main>
	<nav>
		<a data-selected={$page.routeId === ''} href="/">Home</a>
		<a data-selected={$page.routeId?.includes('upload')} href="/upload">upload</a>
	</nav>
{/if}

<style>
	main {
		margin: 0;
	}

	nav {
		background-color: white;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 1rem;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 20;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	}

	nav a {
		text-decoration: none;
		text-transform: capitalize;
		color: #333;
	}

	nav a[data-selected='true'] {
		color: #000;
		border-top: blue 2px solid;
	}

	.login-button {
		margin: 50vh auto;
		display: block;
		background-color: blue;
		color: white;
		padding: 1rem;
		border: none;
		border-radius: 25%;
		cursor: pointer;
 		transition: all 0.2s ease;
	}

</style>
