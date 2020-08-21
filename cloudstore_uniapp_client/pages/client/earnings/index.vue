<template>
	<view>
		<nav-bar :bgColor="['#66bdff','#3ebdff']" type="fixed">我的收益</nav-bar>
		<view class="earning-main">
			<image src="/static/index-top-bg.png" mode="" class="earning-bg"></image>
			<view class="earning-main-computed">
				<view class="earning-title">历史总收益</view>
				<view class="earning-number">{{cuIconList[0].num}}</view>
				<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
					<view class="cu-item earnin-content" v-for="(item,index) in cuIconList" :key="item.value" v-if="index<gridCol*2" @click="earninngType(item.value)">
						<text class="num">{{item.num}}</text>
						<view class="title">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="earning-empty" v-if='financetDataList.length === 0'>
			<image src="../../../static/client/earning-logo.png" mode="" class="earning-logo"></image>
			<view class="earning-empty-text">您还没有任何收益记录哦！</view>
				<button type="default" class="earning-empty-btn" @click="toCategory">我要下单赚收益</button>
		</view>
		<view class="order-conent">
			<view class="order-list" v-for="(item, index) in financetDataList" :key="index">
				<view class="order-list-top">
					<text>
						下单时间：{{item.orderBean.createTime}}
					</text>
					<text>
						{{item.financeType.name}}
					</text>
				</view>
				<view class="order-list-content">
					<image :src="item.orderDetailsPic.goodsPicBean.goodsPhotos[0].url" mode="aspectFill" class="image-wrapper"></image>
					<view class="goods-detail">
						<view class="detail-title clamp">{{item.orderDetailsPic.goodsPicBean.goodsName}}</view>
						<view class="detail-sku">产品规格：{{item.orderDetailsPic.goodsSkuBean.skuValue}}</view>
						<view class="detail-price">
							<text class="num">下单数量 × {{item.orderDetailsPic.quantity}}</text>
							<text>订单价格：{{item.orderDetailsPic.payPrice}}</text>
						</view>
					</view>
				</view>
				<view class="order-list-bottom">
					<text>
						订单号： {{item.orderId}}
					</text>
					<!-- 收益 -->
					<view class="profit" v-if="type === 1">
						<text v-if="status === 1">待收益：</text>
						<text v-if="status === 2">已收益：</text>
						<text class="profit-num">{{item.profit}}元</text>
					</view>
					<!-- 积分 -->
					<view class="profit" v-if="type === 2">
						<text v-if="status === 1">待结算：</text>
						<text v-if="status === 2">已结算：</text>
						<text class="profit-num">{{item.points}}积分</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
			data(){
				return {
					cuIconList: [{
						cuIcon: 'recharge',
						color: 'red',
						badge: 0,
						name: '已收益',
						num: '00.00',
						value: 0
					}, {
						cuIcon: 'refund',
						color: 'orange',
						badge: 0,
						name: '待收益',
						num: '00.00',
						value: 1
					}, {
						cuIcon: 'goods',
						color: 'yellow',
						badge: 0,
						name: '已结算积分',
						num: '0',
						value: 2
					},{
						cuIcon: 'goods',
						color: 'yellow',
						badge: 0,
						name: '待结算积分',
						num: '0',
						value: 3
					}],
					gridCol: 4,
					gridBorder: false,
					tabEarning: 2,
					tabText: '已收益',
					pageNum: 1,
					status: 2,
					type: 1,
					financeData: 2,
					financetDataList: []
				}
			},
			components:{
				navBar
			},
			onLoad () {
				this.getFinanceData()
				this.lisFinancetData(2,1)
			},
			onPullDownRefresh() { //下拉刷新
				this.pageNum = 1;
				this.financetDataList = []
				this.getFinanceData()
				this.lisFinancetData(this.status, this.type)
			},
			onReachBottom() { //加载更多
				this.pageNum = this.pageNum + 1;
				this.lisFinancetData(this.status, this.type)
			},
			methods:{
				async getFinanceData () {
					let parmas = {
						userType: 'Client'
					}
					let data = await Api.apiCall('post', Api.finance.get, parmas)
					if (data) {
						if (data.code === 0 && data.result.length != 0) {
							this.cuIconList[0].num =  data.result.profited
							this.cuIconList[1].num =  data.result.profiting
							this.cuIconList[2].num =  data.result.pointsed
							this.cuIconList[3].num =  data.result.pointsing
						}else{
							this.$api.msg(data.msg)
						}
					}
				},
				async lisFinancetData (status , type) {
					uni.showLoading({
						title: '正在加载',
						mask: false
					});
					let parmas = {
						userType: 'Client',
						status: status,
						type: type,
						pageNum: this.pageNum,
						pageSize: '10',
					}
					let data = await Api.apiCall('post', Api.finance.list, parmas)
					if (data) {
						uni.stopPullDownRefresh();
						if (data.code === 0 && data.result.records != false) {
							const tmpData = data.result.records;
							for (let tmp in tmpData) {
								this.financetDataList.push(tmpData[tmp])
							}
							uni.hideLoading()
						}else{
							uni.hideLoading()
							this.$api.msg('没有更多了')
						}
					}
				},
				earninngType (index) {
					this.financetDataList = []
					this.tabEarning = index
					this.pageNum = 1
					if (index === 0) {
						this.lisFinancetData(2, 1)
						this.status = 2;
						this.type = 1;
						this.tabText = '已收益'
					} else if (index === 1) {
						this.lisFinancetData(1, 1)
						this.status = 1;
						this.type = 1;
						this.tabText = '待收益'
					} else if (index === 2) {
						this.lisFinancetData(2, 2)
						this.status = 2;
						this.type = 2;
						this.tabText = '已收益积分'
					} else if (index === 3) {
						this.lisFinancetData(1, 2)
						this.status = 1;
						this.type = 2;
						this.tabText = '待收益积分'
					}
				},
				toCategory(){
					uni.switchTab({
						url: '/pages/agent/goods/category/category'
					})
				}
			}
		}
