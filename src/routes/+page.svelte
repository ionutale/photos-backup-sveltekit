<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const photos = data.photos;
</script>

<section>
	{#each photos as photo, i}
		<div class="image-card">
			<img src="/api/image?filename={photo.name}" alt={photo.name} width="100" height="100" />
			<p>{i}-{photo.name} <span>{photo.size}</span></p>
		</div>
	{/each}
</section>

<style>
	.image-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
		margin: 1rem 0;
	}

	.image-card img {
		width: 100px;
		height: 100px;
	}

	.image-card p {
		margin: 0;
	}

	.image-card p span {
		font-size: 0.8rem;
		color: #999;
	}
</style>
