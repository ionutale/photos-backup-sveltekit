<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const photos = data.photos;
</script>

<section>
	{#each photos as photo, i}
		<div class="image-card">
			<img
				src="/api/image?filename={photo.name}"
				alt={photo.name}
				width="100"
				height="100"
				decoding="async"
				loading="lazy"
			/>
		</div>
	{/each}
</section>

<style>

	section {
		margin: 0;
	}
	.image-card {
		display: inline-block;
    margin: auto;
    width: calc(100vw / 4);
    aspect-ratio: 1/1;
	}
	.image-card img {
		width: 100%;
		height: 100%;
	}

	.image-card p {
		margin: 0;
	}
</style>
