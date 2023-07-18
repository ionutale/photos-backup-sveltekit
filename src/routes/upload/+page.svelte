<script lang="ts">
	import UploadPreview from '$lib/UploadPreview.svelte';
	let photos: FileList;
	let autoUpload = false;

	function uploadAll() {
		autoUpload = true;
	}

</script>

<label for="photos">Choose a photos to upload</label>
<input type="file" id="photos" name="photos" accept="image/*" bind:files={photos} multiple on:change={() => autoUpload = false} />
<button on:click={uploadAll}>Upload All</button>

{#each photos || [] as photo, index}
	<UploadPreview {photo} {index} {autoUpload} />
{/each}

<style>
	label {
		margin-bottom: 1rem;
	}

	input {
		margin-bottom: 1rem;
	}
</style>
