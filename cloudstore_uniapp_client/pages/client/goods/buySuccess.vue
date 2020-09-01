<template>
	<view class="container">
		<nav-bar backState="1000">支付结果</nav-bar>
		<view class="tui-content">
			<view class="tui-form">
				<image src="/static/img_recharge_success.png" class="tui-icon"></image>
				<view class="tui-title">支付成功</view>
				<view class="tui-sub-title">感谢您的购买!</view>
				<view class="tui-btn-box" v-if="!belowTheLine">
					<button class="cu-btn round index" @click="toPages('index')">返回首页</button>
					<button class="cu-btn round order" @click="toPages('order')">查看订单</button>
				</view>
				<view class="below-the-line-box" v-if="belowTheLine">
					<view class="below-the-line">
						<view class="below-the-line-main">
							<view class="theLine-title">您已成功购买:</view>
							<view class="theLine-content" v-for="item in orderDetailList" :key='item.id'>
								<image :src="item.goodsSkuBean.photos[0].url" mode="" class="theLine-content-img"></image>
								<view class="theLine-content-detail">
									<view class="content-detail-sku">
										<view class="detail-sku-title clamp">{{item.goodsPicesBean.goodsName}}</view>
										<text class="detail-sku">{{item.goodsSkuBean.skuValues}}</text>
										<view class="detail-sku-price">
											<view class="sku-price-left">
												<text class="sku-price-num price-symbol">{{price}}</text>
												<text class="sku-price-unit">/{{item.goodsPicesBean.unit}}</text>
											</view>
											<view class="sku-price-right">
												×1
											</view>
										</view>
									</view>
									<!-- <view class="content-detail-price">
										<text class="price-symbol">36.6</text>
										<text class="content-detail-prt price-symbol">136.6</text>
									</view> -->
								</view>
							</view>
							<view class="theLine-bottom">快去领取吧!</view>
						</view>
					</view>
					<button class="theLine-btn bg-blue text-white" @click="confirmReceive">确认领取</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default { 
		data() {
			return {
				belowTheLine: false,
				orderDetailList: '',
				orderinfo: '',
				price: '',
				orderId: ''
			}
		},
		components: {
			navBar
		},
		onLoad(ops) {
			// ops.orderId = '7960376677893148673'
			// ops.price = 17
			if (ops.orderId) {
				this.orderId = ops.orderId
				this.getOrderInfo(ops.orderId)
				this.price = ops.price
			}
		},
		methods: {
			async getOrderInfo (id) {
				let params = {
					orderId: id
				};
				let data = await Api.apiCall('post', Api.client.order.getClientOrderDetail, params);
				if (data) {
					this.orderDetailList = data.result.details
					this.belowTheLine = true
					console.log(this.orderDetailList)
				}
			},
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
			},
			confirmReceive () {
				uni.showModal({
					title: '收货确认',
					content: '您确定领取商品吗？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.setConfirmOrder()
						} else if (res.cancel) {
						}
					},
				});
			},
			async setConfirmOrder () { //调用确认收货接口
				let parmas = {
					id: this.orderId
				}
				let data = await Api.apiCall('post',Api.client.order.confirmOrder,parmas,true)
				if (data) {
					console.log(data)
					if (data.code ===0) {
						if (data.result.id === this.orderId) {
							this.$api.msg('领取商品成功')
							let timer = setTimeout(() => {
								clearTimeout(timer);
								uni.navigateTo({
									url: '/pages/client/order/order',
								});
							}, 1000);
						} else {
							this.$api.msg('订单id不匹配')
						}
					} else {
						this.$api.msg(code.msg)
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f5f5f5;
		height: 100%;
		width: 100%;
	}
	.tui-content {
		box-sizing: border-box;
		background: #f5f5f5;
		height: 100%;
		width: 100%;
	}

	.tui-form {
		background: #f5f5f5;
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
	.below-the-line-box {
		width: 100%;
		margin-top: 30upx;
	}
	.below-the-line {
		width: 100%;
		background-color: #fff;
		.below-the-line-main {
			width: 100%;
			padding: 0 30upx;
			.theLine-title {
				font-size: 24upx;
				color: #666;
				line-height: 100upx;
			}
			.theLine-content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.theLine-content-img {
					width: 150upx;
					height: 150upx;
					margin-right: 20upx;
					border-radius: 15upx;
				}
				.theLine-content-detail {
					display: flex;
					flex-wrap: wrap;
					width: calc(100% - 170upx);
					.content-detail-sku {
						min-width: 80%;
						.detail-sku-title {
							color: #333;
							font-size: 32upx;
							letter-spacing: 2upx;
							
						}
						.detail-sku {
							font-size: 26upx;
							color: #999;
							line-height: 70upx;
						}
						.detail-sku-price {
							color: #999;
							font-size: 26upx;
							display: flex;
							.sku-price-left {
								margin-right: 100upx;
								.sku-price-num {
									color: ff1313;
									font-size: 32upx;
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
					// display: flex;
					// flex-wrap: wrap;
					font-size: 26upx;
					width: 100upx;
					text {
						text-align: right;
						display: inline-block;
						width: 100%;
						color: #FF1313;
						letter-spacing: 2upx;
					}
					.content-detail-prt {
						color: #999;
						text-decoration: line-through;
					}
				}
			}
			.theLine-bottom {
				text-align: right;
				color: #000;
				font-size: 30upx;
				font-weight: bold;
				line-height: 80upx;
			}
		}
	}
	.theLine-btn {
		width: 300upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		border-radius: 35upx;
		margin-top: 30upx;
		font-size: 30upx;
		&::after {
			border: none;
		}
	}
</style>
