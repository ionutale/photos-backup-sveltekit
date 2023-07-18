<script lang="ts">
	export let photo: File;
	export let index: number;
	$: progress = 0;
	export let autoUpload: boolean | undefined = false;

	type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
	let uploadStatus: UploadStatus = 'idle';

	function beautifySize(byte: number) {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (byte === 0) return '0 Byte';
		const i = Math.floor(Math.log(byte) / Math.log(1024));
		return Math.round(byte / Math.pow(1024, i)) + ' ' + sizes[i];
	}

	function uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);

		var ajax = new XMLHttpRequest();
		ajax.upload.addEventListener('progress', (event) => progressHandler(event, file), false);
		ajax.addEventListener('load', completeHandler, false);
		ajax.addEventListener('error', errorHandler, false);
		ajax.addEventListener('abort', abortHandler, false);
		ajax.open('POST', '?/upload');
		ajax.send(formData);
	}

	function progressHandler(event: ProgressEvent, file: File) {
		progress = Math.round((event.loaded / event.total) * 100);
		uploadStatus = 'uploading';
	}

	function completeHandler(event: ProgressEvent) {
		progress = 0;
		uploadStatus = 'success';
	}

	function errorHandler(event: ProgressEvent) {
		console.log('errorHandler', event);
		progress = 0;
		uploadStatus = 'error';
	}

	function abortHandler(event: ProgressEvent) {
		console.log('abortHandler', event);
		progress = 0;
		uploadStatus = 'error';
	}

	function buttonTitle(p: number) {
		if (p === 0) return 'Upload';
		if (p === 100) return 'Done';
		return `${p}%`;
	}

	if (autoUpload) {
		console.log('autoUpload', autoUpload, "uploading...");
		uploadFile(photo);
	}
</script>

<div>
	<img src={URL.createObjectURL(photo)} alt={photo.name} width="100" height="100" />
	<p>{index}-{photo.name} <span>{beautifySize(photo.size)}</span>{autoUpload}</p>
	{#if uploadStatus === 'success'}
		<p>✅</p>
	{:else}
		<button disabled={uploadStatus === 'uploading'} on:click={() => uploadFile(photo)}
			>{buttonTitle(progress)}</button
		>
	{/if}
</div>

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
</style>
