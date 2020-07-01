<template>
	<view>
	<p>用户端首页 ，这里显示最近一次购买的代理店铺的信息 </p>
	<tabbar :role="client"></tabbar>
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
