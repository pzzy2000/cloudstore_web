<template>

    <view class="container">
	 	<p>欢迎页面</p>
		<button@click="toreg" >我的代理</button>
	</view>
</template>

<script>
	import Api from '@/common/api';
	export default{
		onLoad() {
		 //检查是否登录 查询用户信息
		 
		 	 
		},
		methods:{
		  let prams ={};
		  let data = await Api.apiCall('post', Api.index.reg, params, true, false);
	    }
		
	}
</script>

<style>
</style>
