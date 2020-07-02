<template>
	<view>
	    <p>这里显示我的页面</p>	
		 
		 更加登录返回的信息 判单登录用户是否是代理权限
		 
		<a @click="toagent()">去代理</a>
		
		<tabbar :role="client" :id="'cwd'"></tabbar>
	</view>
	
</template>

<script>
export default {
		data(){
			return {
				client:'client'
			}
		},
		methods:{
			toagent(){
				uni.switchTab({
					url:"/pages/agent/goods/hotsale/hotsale"
				})
			}
		}
	}
</script>

<style>
</style>
