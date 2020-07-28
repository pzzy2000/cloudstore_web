<template>
	<view class="container">
		<view class="tui-bg"></view>
		<view class="tui-content">
			<view class="tui-form">
				<image src="/static/img_recharge_success.png" class="tui-icon"></image>
				<view class="tui-title">订单已支付成功</view>
				<!-- <view class="tui-sub-title">非常感谢您购买我们的产品</view> -->
				<view class="tui-btn-box">
					<view class="margin-tb-sm text-center">
						<button class="cu-btn round line-red" @click="toPages('index')">返回首页</button>
					</view>
					<view class="margin-tb-sm text-center">
						<button class="cu-btn round bg-red" @click="toPages('order')">查看订单</button>
					</view>
				</view>
			</view>
		</view>
		<view class="tui-tips">
			<view class="tui-grey">温馨提示:</view>
			<view class="tui-light-grey">
				付款成功后,请勿泄露银行卡号、手机验证码，否则会造成钱款损失！谨防电话诈骗！
			</view>
		</view>
	</view>
</template>

<script>
	export default { 
		data() {
			return {}
		},
		methods: {
			toPages(page) {
				if (page === 'index') {
					uni.switchTab({
						url: "/pages/client/recommend/index"
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

<style>
	.tui-bg {
		width: 100%;
		height: 260upx;
		/* background: linear-gradient(20deg, #E41F19, #F34B0B); */
		background: #00a79d;
		border-bottom-left-radius: 42upx;
	}

	.tui-content {
		padding: 0 35upx;
		box-sizing: border-box;
		margin-top: 10%;
	}

	.tui-form {
		background: #fff;
		height: 500upx;
		box-shadow: 0 10upx 14upx 0 rgba(0, 0, 0, 0.08);
		border-radius: 10upx;
		margin-top: -160upx;
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.tui-icon {
		width: 100upx;
		height: 100upx;
		display: block;
		margin-top: 60upx;
	}

	.tui-title {
		font-size: 42upx;
		line-height: 42upx;
		padding-top: 28upx;
	}

	.tui-sub-title {
		color: #666666;
		font-size: 28upx;
		line-height: 28upx;
		padding-top: 20upx;
	}

	.tui-btn-box {
		width: 580upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-top: 88upx;
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
