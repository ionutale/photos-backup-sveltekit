<script lang="ts">
	import UploadPreview from '$lib/UploadPreview.svelte';
	let photos: FileList;
</script>

<label for="photos">Choose a photos to upload</label>
<input type="file" id="photos" name="photos" accept="image/*" bind:files={photos} multiple />
<button>Submit</button>

{#each photos || [] as photo, index}
	<UploadPreview {photo} {index} />
{/each}

<style>
	label {
		margin-bottom: 1rem;
	}

	input {
		margin-bottom: 1rem;
	}
</style>
