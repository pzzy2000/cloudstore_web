<template>
	<view>
		<nav-bar>我的收益</nav-bar>
		<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="item.value" v-if="index<gridCol*2" @click="earninngType(item.value)">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}:{{item.num}}</text>
			</view>
		</view>
		<p style='text-align: center;line-height: 100upx;' v-if='financetDataList.length === 0'>暂无{{tabText}}数据</p>
		<view class="goods-list">
			<view v-for="(item, index) in financetDataList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
				<view class="image-wrapper"><image :src="item.orderDetailsPic.goodsPicBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<view class="detail-title clamp">{{item.orderDetailsPic.goodsPicBean.goodsName}}</view>
					<view class="sub-title clamp">订单时间: {{item.orderBean.createTime}}</view>
					<view class="price-box">
						<view class="price">
							收益:
							<text v-if="type==2&&status==2" class="priceSale">{{item.points}}积分</text>
							<text class="priceSale" v-else>
								￥{{item.profit}}
							</text>
							 <!-- <text class="priceSale">{{item.orderId}}</text> -->
							 <text class="line">/</text>
							 <text class="text-gray">总价:{{item.orderDetailsPic.payPrice}}</text>
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
						num: '计算中',
						value: 0
					}, {
						cuIcon: 'refund',
						color: 'orange',
						badge: 0,
						name: '待收益',
						num: '计算中',
						value: 1
					}, {
						cuIcon: 'goods',
						color: 'yellow',
						badge: 0,
						name: '积分',
						num: '计算中',
						value: 2
					}],
					gridCol: 3,
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
				this.lisFinancetData(1,1)
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
								if (this.tabEarning === tmpData[tmp].profitStauts) {
									this.financetDataList.push(tmpData[tmp])
								}
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
						this.tabText = '积分'
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
	.cu-list.menu-avatar>.cu-item .action {
		width: auto;
		text-align: right;
	}
	.cu-list.menu-avatar>.cu-item .content {
		width: 40%;
	}
	.cu-list.grid {
		margin-bottom: 20upx;
	}
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		background: #fff;
		width: 94%;
		.goods-item {
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
				height: 60%;
				.number {
					color: #999;
					font-size: 26upx;
					line-height: 50upx;
					height: 50upx;
				}
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
