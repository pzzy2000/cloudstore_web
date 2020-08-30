<template>
	<view>
		<nav-bar backState="1000">订单详情</nav-bar>
		<!-- 订单列表 -->
		<view class="order-item">
			<view class="i-top">
				<text>订单时间: {{orderList.orderBean.createTime || '加载中'}}</text>
				<!-- <view class="price-box">
					<text class="num">总价:</text>
					<text class="price">{{orderList.orderBean.payPrice}}</text>
				</view> -->
			</view>
			<view v-for="(order, index1) in orderList.details" :key="index1" class="order-list">
				<!-- <checkbox class='round order-check blue' :class="checked?'checked':''" :checked="checked?true:false" value="B"></checkbox> -->
				<checkbox class='round order-check blue' value="B" @click="orderSelect(index1)" v-if="order.status === 'WaitDeliver'"></checkbox>
				<view class="goods-box-single">
					<image class="goods-img" :src="order.goodsSkuBean.photos[0].url || order.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image>
					<view class="right">
						<text class="title clamp">{{order.goodsPicesBean.goodsName || '加载中'}}</text>
						<text class="subtitle clamp">规格：{{order.goodsSkuBean.skuValue || '加载中'}}</text>
						<text class="subtitle clamp">单价：{{order.goodsSkuBean.price || '加载中'}}</text>
						<text class="subtitle clamp">数量：{{order.quantity || '加载中'}}</text>
					</view>
					<view class="flex align-center">
						<view class="status" v-if="order.status === 'WaitDeliver'">待发货</view>
						<view class="status" v-else-if="order.status === 'peisoged'">已配送</view>
						<view class="status" v-else-if="order.status === 'returnsing'">退货中</view>
						<view class="status" v-else-if="order.status === 'refunding'">退款中</view>
						<view class="status" v-else-if="order.status === 'refunded'">已退款</view>
						<view class="status" v-else-if="order.status === 'returns'">退货成功</view>
						<view class="status" v-else-if="order.status === 'returnsfail'">退货拒绝</view>
						<view class="status" v-else-if="order.status === 'delivered'">已收货</view>
					</view>
				</view>
			</view>
			<view class="order-item-bottom">
				<view class="order-price">共{{orderList.details.length || '加载中'}}件，总价： <text class="price-symbol price-num">{{orderList.orderBean.payPrice || '加载中'}}</text> </view>
				<button class="delivery" @click="isDelivery">确认配送</button>
				<!-- <button class="delivery" @click="delivery" v-if="orderSelectList.length != 0">确认配送</button> -->
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
				pageNum: 1,
				orderId: '',
				allocationDetailId: '',
				orderList: [],
				orderSelectList: []
			}
		},
		components: {
			navBar
		},
		onReachBottom() {
			this.getOrderData(this.orderId)
		},
		onPullDownRefresh() {
			this.getOrderData(this.orderId)
		},
		onLoad(ops) {
			this.orderId = ops.orderId
			this.allocationDetailId = ops.allocationDetailId
			this.getOrderData(ops.orderId)
		},
		methods: {
			async getOrderData (id) {
				this.orderList.length = 0
				let params = {
					orderId: id
				};
				let data = await Api.apiCall('post', Api.client.order.getClientOrderDetail, params,true);
				if (data) {
					this.orderList = data.result
				}
				uni.stopPullDownRefresh();
			},
			orderSelect (index) {
				var indexVal = this.orderSelectList.indexOf(this.orderList.details[index].id)
				if(indexVal > -1) {
					this.orderSelectList.splice(indexVal, 1)
				} else {
					this.orderSelectList.push(this.orderList.details[index].id)
				}
			},
			async isDelivery () {
				if (this.orderSelectList.length === 0) {
					this.$api.msg('暂无选中的配送商品')
					return false;
				}
				uni.showModal({
					title: '提示',
					content: '是否确认配送？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if(res.confirm) {
							this.delivery()
						} else if (res.cancel){
						}
					},
				});
			},
			async delivery () {
				let  params  = {
					allocationDetailId: this.allocationDetailId,
					orderDetailId: []
				}
				for (let tmp in this.orderSelectList) {
					params.orderDetailId.push(this.orderSelectList[tmp])
				}
				var that = this
				let data = await Api.apiCallbackCall('post', Api.agent.agentOrder.delivery, params,true,false,function(data){
					console.log(data)
					if (data) {
						if (data.code === 0) {
							that.orderSelectList.length = 0
							that.getOrderData(that.orderId)
						} else {
							that.$api.msg(data.msg)
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.order-item{
		display: flex;
		flex-direction: column;
		padding:0 30upx;
		background: #fff;
		margin-top: 16upx;
		box-shadow: 0 0 4upx rgba(0, 0, 0, 0.1);
		.i-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80upx;
			font-size: 24upx;
			color: #999999;
			border-bottom: 1upx solid #eee;
			.time {
				color: #333333;
				font-size: 24upx;
			}
			.state {
				color: #49B1FD;
				font-size: 24upx;
			}
			.price-box {
				color: #999;
				font-size: 22upx;
				.num {
					color: #656565;
					font-size: 24upx;
				}
				.price {
					color: #FF1313;
					font-size: 32upx;
					font-weight: bold;
				}
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.order-list {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			width: 100%;
			.order-check {
				position: absolute;
				left: 25upx;
				z-index: 2;
				transform: scale(0.8);
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0 20upx 50upx;
			width: 100%;
			.goods-img{
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 10upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: 32upx;
					color: #333333;
				}
				.subtitle {
					color: #999999;
					font-size: 24upx;
				}
				.detail-price {
					color: #333333;
					font-size: 32upx;
					display: flex;
					justify-content: flex-start;
					width: 100%;
					line-height: 50upx;
					.price-num {
						color: #FF1313;
						font-size: 32upx;
						font-weight: blod;
						.price-sku {
							color: #999;
							font-size: 28upx;
							margin-left: 10upx;
							margin-right: 40upx;
							font-weight: normal;
						}
					}
				}
			}
			.flex {
				.status {
					font-size: 20upx;
					color: #666;
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 0;
			font-size: 32upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
		.order-item-bottom {
			margin: 10upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.order-price {
				font-size: 24upx;
				color: #666;
				.price-num {
					color: #FF1313;
					font-size: 24upx;
					font-weight: bold;
				}
			}
			.delivery {
				height: 50upx;
				line-height: 50upx;
				border-radius: 24upx;
				font-size: 24upx;
				width: 130upx;
				color: #fff;
				padding: 0;
				margin: 0;
				background-image: linear-gradient(#68BDFF,#49B1FE);
				&::after {
					border: none;
				}
			}
		}
	}
</style>
