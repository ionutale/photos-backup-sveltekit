<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let photos = data.photos;

	function generateSrcset(name: string) {
		const sizes = [100, 200, 300, 400, 500, 600, 700, 800, 900];
		return sizes
			.map((size) => `/api/images?filename=${name}&q=80&w=${size}&h=${size}&fm=avif ${size}w`)
			.join(', ');
	}

	async function deleteImage(name: string) {
		try {
			const res = await fetch(`/api/images?filename=${name}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				console.log(res);
				throw new Error('Network response was not ok');
			}
			
			photos = photos.filter((photo) => photo.name !== name);
		} catch (error) {
			console.error(error);
		}
	}


</script>

<section>
	{#each photos as photo, i}
		<div class="image-card">
			<img
				src="/api/image?filename={photo.name}&q=80&w=100&h=100&fm=avif"
				srcset={generateSrcset(photo.name)}
				sizes="calc(100vw / 4 - calc(0.1rem * 4))"
				alt={photo.name}
				decoding="async"
				loading={i < 10 ? 'eager' : 'lazy'}
				fetchpriority={i < 10 ? 'high' : 'low'}
			/>
			<button id="delete" on:click={() => deleteImage(photo.name)}>delete</button>
		</div>
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.1rem;
	}
	.image-card {
		position: relative;
		display: inline-block;
		margin: auto;
		width: calc(100vw / 4 - calc(0.1rem * 4));
		aspect-ratio: 1/1;
		background-color: aliceblue;
	}
	.image-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	#delete {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
	}

</style>
