<template>
	<view>
		<view class=" earning-main">
			<nav-bar :bgColor="['#74c5fd','#49b2fe']" bgColorAngle="90">我的收益</nav-bar>
			<image src="/static/index-top-bg.png" mode="" class="earning-bg"></image>
			<view class="earning-main-computed">
				<view class="earning-title">历史总收益</view>
				<view class="earning-number">00.00</view>
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
			<button type="default" class="earning-empty-btn">我要下单赚收益</button>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in financetDataList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
				<view class="image-wrapper"><image :src="item.orderDetailsPic.goodsPicBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<view class="detail-title clamp">{{item.orderDetailsPic.goodsPicBean.goodsName}}</view>
					<view class="detail-sku clamp">规格：{{item.orderDetailsPic.goodsSkuBean.skuValue}}</view>
					<view class="sub-title clamp">订单时间: {{item.orderBean.createTime}}</view>
					<view class="price-box">
						<view class="price">
							<text v-if="status==1" class="priceSale" style="color:#9E9E9E;">待结算:</text> 
							<text  v-else class="priceSale" style="color:#9E9E9E;"> 以结算:</text> 
							<text v-if="type==2" class="priceSale">{{item.points}} 积分</text>
							<text class="priceSale" v-else>
								￥{{item.profit}}
							</text>
							 <!-- <text class="priceSale">{{item.orderId}}</text> -->
							 <text class="line">/</text>
							 <text class="text-gray">总价:{{item.orderDetailsPic.payPrice}}</text>
							 <text class="text-gray" style="color:#9E9E9E;font-size: 26upx;">[{{item.financeType.name}}]</text>
						</view>
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
						if (data.code === 0 && data.result != null) {
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
						this.tabText = '已积分'
					}else if (index === 3) {
						this.lisFinancetData(1, 2)
						this.status = 1;
						this.type = 2;
						this.tabText = '待积分'
					}
					// if (index === 1 || index === 2) {
					// 	this.financetDataList = []
					// 	this.tabEarning = index
					// 	this.lisFinancetData()
					// }
				}
			}
		}
</script>

<style scoped lang="scss">
	.earning-main {
		position: relative;
		height: 400upx;
		width: 100%;
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
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		width: 94%;
		.goods-item {
			background: #fff;
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			padding: 20upx 30upx;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
			margin-bottom: 10upx;
		}
		.image-wrapper {
			width: 200upx;
			height:200upx;
			border-radius: 3upx;
			overflow: hidden;
			image {
				opacity: 1;
				border-radius: 15upx;
			}
		}
		.goods-detail {
			display: inline-block;
			margin-left: 20upx;
			width: 65%;
			font-size: 25upx;
			height: 100%;
			.detail-title {
				font-size: 30upx;
				color: #000;
				width: 100%;
				height: 20%;
				.number {
					color: #999;
					font-size: 26upx;
					line-height: 50upx;
					height: 50upx;
				}
			}
			.detail-sku {
				font-size: 28upx;
				color: #999;
				height: 40%;
			}
			.sub-title {
				height: 20%;
				text-align: right;
			}
			.price-box {
				text-align: right;
				// display: flex;
				// justify-content: space-between;
				// align-items: flex-end;
				width: 100%;
				height: 20%;
				.price {
					font-size: 30upx;
					.priceSale {
						color: red;
						font-size: 25upx;
					}
					.line {
						margin: 0 15upx;
					}
					.pricemart {
						color: #999;
						font-size: 25upx;
						text-decoration: line-through;
					}
				}
			}
			.price-btn {
				padding: 0;
				margin: 0;
				font-size: 24upx;
				padding: 0 20upx;
				height: 50upx;
				line-height: 50upx;
				border-radius: 40upx;
				color: #fff;
				background: #ff4f50;
			}
		}
	}
</style>