</script>

<style scoped lang="scss">
	.earning-main {
		position: relative;
		width: 100%;
		padding-bottom: 30upx;
		.earning-bg {
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}
		.earning-main-computed {
			width: 100%;
			color: #fff;
			text-align: center;
			.earning-title {
				font-size: 30upx;
				margin: 0 30upx;
				line-height: 50upx;
			}
			.earning-number {
				font-size: 72upx;
				line-height: 110upx;
				font-weight: blod;
				white-space: 5upx;
			}
		}
	}
	.cu-list.grid.no-border {
		padding: 0;
	}
	.cu-list.grid.no-border >.cu-item {
		padding: 0;
	}
	.earnin-content {
		color: #fff;
		.title {
			font-size: 30upx;
		}
		.num {
			font-size: 26upx;
			color: #fff !important;
		}
	}
	.cu-list.grid {
		background: none;
	}
	.cu-list.menu-avatar>.cu-item {
		color: #fff;
	}
	.cu-list.menu-avatar>.cu-item .action {
		width: auto;
		text-align: right;
	}
	.cu-list.menu-avatar>.cu-item .content {
		width: 40%;
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
	/* 商品列表 */
	.order-conent {
		width: 100%;
		padding: 20upx 20upx 0;
		.order-list {
			border-radius: 15upx;
			background-color: #FFFFFF;
			margin-bottom: 10upx;
			.order-list-top {
				display: flex;
				justify-content: space-between;
				height: 80upx;
				line-height: 80upx;
				color: #666666;
				font-size: 22upx;
				padding: 0 30upx;
				border-bottom: 1upx solid #F1F1F1;
			}
			.order-list-content {
				height: 230upx;
				padding: 20upx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 100%;
				.image-wrapper {
					width: 164upx;
					height: 164upx;
				}
				.goods-detail {
					margin-left: 30upx;
					line-height: 60upx;
					width: 65%;
					.detail-title {
						color: #333;
						font-size: 30upx;
						letter-spacing: 4upx;
					}
					.detail-sku {
						color: #999999;
						font-size: 24upx;
					}
					.detail-price {
						color: #999999;
						font-size: 24upx;
						display: flex;
						justify-content: space-between;
					}
				}
			}
			.order-list-bottom {
				border-top: 1upx solid #F1F1F1;
				display: flex;
				justify-content: space-between;
				color: #666666;
				font-size: 22upx;
				height: 80upx;
				align-items: center;
				padding: 0 20upx;
				.profit {
					font-size: 28upx;
					color: #999999;
					.profit-num {
						color: #FF1313;
						font-size: 36upx;
					}
				}
			}
		}
	}
</style>
