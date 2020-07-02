<template>
	<view>
	 <p>这里显示我浏览的分享 和 我 的分享 </p>
	<tabbar :role="client" :id='"cfx"'></tabbar>
	</view>
</template>

<script>
	
	export default {
			data(){
				return {
					client:'client'
				}
			}
		}
</script>

<style>
</style>
