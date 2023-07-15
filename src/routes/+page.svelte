<script lang="ts">
	import { enhance } from '$app/forms';

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form method="POST" action="?/upload" use:enhance>
	<label for="photos">Choose a photos to upload</label>
	<input type="file" id="photos" name="photos" accept="image/*" />
	<button>Submit</button>
</form>
