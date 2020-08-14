<template>
	<view>
		<nav-bar backState="1000">{{afterSaleTitle}}</nav-bar>
		<view v-for="item in afterSaleList" class="order-item" :key= 'item.orderId' @click="toAfterSale(item)">
			<view class="i-top">
				<text class="order-id">订单号: {{item.orderId}}</text>
			</view>
			<view class="goods-box-single" v-for="(order, index1) in item.orderDetail" :key="index1">
				<image class="goods-img" :src="order.detailPic.goodsSkuBean.picUrl" mode="aspectFill"></image>
				<view class="right">
					<text class="title clamp">{{order.detailPic.goodsBean.goodsName}}</text>
					<view class="attr-box">
						规格：{{order.detailPic.goodsSkuBean.skuValue}}
					</view>
					<!-- <text class="attr-box">{{order.detailPic.price}}*{{order.detailPic.quantity}}</text> -->
					<view class="price">
						<text class="price-num">￥{{order.detailPic.price}}</text>
						<text class="price-quantity"> × {{order.detailPic.quantity}}</text>
					</view>
					<view class="payPrice">
						合计金额：<text class="payPrice-detial">￥{{order.detailPic.payPrice}}</text>
					</view>
				</view>
				<view class="flex align-center">
					<view class="" v-if="item.status === 0">申请中</view>
					<view class="" v-else-if="item.status === 1">审核通过</view>
					<view class="" v-else-if="item.status === 2">审核拒绝</view>
				</view>
			</view>
			<view class="i-top b-b">
				<text class="time">订单时间: {{item.orderBean.createTime}}</text>
			</view>
			<!-- <template> -->
					<!-- 已配送 -->
					<!-- <view class="margin-tb-sm text-right" v-if="item.orderStatus === 'peisoged'">
						<button class="cu-btn round" @click.stop="toAfterSale('/pages/client/order/afterSale',item)">申请售后</button>
					</view> -->
					<!-- 待配送 -->
					<!-- <view class="margin-tb-sm text-right" v-if="item.orderStatus === 'peisong'">
						<button class="cu-btn round">申请退款</button>
					</view> -->
					<!-- <view class="margin-tb-sm text-right" v-if="item.orderStatus === 'wait'">
						<button class="cu-btn round">立即支付</button>
						<button class="cu-btn round">取消订单</button>
					</view>
					<view class="margin-tb-sm text-right" v-if="item.orderStatus === 'payed'">
						<button class="cu-btn round">再次购买</button>
						<button class="cu-btn round">删除订单</button>
					</view>
					<view class="margin-tb-sm text-right" v-if="item.orderStatus === 'peisong'">
						<button class="cu-btn round">联系卖家</button>
						<button class="cu-btn round">查看物流</button>
					</view>
					<view class="margin-tb-sm text-right" v-if="item.orderStatus === 'close'">
						<button class="cu-btn round">删除订单</button>
						<button class="cu-btn round">售后咨询</button>
					</view>
					<view class="margin-tb-sm text-right" v-if="item.orderStatus === 'complete'">
						<button class="cu-btn round">前去评价</button>
						<button class="cu-btn round">再次购买</button>
					</view> -->
			<!-- </template> -->
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				afterSaleTitle:'售后列表',
				afterSaleList: [],
				pageNum: 1,
			}
		},
		components: {
			navBar
		},
		onLoad() {
			this.getAftersaleList()
		},
		onPullDownRefresh() { //下拉刷新
			this.pageNum = 1
			this.afterSaleList = []
			this.getAftersaleList();
		},
		onReachBottom() { //上拉加载
		 	this.pageNum = this.pageNum + 1;
			this.getAftersaleList()
		},
		methods: {
			async getAftersaleList () {
				let parmas = {
					pageNum: this.pageNum,
					pageSize: 10
				}
				let data = await Api.apiCall('post', Api.client.order.aftersaleList, parmas, true)
				if (data) {
					if (data.result.records.length != 0) {
						if (this.afterSaleList.length) {
							this.afterSaleList.push(data.result.records)
						} else {
							this.afterSaleList = data.result.records
						}
					}
				}
				uni.stopPullDownRefresh();
			},
			toAfterSale (item) {
				// uni.navigateTo({
				// 	url: '/pages/client/order/afterSale?id='+item.orderId,
				// });
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
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.order-id{
				color: #333;
				font-size: 24upx;
			}
			.time{
				color: #999;
			}
			.payPrice{
				color: #FF1313;
				color: 32upx;
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
			padding: 20upx 0;
			border-top: 1upx solid #eee;
			align-items: center;
			.goods-img{
				display: block;
				width: 124upx;
				height: 124upx;
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
					color: #333;
				}
				.attr-box{
					font-size: 26upx;
					color: #999;
					line-height: 50upx;
				}
				.price{
					font-size: 32upx;
					color: #FF1313;
					.price-quantity {
						color: #333333;
						font-size: 32upx;
						letter-spacing: 4upx;
						margin-left: 20upx;
					}
				// 	&:before{
				// 		content: '￥';
				// 		font-size: $font-sm;
				// 		margin: 0 2upx 0 8upx;
				// 	}
				}
				.payPrice {
					color:#353535;
					font-size: 32upx;
					.payPrice-detial {
						color: #FF1313;
						font-size: 28upx;
						display: inline-block;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
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
	}
</style>
