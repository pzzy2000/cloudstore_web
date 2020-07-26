<template>
	<view class="container">
		<!-- #ifdef H5 -->
		<!-- <view class="" @click="search()" style="background: #FFFFFF;height: 80upx;display: flex;justify-content: center;align-items: center;">
			<input class="" type="text" value="" placeholder="输入关键字搜索" style="font-size: 28upx;background: #F5F5F5;height: 60upx;width: 90%;border-radius: 50upx;text-align: center;" />
		</view> -->
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- <view class="" @click="search()" style="background: #FFFFFF;height: 80upx;display: flex;justify-content: center;align-items: center;" :style="[{'margin-top': statusBarHeight+45+'px'}]">
			<input class="" type="text" value="" placeholder="输入关键字搜索" style="font-size: 28upx;background: #F5F5F5;height: 60upx;width: 90%;border-radius: 50upx;text-align: center;" />
		</view> -->
		<!-- #endif -->
		<!-- <nav-bar type='fixed'>我的小店</nav-bar> -->
		<view class="agency-main">
			<view class="agency-header">
				<image :src="user.detailUrl" mode="" alt='头像' class="info-img"></image>
				<view class="header-info">
					<text class="title clamp">{{agentInfo.shopName}}</text>
					<!-- <text class="address clamp">{{agentInfo.detailAddress}}</text> -->
				</view>
			</view>
			<view class="agency-list">
				<view class="agency-list-main">
					<p class='agency-list-title'>代理商品</p>
					<text class="span">{{getAgentOrderCount.agentGoodsNumber}}</text>
				</view>
				<view class="agency-list-main">
					<p class='agency-list-title'>待付款</p>
					<text class="span">{{getAgentOrderCount.waitOrder}}</text>
				</view>
				<view class="agency-list-main">
					<p class='agency-list-title'>已付款</p>
					<text class="span">{{getAgentOrderCount.payOrder}}</text>
				</view>
			</view>
			<view class="agency-apply">
				<view class="agency-apply-main">
					<view class="apply-detail" v-for="(item, index) in apply" :key='index' @click="toAgentList(item)">
						<text :class="item.icon"></text>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 今日上新 -->
			<view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						今日上新
					</view>
				</view>
				<view class="goods-list">
					<view v-for="(goods, index) in updateList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<view class="detail-title clamp">{{ goods.goodsPicesBean.goodsName }}</view>
							<view class="sub-title clamp text-gray">{{ goods.goodsPicesBean.goodsSubtitle }}</view>
							<view class="active clamp text-gray">{{ goods.activeBean.name }}</view>
							<view class="price-box">
								<view class="price">
									 <text class="priceSale">￥{{ goods.goodsPicesBean.salePrice }}</text>
									 <text class="pricemart">￥{{ goods.goodsPicesBean.martPrice}}</text>
								</view>
								<button class="price-btn" @click.stop="shareSave(goods)">立即分享</button>
							</view>
						</view>	
					</view>
				</view>
			</view>
			<!-- 分享 -->
			<share ref="share" :contentHeight="580" :shareList="shareList"></share>
			<tabbar :role="'agent'" :ids="'awddl'"></tabbar>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import share from '@/components/share';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				agentInfo: {
					name: '' || '暂无店铺信息',
					detailAddress: '' || '暂无店铺地址信息'
				},
				user: {
					name:'',
					url:'',
					detailUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593358672989&di=a7c323de2bac0269ead9e7ab0531ba13&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F9662a766b2e14418b22ed6e8185913c3e7562ab455df-j8mU0R_fw658'
				},
				statusBarHeight: '',
				height: '',
				apply: [
					{
						name: '代理商品',
						detailListUrl: './agentGoodsList/agentGoodsList',
						icon: 'icon text-blue cuIcon-shop'
					},
					{
						name: '订单管理',
						detailListUrl: './order/order',
						icon: 'icon .text-yellow cuIcon-cascades'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-green cuIcon-favor'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-mauve cuIcon-ticket'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-brown cuIcon-form'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-red cuIcon-refund'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-blue cuIcon-friend'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						icon: 'icon text-purple cuIcon-present'
					}
				],
				goodsList: [],
				updateList: [],
				shareList: [
					{
					  icon: "/static/temp/share_wechat.png",
					  text: "微信好友",
					  type: 1
					}
				],
				userType: '',
				goodsName: '',
				goodsId: '',
				agentGoodsId: '',
				shareClientId: '',
				getAgentOrderCount: {
					agentGoodsNumber: 0,
					payOrder: 0,
					toDayOrder: 0,
					waitOrder: 0
				},
				imageUrl: ''
			}
		},
		components:{
			navBar, share
		},
		onLoad () {
			this.userType = uni.getStorageSync('userInfo').agent
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.height = uni.getSystemInfoSync().windowHeight - (this.statusBarHeight+80)
			this.getAgentInfo()
			this.getDateList()
			this.getAgentOrderCountData()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				this.$refs.share.toggleMask();
				var shareObj = {
					title: this.goodsName,
					imageUrl: this.imageUrl,
					params: {
						goodsId: this.goodsId,
						agentGoodsId: this.agentGoodsId,
						shareClientId: this.shareClientId || '-1',
						userType: this.userType
					},
					path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType='+this.userType,
				}
			}
			return shareObj
		},
		methods: {
			async getAgentOrderCountData () {
				let params = {}
				let data = await Api.apiCall('post',Api.agent.order.getAgentOrderCount, params);
				if(data) {
					if (data.code === 0) {
						this.getAgentOrderCount = data.result
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			async getAgentInfo () {
				let params = {}
				let data = await Api.apiCall('post',Api.agent.agentInfo.getAgentShop, params);
				if(data) {
					this.agentInfo.shopName = data.result.name || '暂无店铺信息'
					this.agentInfo.detailAddress = data.result.detailAddress || '暂无店铺地址信息'
				}
			},
			search () {
			},
			toAgentList (data) { //去个人的代理商品列表
				var url = data.detailListUrl
				uni.navigateTo({
					url: url,
				});
			},
			async getDateList () {
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let params = {
					pageNum:1,
					pageSize: 10
				}
				let list = await Api.apiCall('post', Api.agent.user.dateList, params);
				if (list) {
					if (list.code === 0) {
						this.updateList = list.result.records
					} else {
						this.$api.msg(list.msg)
					}
					uni.hideLoading()
				}
			},
			navToDetailPage (item) {
				let  agentGoodsId = item.id,goodsId =item.goodsId
				
				uni.navigateTo({
					// goodsId=7604921082513985536&userType=agent&agentGoodsId=7630608619278438400
					url: '/pages/agent/goods/goodsDetail/goodsDetail?agentGoodsId='+agentGoodsId+'&goodsId='+goodsId+'&userType=agent',
				});
			},
			toShare () {
				this.$refs.share.toggleMask();
			},
			async shareSave (item) {
				console.log(item)
				this.imageUrl = item.goodsPicesBean.goodsPhotos[0].url
				this.goodsId = item.goodsId
				this.agentGoodsId = item.id
				this.goodsName = item.goodsPicesBean.goodsName
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let params = {
					'agentGoodsId': this.agentGoodsId,
					'shareId': this.shareClientId || '-1',
					'type': this.userType
				} 
				let data = await Api.apiCall('post', Api.agent.share.save, params);
				if (data) {
					uni.hideLoading() 
					if (data.code === 0) {
						this.shareClientId = data.result.id
						if (this.shareClientId) {
							this.toShare()
						}
					}else{
						uni.showToast({
							title: data.msg
						});
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
page,.container {
	height: 100%;
}
.agency-main{ 
	padding-bottom: 100upx;
	margin: 0 auto;
	position: relative;
	.agency-header {
		display: flex;
		justify-content: flex-start;
		padding-left: 30upx;
		height: 300upx;
		background: #00a79d;
		background-size: 100% 100%;
		align-items: center;
		uni-image{
			height: 90upx;
			width: 90upx;
			background-color: red;
		}
		.info-img {
			width: 90upx;
			height: 90upx;
			border-radius: 50%;
		}
		.header-info {
			font-size: 20upx;
			color: #999;
			padding: 30upx;
			.title {
				color: #fff;
				font-size: 35upx;
				display: block;
			}
			.address {
				color: #fff;
				font-size: 25upx;
			}
		}
	}
	.agency-list {
		display: flex;
		justify-content: space-between;
		font-size: 25upx;
		text-align: center;
		position: absolute;
		width: 94%;
		top: 220upx;
		background: #fff;
		border-radius: 10upx;
		margin-left: -47%;
		left: 50%;
		.agency-list-main {
			padding: 20upx;
			width: 33%;
			.agency-list-title {
				margin-bottom: 10rpx;
			}
			.span {
				display: inline-block;
				color: #303133;
				line-height: 50upx;
				color: #e54d42;
			}
		}
	}
	.agency-apply {
		width: 94%;
		margin: 0 auto;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 20upx;
		uni-image {
			height: 80upx;
			width: 80upx;
			display: block;
			margin: 0 auto;
		}
		span {
			display: block;
		}
		.agency-apply-title {
			font-size: 40upx;
			line-height: 80upx;
			margin-top: 30upx;
			display: inline-block;
		}
		.agency-apply-main {
			display: flex;
			flex-wrap: wrap;
			margin-top: 70rpx;
			.apply-detail {
				width: 25%;
				font-size: 26upx;
				color: #303133;
				text-align: center;
				padding-top: 20upx;
				margin-bottom: 20rpx;
				.icon {
					display: block;
					font-size: 50rpx;
					margin-bottom: 10rpx;
				}
			}
			.apply-img{
				height: 60upx;
				width: 60upx;
				display: block;
				margin: 0 auto;
			}
			span {
				display: block;
				font-size: 20upx;
			}
		}
	}
}
.faddish-main {
	width: 94%;
	margin: 0 auto;
	background: #fff;
	padding-top: 60upx;
	border-radius: 10upx;
	position: relative;
	.title-main {
		font-size: 30upx;
		padding: 5upx 10upx;
		background-color: #b48e4f;
		border-bottom-right-radius: 10upx;
		border-bottom-left-radius: 10upx;
		position: absolute;
		left: 20upx;
		top: 0;
		color: #fff;
		
	}
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
		font-size: 12px;
		height: 100%;
		.detail-title {
			font-size: 14px;
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
		.sub-title {
			height: 20%;
			display: flex;
			align-items: flex-end;
			font-size: 24upx;
		}
		.active {
			font-size: 24upx;
			height: 35%;
			display: flex;
			align-items: flex-end;
		}
		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 100%;
			height: 25%;
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
