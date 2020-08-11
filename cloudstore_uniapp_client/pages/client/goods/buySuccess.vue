<template>
	<view class="container">
		<nav-bar backState="1000">支付结果</nav-bar>
		<view class="tui-content">
			<view class="tui-form">
				<image src="/static/img_recharge_success.png" class="tui-icon"></image>
				<view class="tui-title">支付成功</view>
				<view class="tui-sub-title">感谢您的购买!</view>
				<view class="tui-btn-box">
					<button class="cu-btn round index" @click="toPages('index')">返回首页</button>
					<button class="cu-btn round order" @click="toPages('order')">查看订单</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	export default { 
		data() {
			return {}
		},
		components: {
			navBar
		},
		methods: {
			toPages(page) {
				if (page === 'index') {
					uni.switchTab({
						url: "/pages/agent/goods/hotsale/hotsale"
					})
				} else if (page === 'order'){
					uni.navigateTo({
						url: '/pages/client/order/order',
					});
				}
					// uni.switchTab({
					// 	url: "/pages/client/recommend/index"
					// })
					// uni.navigateTo({
					// 	url: '/pages/client/order/order',
					// });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #fff;
		height: 100%;
		width: 100%;
	}
	.tui-content {
		padding: 0 35upx;
		box-sizing: border-box;
		background: #fff;
		height: 100%;
		width: 100%;
	}

	.tui-form {
		background: #fff;
		margin-top: 50upx;
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.tui-icon {
		width: 174upx;
		height: 174upx;
		display: block;
		margin-top: 60upx;
	}

	.tui-title {
		line-height: 42upx;
		padding-top: 28upx;
		color: #21BD73;
		font-size: 48upx;
		font-weight: bold;
	}

	.tui-sub-title {
		color: #999999;
		font-size: 26upx;
		line-height: 60upx;
		height: 60upx;

	}

	.tui-btn-box {
		width: 400upx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 100upx;
		.index {
			border: 3upx solid #1fb378;
			background-color: #fff;
			width: 100%;
			color: #1fb378;
			line-height: 70upx;
			height: 70upx;
			margin-bottom: 30upx;
		}
		.order {
			line-height: 70upx;
			height: 70upx;
			width: 100%;
			color: #fff;
			background-color: #1fb378;
		}
	}
	 .tui-btn-box .cu-btn {
		 font-size: 24upx;
	 }
	.tui-tips {
		font-size: 26upx;
		padding: 48upx 90upx;
		box-sizing: border-box;
		text-align: justify;
		line-height: 48upx;
	}

	.tui-grey {
		color: #555;
		padding-bottom: 8upx;
	}

	.tui-light-grey {
		color: #888;
		line-height: 40upx;
	}
</style>
