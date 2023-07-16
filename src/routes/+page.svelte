<script lang="ts">
	import { enhance } from '$app/forms';
	let photos: FileList;

  function beautifySize(byte: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (byte === 0) return '0 Byte';
    const i = Math.floor(Math.log(byte) / Math.log(1024));
    return Math.round(byte / Math.pow(1024, i)) + ' ' + sizes[i];
  }


</script>

<form method="POST" action="?/upload" use:enhance>
	<label for="photos">Choose a photos to upload</label>
	<input type="file" id="photos" name="photos" accept="image/*" bind:files={photos} multiple />
	<button>Submit</button>
</form>

{#each photos || [] as photo, i}
	<div>
		<img src={URL.createObjectURL(photo)} alt={photo.name} width="100" height="100" />
		<p>{i}-{photo.name} <span>{beautifySize(photo.size)}</span> </p>
	</div>
{/each}

<style>
	div {
		display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
	}

	img {
		display: block;
	}

	p {
		text-align: center;
    font-weight: 600;
	}

  span {
    font-weight: 400;
  }

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	label {
		margin-bottom: 1rem;
	}

	input {
		margin-bottom: 1rem;
	}
</style>
