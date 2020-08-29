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
				<view class="below-the-line" v-if="belowTheLine">
					<view class="below-the-line-main">
						<view class="theLine-title">您已成功购买</view>
						<view class="theLine-content">
							<image src="/static/logo.png" mode="" class="theLine-content-img"></image>
							<view class="theLine-content-detail">
								<view class="content-detail-sku">
									<view class="detail-sku-title">麒麟西瓜 6kg/个</view>
									<text class="detail-sku">4kg以上/中杯/12ML</text>
									<view class="detail-sku-price">
										<view class="sku-price-left">
											<text class="sku-price-num price-symbol">36.6</text>
											<text class="sku-price-unit">/个</text>
										</view>
										<view class="sku-price-right">
											×1
										</view>
									</view>
								</view>
								<view class="content-detail-price">
									<view>36.6</view>
									<view class="content-detail-prt">136.6</view>
								</view>
							</view>
						</view>
						<view class="theLine-bottom">快去领取吧!</view>
						<button class="theLine-btn">确认领取</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	export default { 
		data() {
			return {
				belowTheLine: false
			}
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
	.below-the-line {
		width: 100%;
		background-color: #fff;
		.below-the-line-main {
			width: 100%;
			padding: 30upx;
			.theLine-title {
				font-size: 24upx;
				color: #666;
				line-height: 80upx;
			}
			.theLine-content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.theLine-content-img {
					width: 150upx;
					height: 150upx;
				}
				.theLine-content-detail {
					display: flex;
					flex-wrap: wrap;
					width: calc(100% - 150upx);
					.content-detail-sku {
						.detail-sku-title {
							color: #333;
							font-size: 32upx;
							letter-spacing: 2upx;
							
						}
						.detail-sku {
							font-size: 26upx;
							color: #999;
						}
						.detail-sku-price {
							color: #999;
							font-size: 26upx;
							.sku-price-left {
								.sku-price-num {
									color: ff1313;
									font-size: 32upx;
									margin-right: 100upx;
								}
							}
							.sku-price-right {
								font-size: 32upx;
								color: #333;
							}
						}
					}
				}
				.content-detail-price {
					display: flex;
					flex-wrap: wrap;
					font-size: 26upx;
					view {
						display: inline-block;
					}
					.content-detail-prt {
						color: #999;
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>
