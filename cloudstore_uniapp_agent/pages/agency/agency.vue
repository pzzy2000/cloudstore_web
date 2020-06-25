<template>
	<view>
		<view class="" @click="search()" style="background: #FFFFFF;height: 80upx;display: flex;justify-content: center;align-items: center;" :style="[{'margin-top': statusBarHeight+45+'px'}]">
			<input class="" type="text" value="" placeholder="输入关键字搜索" style="font-size: 28upx;background: #F5F5F5;height: 60upx;width: 90%;border-radius: 50upx;text-align: center;" />
		</view>
		<view class="agency-main">
			<view class="agency-header">
				<image :src="user.url" mode="" alt='头像'></image>
				<view class="header-info">
					<text class="title samp">{{user.name}}</text>
					<text>回头率：50 &nbsp;&nbsp;&nbsp;&nbsp;收藏量： 40</text>
				</view>
			</view>
			<view class="agency-list">
				<view class="" v-for="(item, index) in headerList" :key='index'>
					<text>{{item.number}}</text>
					<p>{{item.name}}</p>
				</view>
			</view>
			<view class="agency-apply">
				<text class="agency-apply-title">常用应用</text>
				<view class="agency-apply-main">
					<view class="apply-detail" v-for="(item, index) in apply" :key='index'>
						<image src="../../static/emptyCart.jpg" mode=""></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 今日爆款 -->
			<view class="faddish-main">
				<view class="faddish-title">今日爆款</view>
				<view class="goods-list">
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
								<button class="goodsBtn">去代理</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 今日上新 -->
			<view class="faddish-main">
				<view class="faddish-title">今日上新</view>
				<view class="goods-list">
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
								<button class="goodsBtn">去代理</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	export default {
		data() {
			return {
				user: '',
				statusBarHeight: '',
				height: '',
				headerList: [
					{
						name : '今日访客',
						number: '20'
					},
					{
						name : '今日订单数',
						number: '20'
					},
					{
						name : '今日订单全部',
						number: '20'
					},
					{
						name : '分享店铺',
						number: '20'
					},
				],
				apply: [
					{
						name: '店铺管理'
					},
					{
						name: '客户管理'
					},
					{
						name: '商品管理'
					},
					{
						name: '订单收入'
					},
					{
						name: '国创云仓'
					},
					{
						name: '数据分析'
					},
					{
						name: '营销推广'
					},
				],
				goodsList: []
			}
		},
		onLoad () {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.height = uni.getSystemInfoSync().windowHeight - (this.statusBarHeight+80)
      let userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
      	this.user.name = userInfo.nickName
        this.user.url = userInfo.avatarUrl
        console.log(userInfo.nickName)
      }
		},
		onShow () {
			// this.getUserInfo()
			// this.loadData()
		},
		methods: {
			search () {
				
			},
			getUserInfo () {
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.userInfo = userInfo
					console.log(this.userInfo)
				}
			},
			async loadData(type = 'add', loading) {
				let params = {
					pageNum: '1',
					pageSize: '10'
				};
				let list = await Api.apiCall('post', Api.agent.list, params);
				if (list) {
					console.log(list)
					this.goodsList = list.result.records
				}
			}
		}
	}
</script>

<style scoped lang="scss">
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
			.apply-detail {
				width: 25%;
				font-size: $font-lg;
				text-align: center;
				padding: 20upx 0;
			}
			span {
				display: block;
			}
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
		width: 55%;
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
		width: 100%;
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
