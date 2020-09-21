<template>
	<view>
		<nav-bar backState="1000">配送管理</nav-bar>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect(item)" :data-id="index">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="agent-order-main">
			<view class="order-item" v-for="item in orderList" :key="item.ordersId" @click="toDetail(item.ordersId, item.allocationDetailId)">
				<view class="order-item-top">
					<text class="order-item-time">下单时间：{{item.ordersBean.createTime}}</text>
					<template>
						<text class="text-orange" v-if="item.ordersBean.orderStatus === 'wait'">待支付</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'pay'">支付待确认</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'payed'">已支付</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'peisong'">待配送</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'refunding'">退款中</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'refunded'">已退款</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'peisoged'">已配送</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'complete'">已完成</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'returnsing'">退货中</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'returns'">已退货</text>
						<text class="text-orange" v-else-if="item.ordersBean.orderStatus === 'close'">超时关闭</text>
					</template>
				</view>
				<view class="order-item-content">
					<view class="order-item-info">
						<image src="/static/logo.png" mode="" class="order-item-img"></image>
						<view class="info-main">
							<view class="info-name">
								<text class="name">{{item.ordersBean.clientAddressBean.name}}</text>
								<text class="phone">{{item.ordersBean.clientAddressBean.phone}}</text>
							</view>
							<text class="info-address">{{item.ordersBean.clientAddressBean.provinceBean.name}}{{item.ordersBean.clientAddressBean.cityBean.name}}{{item.ordersBean.clientAddressBean.areaBean.name}}{{item.ordersBean.clientAddressBean.detailAddress}}</text>
						</view>
					</view>
					<button>查看</button>
				</view>
				<view class="order-item-bottom">
					<text class=".order-item-id">订单编号：{{item.ordersId}}</text>
					<template>
						<text class="text-orange"  >1212</text>
					</template>
				</view>
			</view>
		</view>
		<view class="earning-empty" v-if='orderList.length === 0'>
			<image src="/static/client/earning-logo.png" mode="" class="earning-logo"></image>
			<view class="earning-empty-text">暂没有{{orderTypeName}}订单</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				TabCur: 0,
				tabList: [
					{
						id: 0,
						name: '全部',
						type: '',
					},
					{
						id: 1,
						name: '待配送',
						type: 'dps'
					},
					{
						id: 2,
						name: '已配送',
						type: 'yps'
					}
				],
				pageNum: 1,
				orderList: [],
				orderType: '',
				orderTypeName: '',
				url: '/static/logo.png',
			}
		},
		components: {
			navBar
		},
		onShow () {
			this.getOrderList()
			this.orderList.length = 0
			this.pageNum = 1
		},
		onReachBottom() {
			this.pageNum ++;
			this.getOrderList()
			// this.pageNum = this.pageNum + 1;
		},
		onPullDownRefresh() {
			this.orderList.length = 0
			this.pageNum  = 1;
			this.getOrderList()
		},
		methods: {
			async getOrderList () {
				let parmas = {
					pageNum: this.pageNum,
					pageSize: 10,
					status: this.orderType
				}
				let data = await Api.apiCall('post', Api.agent.agentOrder.list, parmas, true)
				if (data) {
					if (data.result.records.length != 0) {
						this.orderList = this.orderList.concat(data.result.records)
					} else {
						this.$api.msg('没有更多了')
						this.pageNum--
					}
				}
				uni.stopPullDownRefresh();
			},
			tabSelect(item) {
				this.TabCur = item.id
				this.orderType = item.type
				this.orderTypeName = item.id === 1 || item.id === 2 ? item.name : ''
				this.pageNum  = 1;
				this.orderList.length = 0
				this.getOrderList()
			},
			toDetail(orderId, allocationDetailId) {
				uni.navigateTo({
					url: '/pages/agent/info/order/orderDetail?orderId='+orderId+'&allocationDetailId='+allocationDetailId
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.agent-order-main {
		width: 100%;
		background-color: #f5f5f5;
		.order-item{
			width: 100%;
			padding: 0 30upx;
			background-color: #fff;
			margin-top: 20upx;
			.order-item-top{
				display: flex;
				line-height: 70upx;
				height: 70upx;
				color: #FE961C;
				font-size: 24upx;
				justify-content: space-between;
				border-bottom: 1upx solid #EEEEEE;
				.order-item-time {
					color: #999999;
					font-size: 24upx;
				}
			}
			.order-item-content {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				padding: 10upx 0;
				.order-item-info {
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					width: calc(100% - 145upx);
					.order-item-img {
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
						margin-right: 20upx;
					}
					.info-main {
						height: 100%;
						.info-name {
							.name {
								color: #333;
								font-size: 24upx;
								margin-right: 20upx;
								line-height: 50upx;
							}
							.phone {
								color: #000;
								font-size: 24upx;
							}
						}
						.info-address {
							font-size: 24upx;
							color: #666666;
						}
					}
				}
				button {
					width: 145upx;
					height: 45upx;
					line-height: 45upx;
					text-align: center;
					background-image: linear-gradient(180deg,#68BDFF,#49B1FE);
					border-radius: 20upx;
					color: #fff;
					font-size: 24upx;
					margin: 0;
					padding: 0;
					&::after {
						border: none;
					}
				}
			}
			.order-item-bottom {
				display: flex;
				line-height: 70upx;
				height: 70upx;
				color: #FE961C;
				font-size: 24upx;
				justify-content: space-between;
				border-top: 1upx solid #eee;
				.order-item-id {
					color: #999999;
					font-size: 24upx;
				}
			}
		}
	}
	.earning-empty {
		padding-top: 100upx;
		.earning-logo {
			width: 300upx;
			height: 180upx;
			margin: 0 auto;
			display: block;
		}
		.earning-empty-text {
			color: #999999;
			font-size: 30upx;
			white-space: 5upx;
			line-height: 150upx;
			width: 100%;
			text-align: center;
			display: block;
		}
		.earning-empty-btn {
			color: #F1F1F1;
			background-color: #39A9FF;
			white-space: 5upx;
			width: 500upx;
			height: 72upx;
			text-align: center;
			border: none;
			border-radius: 36upx;
			&:after {
				border: none
			}
		}
	}
</style>
