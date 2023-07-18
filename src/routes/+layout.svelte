<script lang="ts">
	import { page } from '$app/stores';
	let y: number;
</script>

<main class="main-content">
	<slot />
</main>
<nav>
	<a data-selected={$page.routeId === ''} href="/">Home</a>
	<a data-selected={$page.routeId?.includes('upload')} href="/upload">upload</a>
</nav>

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
</style>
