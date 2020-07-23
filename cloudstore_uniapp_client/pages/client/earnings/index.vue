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
		<p style='text-align: center;line-height: 100upx;' v-if='financetDataList.length === 0'>暂无订单数据</p>
		<view class="goods-list">
			<view v-for="(item, index) in financetDataList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
				<view class="image-wrapper"><image :src="item.orderDetailsPic.goodsPicBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<view class="detail-title clamp">{{item.orderDetailsPic.goodsPicBean.goodsName}}</view>
					<view class="price-box">
						<view class="price">
							<text class="priceSale">收益: ￥{{item.profit}}</text>
							 <!-- <text class="priceSale">{{item.orderId}}</text>
							 <text class="pricemart">收益:￥{{item.profit}}</text> -->
						</view>
					</view>
					<view class="sub-title clamp">日期: {{item.orderBean.createTime}}</view>
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
						value: 2
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
						value: 3
					}],
					gridCol: 3,
					gridBorder: false,
					tabEarning: 2,
					financeData: 2,
					financetDataList: []
				}
			},
			components:{
				navBar
			},
			onLoad () {
				this.getFinanceData()
				this.lisFinancetData()
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
				async lisFinancetData (condition = '2', type = '1') {
					uni.showLoading({
						title: '正在加载',
						mask: false
					});
					let parmas = {
						userType: 'Client',
						status: condition,
						type: type,
						pageNum: '1',
						pageSize: '10',
					}
					let data = await Api.apiCall('post', Api.finance.list, parmas)
					if (data) {
						if (data.code === 0 && data.result != null) {
							const tmpData = data.result.records;
							for (let tmp in tmpData) {
								if (this.tabEarning === tmpData[tmp].profitStauts) {
									this.financetDataList.push(tmpData[tmp])
								}
							}
						}else{
							this.$api.msg(data.msg)
						}
						uni.hideLoading()
					}
				},
				earninngType (index) {
					this.financetDataList = []
					this.tabEarning = index
					if (index === 2) {
						this.lisFinancetData(2, 1)
					} else if (index === 1) {
						this.lisFinancetData(1, 1)
					} else if (index === 3) {
						this.lisFinancetData(2, 2)
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
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		background: #fff;
		.goods-item {
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			padding: 20rpx 30rpx;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
			margin-top: 10rpx;
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
				display: flex;
				align-items: flex-end;
			}
			.price-box {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 100%;
				height: 20%;
				.price {
					.priceSale {
						color: red;
						font-size: 35upx;
						margin-right: 15upx;
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
