<template>
	<view class="container">
		<nav-bar backState="1000">关于我们</nav-bar>
		<view class="logo">
			<image src="/static/log.png" mode="" class="logo-img"></image>
		</view>
		<view class="agreement">
			<navigator class="content" hover-class="none" url="./privacy">
				<text class="text-blue">丫咪购隐私协议</text>
			</navigator>
			<navigator class="content" hover-class="none" url="./agreement">
				<text class="text-blue">丫咪购服务协议</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				
			}
		},
		components: {
			navBar
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.logo {
		width: 100%;
		margin-top: 300upx;
		text-align: center;
	}
	.logo-img {
		height: 250upx;
		width: 250upx;
		margin: 0 auto;
	}
	.agreement {
		margin-top: 100upx;
	}
	.content {
		width: 100%;
		text-align: center;
		line-height: 60upx;
		color: blue;
	}
</style>
