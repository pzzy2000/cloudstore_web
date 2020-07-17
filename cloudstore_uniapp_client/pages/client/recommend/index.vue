<template>
	<view class="container">
		<nav-bar>推荐</nav-bar>
		<view class="agency-main">
			<view class="agency-header">
				<image :src="detailUrl" mode="" alt='头像' class="info-img"></image>
				<view class="header-info">
					<text class="title samp">{{shopInfo.name}}</text>
					<text class="header-address">地址：{{shopInfo.detailAddress}}</text>
				</view>
			</view>
			<view class="agency-apply">
				<view class="agency-apply-main">
					<view class="apply-detail" v-for="(item, index) in apply" :key='index'>
						<image :src="item.imgUrl" mode="" class="apply-img"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- <view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						<span class='left-chunk'></span>
						今日爆款
					</view>
					<span class='more'>更多></span>
				</view>
				<view class="goods-list">
					<view v-for="(goods, index) in item.goodsList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<view class="detail-title">
								<view class="">{{ goods.goodsPicesBean.goodsName }}</view>
								<view class="number">{{goods.goodsPicesBean.goodsSubtitle}}</view>
							</view>
							<view class="detail-price">
								<view class="price-main">
									<view class="">市场价￥{{goods.goodsPicesBean.martPrice}}</view>
									<view class="surprised">抢购价 <text class="surprised-price">￥{{goods.goodsPicesBean.salePrice}}</text></view>
								</view>
								<button type="primary" class="price-btn">立即抢购</button>
							</view>
						</view>
					</view>
				</view>
			</view> -->
			<view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						<span class='left-chunk'></span>
						最新商品
					</view>
					<span class='more'>更多></span>
				</view>
				<view class="goods-list">
					<view v-for="(goods, index) in item.updateList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<view class="detail-title">
								<view class="">{{ goods.goodsPicesBean.goodsName }}</view>
								<view class="number">{{goods.goodsPicesBean.goodsSubtitle}}</view>
							</view>
							<view class="detail-price">
								<view class="price-main">
									<view class="">市场价￥{{goods.goodsPicesBean.martPrice}}</view>
									<view class="surprised">抢购价 <text class="surprised-price">￥{{goods.goodsPicesBean.salePrice}}</text></view>
								</view>
								<button type="primary" class="price-btn">立即抢购</button>
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
				shopInfo: '',
				name:'',
				url:'',
				updateList: '',
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
			//this.getDateList()
		},
		methods:{
			async getRecommendData () {
				let parmas = {}
				let data = await Api.apiCall('post',Api.client.recommend.newShopinfoByOrder,parmas)
				if (data) {
					this.shopInfo = data.result
				}
			},
			async getDateList () {
				let params = {
					pageNum:1,
					pageSize: 10
				}
				let list = await Api.apiCall('post', Api.client.recommend.list, params);
				if (list) {
					this.updateList = list.result.records
				}
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
		background: #fff;
	}
	.agency-main{
		width: 94%;
		margin: 0 auto;
		.agency-header {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-left: 50upx;
			height: 238upx;
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
				color: #999;
				padding: 30upx;
				.title {
					color: #000000;
					font-size: 50upx;
					display: block;
				}
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
			border: 1upx solid #eee;
			border-radius: 10upx;
			padding: 20upx;
			.apply-detail {
				width: 20%;
				font-size: 26upx;
				color: #303133;
				text-align: center;
				padding-top: 20upx;
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
		.faddish-title {
			font-size: 30upx;
			line-height: 40upx;
			height: 40upx;
			margin-top: 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title-main {
				display: flex;
				align-items: center;
				.left-chunk {
					display: inline-block;
					height: 40upx;
					width: 10upx;
					background-color: green;
					margin-right: 10upx;
				}
			}
			.more {
				color: #999;
				font-size: 20upx;
			}
		}
	}
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 40rpx 0 40rpx 40rpx;
		background: #fff;
		.goods-item {
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			height: 200upx;
		}
		.image-wrapper {
			width: 200upx;
			height:200upx;
			border-radius: 3upx;
			overflow: hidden;
			image {
				opacity: 1;
			}
		}
		.goods-detail {
			display: inline-block;
			margin-left: 20upx;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			width: 65%;
			.detail-title {
				font-size: 16px;
				color: #000;
				.number {
					color: #999;
					font-size: 26upx;
					line-height: 50upx;
					height: 50upx;
				}
			}
			.detail-price {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 100%;
				padding-bottom: 20upx;
				.price-main {
					color: #999;
					font-size: 24upx;
					.surprised {
						font-size: 30upx;
						color: #000;
						.surprised-price {
							font-size: 35upx;
							color: red;
						}
					}
				}
				.price-btn {
					padding: 0;
					margin: 0;
					font-size: 30upx;
					padding: 0 20upx;
					height: 60upx;
					line-height: 60upx;
					color: #fff;
					background: #ff4f50;
				}
			}
		}
	}
</style>
