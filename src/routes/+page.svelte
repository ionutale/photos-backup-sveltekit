<script lang="ts">
	import { enhance } from '$app/forms';

	const upload = async (e) => {
		const files = e.target.files;
		const formData = new FormData();
		formData.append('file', files[0]);
		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});
		const data = await res.json();
		console.log(data);
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<form method="POST" action="?/login" use:enhance>
	<label for="photos">Choose a photos to upload</label>
	<input type="file" id="photos" name="photos" accept="image/*" />
	<button>Submit</button>
</form>
