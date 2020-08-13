<template>
	<view class="container">
		<nav-bar backState="1000">关于我们</nav-bar>
		<view class="logo bg-white">
			<image src="/static/log.png" mode="" class="logo-img"></image>
		</view>
		<view class="agreement bg-white">
			<navigator class="content" hover-class="none" url="./privacy">
				<text>丫咪购隐私协议</text>
				<text class="yticon icon-you"></text>
			</navigator>
			<navigator class="content" hover-class="none" url="./agreement">
				<text>丫咪购服务协议</text>
				<text class="yticon icon-you"></text>
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
		background-color: #f1f1f1;
	}
	.logo {
		width: 100%;
		padding: 250upx 0 150upx 0;
		text-align: center;
		margin-bottom: 30upx;
	}
	.logo-img {
		height: 250upx;
		width: 250upx;
		margin: 0 auto;
	}
	.agreement {
		width: 100%;
		text-align: left;
	}
	.content {
		font-size: 26upx;
		width: 100%;
		line-height: 80upx;
		height: 80upx;
		color: blue;
		display: flex;
		justify-content: space-between;
		padding: 0 30upx;
		border: 1upx solid #f1f1f1;
		text {
			color: #343434;
		}
		.yticon {
			width: 18upx;
			height: 30upx;
			color: #9A9A9A;
		}
	}
</style>
