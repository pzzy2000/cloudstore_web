<template>
	<view>
		<web-view :src="url" ></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onload (options) {
			console.log(options)
			if (options && options.url) {
			    this.url = options.url;
				console.log(this.url)
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
