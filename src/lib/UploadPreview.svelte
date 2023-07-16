<script lang="ts">
	export let photo: File;
	export let index: number;
  $: progress = 0;

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
		ajax.upload.addEventListener('progress',(event)=> progressHandler(event, file), false);
		ajax.addEventListener('load', completeHandler, false);
		ajax.addEventListener('error', errorHandler, false);
		ajax.addEventListener('abort', abortHandler, false);
		ajax.open('POST', '?/upload');
		ajax.send(formData);
	}

	function progressHandler(event: ProgressEvent, file: File) {
		console.log('progressHandler', event);
    progress = Math.round((event.loaded / event.total) * 100);
	}

	function completeHandler(event: ProgressEvent) {
		console.log('completeHandler', event);
    progress = 0;
	}

	function errorHandler(event: ProgressEvent) {
		console.log('errorHandler', event);
    progress = 0;
	}

	function abortHandler(event: ProgressEvent) {
		console.log('abortHandler', event);
    progress = 0;
	}
</script>

<div>
	<img src={URL.createObjectURL(photo)} alt={photo.name} width="100" height="100" />
	<p>{index}-{photo.name} <span>{beautifySize(photo.size)}</span></p>
</div>
<button on:click={() => uploadFile(photo)}>{progress > 0 ? `uploading ... ${progress}%`: 'Upload'}</button>

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
