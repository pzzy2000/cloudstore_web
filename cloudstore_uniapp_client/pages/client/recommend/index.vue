<template>
	<view class="container">
		<!-- <nav-bar>推荐</nav-bar> -->
		<view class="agency-main">
			<view class="agency-header">
				<!-- <image :src="detailUrl" mode="" alt='头像' class="info-img"></image> -->
				<view class="header-info">
					<text class="title samp">{{shopInfo.name}}</text>
					<!-- <text class="header-address">地址：{{shopInfo.detailAddress}}</text> -->
				</view>
				<image src="/static/arc.png" mode="" class="agency-header-bg"></image>
			</view>
			<view class="agency-apply">
				<view class="agency-apply-main">
					<view class="apply-detail" v-for="(item, index) in apply" :key='index'>
						<image :src="item.imgUrl" mode="" class="apply-img"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						最新商品
					</view>
				</view>
				<view class="goods-list">
					<view v-for="(goods, index) in newsList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<view class="detail-title clamp">{{ goods.goodsPicesBean.goodsName }}</view>
							<view class="sub-title clamp">
								<button class="cu-btn round bg-orange sm" v-if="!goods.activeBean.name">无活动</button>
								<button class="cu-btn round bg-orange sm" v-else>{{goods.activeBean.name}}</button>
							</view>
							<view class="price-box">
								<!-- <view class="clamp subhead">供应商:{{goods.supplierShopBean.shopName}}</view> -->
								<view class="price">
									 <text class="priceSale">￥{{ goods.goodsPicesBean.salePrice }}</text>
									 <text class="pricemart">￥{{ goods.goodsPicesBean.martPrice}}</text>
								</view>
							</view>
						</view>	
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/zhouWei-navBar';
import Api from '@/common/api.js'
export default {
		data(){
			return {
				shopInfo: {
					name: '',
					detailAddress: '' || '暂无地址'
				},
				name:'',
				url:'',
				newsList: '',
				apply: [
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					},
					{
						name: '敬请期待',
						detailListUrl: '',
						imgUrl: '/static/temp/nav1.png'
					}
				],
				detailUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593358672989&di=a7c323de2bac0269ead9e7ab0531ba13&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F9662a766b2e14418b22ed6e8185913c3e7562ab455df-j8mU0R_fw658'
			}
		},
		components:{
			navBar
		},
		onLoad() {
			this.getRecommendData()
		},
		methods:{
			async getRecommendData () {
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let parmas = {}
				let data = await Api.apiCall('post',Api.client.recommend.newShopinfoByOrder,parmas)
				if (data) {
					this.shopInfo.name = data.result.name || '暂无店铺'
					this.shopInfo.detailAddress = data.result.detailAddress || '暂无地址'
					this.getNewsList(data.result.agentId)
				}
			},
			async getNewsList (agentId) {
				let params = {
					agentId: agentId
				}
				let list = await Api.apiCall('post', Api.client.goods.searchMyAgentGoods, params);
				if (list) {
					if (list.code === 0) {
						this.newsList = list.result
						console.log(this.newsList)
					} else {
						this.$api.msg(list.msg)
					}
				}
				uni.hideLoading()
			},
			navToDetailPage (item) {
				let id = item.goodsId,agentGoodsId = item.id
				uni.navigateTo({
					url: '/pages/client/goods/detail?goodsId='+id+'&agentGoodsId='+agentGoodsId
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f1f1f1;
	}
	.agency-main{
		position: relative;
		.agency-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 300upx;
			background: #00a79d;
			position: relative;
			uni-image{
				height: 90upx;
				width: 90upx;
				background-color: red;
			}
			.info-img {
				width: 90upx;
				height: 90upx;
			}
			.header-info {
				font-size: 20upx;
				color: #fff;
				padding: 30upx;
				.title {
					color: #fff;
					font-size: 35upx;
					display: block;
				}
			}
			.agency-header-bg {
				height: 36upx;
				width: 100%;
				position: absolute;
				bottom: -6upx;
			}
		}
		.agency-list {
			display: flex;
			justify-content: space-between;
			font-size: 35upx;
			text-align: center;
			span {
				color: #303133;
			}
		}
	}
	.agency-apply {
		width: 94%;
		position: absolute;
		background: #fff;
		top: 210rpx;
		border-radius: 10upx;
		margin-left: -47%;
		left: 50%;
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
			border-radius: 10upx;
			width: 100%;
			margin: 0 auto;
			.apply-detail {
				width: 25%;
				font-size: 26upx;
				color: #303133;
				text-align: center;
				padding: 20upx 0;
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
	.faddish-main {
		padding-top: 200upx;
		margin: 0 auto;
		width: 94%;
		position: relative;
		.faddish-title {
			position: absolute;
			top: 200upx;
			left: 30upx;
			font-size: 30upx;
			padding: 5upx 10upx;
			background-color: #b48e4f;
			border-bottom-right-radius: 10upx;
			border-bottom-left-radius: 10upx;
			color: #fff;
			.title-main {
				display: flex;
				align-items: center;
			}
		}
	}
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		background: #fff;
		border-radius: 20upx;
		padding-top: 80upx;
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
			font-size: 30upx;
			height: 100%;
			.detail-title {
				font-size: 30upx;
				color: #000;
				width: 100%;
				height: 33%;
				.number {
					color: #999;
					font-size: 26upx;
					line-height: 50upx;
					height: 50upx;
				}
			}
			.sub-title {
				height: 33%;
				display: flex;
				align-items: flex-end;
			}
			.price-box {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 100%;
				height: 33%;
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
	}
</style>
