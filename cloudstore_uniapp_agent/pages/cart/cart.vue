<template>
	<view :style="[{'margin-top': statusBarHeight+45+'px'}]">
		<text>这是购物车</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: '',
			}
		},
		onLoad () {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
