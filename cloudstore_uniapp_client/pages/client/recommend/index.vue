<template>
	<view>
		<nav-bar>推荐</nav-bar>
		<view class="agency-main">
			<view class="agency-header">
				<image :src="detailUrl" mode="" alt='头像' class="info-img"></image>
				<view class="header-info">
					<text class="title samp">{{shopInfo.name}}</text>
					<text class="header-address">地址：{{shopInfo.detailAddress}}</text>
				</view>
			</view>
		</view>
		<view class="faddish-main">
			<view class="faddish-title">今日爆款</view>
			<view class="goods-list" >
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
					<view class="image-wrapper"><image :src="item.pic" mode="aspectFill"></image></view>
					<view class="goods-detail">
						<text class="title clamp">{{ item.goods.goodsName }}</text>
						<text class="title clamp subhead ">{{item.goods.goodsSubtitle}}</text>
						<view class="price-box">
							<view class="price">
								<text class="priceSale">{{ item.goods.salePrice }}</text>
								/
								<text class="pricemart">{{ item.goods.martPrice }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="faddish-main">
			<view class="faddish-title">最新商品</view>
			<view class="goods-list">
				<view v-for="(item, index) in updateList" :key="index" class="goods-item" @click="navToDetailPage(item)">
					<view class="image-wrapper">
						<image :src="item.goodsPicesBean.goodsPhotos[0].url"></image>
					</view>
					<view class="goods-detail">
						<text class="title clamp">{{ item.goodsPicesBean.goodsName }}</text>
						<text class="title clamp subhead ">{{item.goodsPicesBean.goodsSubtitle}}</text>
						<view class="price-box">
							<view class="price">
								<text class="priceSale">{{ item.goodsPicesBean.salePrice }}</text>
								/
								<text class="pricemart">{{ item.goodsPicesBean.martPrice }}</text>
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

<style lang="scss">
	.agency-main{
		width: 94%;
		margin: 0 auto;
		.agency-header {
			display: flex;
			justify-content: flex-start;
			padding: 20upx 0;
			uni-image{
				height: 150upx;
				width: 150upx;
				background-color: red;
			}
			.info-img {
				width: 140upx;
				height: 140upx;
			}
			.header-info {
				width: 60%;
				font-size: 20upx;
				color: #999;
				padding: 30upx;
				.title {
					color: #000000;
					font-size: 50upx;
					display: block;
				}
				.header-address {
					font-size: 30upx;
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
	.faddish-main {
		.faddish-title {
			font-size: 40upx;
			line-height: 80upx;
			margin-top: 20upx;
		}
	}
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;
		.goods-item {
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			padding-bottom: 40upx;
			// &:nth-child(2n + 1) {
			// 	margin-right: 4%;
			// }
		}
		.image-wrapper {
			width: 40%;
			height: 250upx;
			border-radius: 3px;
			overflow: hidden;
			padding: 10upx;
			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.goods-detail {
			display: inline-block;
			width: 60%;
			padding: 10upx;
			.title {
				font-size: $font-lg;
				color: $font-color-dark;
				line-height: 80upx;
			}
			.subhead {
				color: #333;
				font-size: 18upx;
			}
			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-right: 10upx;
				font-size: 24upx;
				color: $font-color-light;
				.price {
					.priceSale {
						font-size: 40upx;
						color: $uni-color-primary;
						line-height: 1;
						&:before {
							content: '￥';
							font-size: 26upx;
						}	
					}
					.pricemart {
						font-size: 16upx;
						color: #000;
						text-decoration:line-through;
						line-height: 1;
						&:before {
							content: '￥';
							font-size: 26upx;
						}	
					}
				}
				.goodsBtn {
					font-size: 30upx;
					color: #fff;
					background: red;
					height: 70upx;
					line-height: 70upx;
					width: 150upx;
					padding: 0;
					margin: 0;
				}
			}
		}
	}
</style>
