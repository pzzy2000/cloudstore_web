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
		<nav-bar type='fixed'>我的小店</nav-bar>
		<view class="agency-main">
			<view class="agency-header">
				<image :src="user.url" mode="" alt='头像' class="info-img"></image>
				<view class="header-info">
					<text class="title samp">{{user.name}}</text>
				</view>
			</view>
			<view class="agency-list">
					<view v-for="(item, index) in headerList" :key='index' class="agency-list-main">
						<p>{{item.name}}</p>
						<text class="span">{{item.number}}</text>
					</view>
				</view>
			<view class="agency-apply">
				<view class="agency-apply-main">
					<view class="apply-detail" v-for="(item, index) in apply" :key='index' @click="toAgentList(item)">
						<image :src="item.imgUrl" mode="" class="apply-img"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 今日爆款 -->
			<!-- <view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						<span class='left-chunk'></span>
						今日爆款
					</view>
					<span class='more'>更多></span>
				</view>
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
							</view>
						</view>
					</view>
				</view>
			</view> -->
			<!-- 今日上新 -->
			<view class="faddish-main">
				<view class="faddish-title">
					<view class="title-main">
						<span class='left-chunk'></span>
						今日上新
					</view>
					<!-- <span class='more'>更多></span> -->
				</view>
				<view class="goods-list">
					<view v-for="(goods, index) in updateList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<view class="detail-title">
								<view class="clamp">{{ goods.goodsPicesBean.goodsName }}</view>
								<view class="number clamp">{{goods.goodsPicesBean.goodsSubtitle}}</view>
							</view>
							<view class="detail-price">
								<view class="price-main">
									<view class="">市场价￥{{goods.goodsPicesBean.martPrice}}</view>
									<view class="surprised">抢购价 <text class="surprised-price">￥{{goods.goodsPicesBean.salePrice}}</text></view>
								</view>
								<!-- <button type="primary" class="price-btn">立即抢购</button> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tabbar :role="'agent'" :ids="'awddl'"></tabbar>	
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				user: {
					name:'',
					url:'',
					detailUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593358672989&di=a7c323de2bac0269ead9e7ab0531ba13&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F9662a766b2e14418b22ed6e8185913c3e7562ab455df-j8mU0R_fw658'
				},
				statusBarHeight: '',
				height: '',
				headerList: [
					{
						name : '代理商品',
						number: '20',
					},
					{
						name : '今日订单数',
						number: '20'
					},
					{
						name : '今日订单',
						number: '20'
					},
					{
						name : '分享店铺',
						number: '20'
					},
				],
				apply: [
					{
						name: '代理商品',
						detailListUrl: './agentGoodsList/agentGoodsList',
						imgUrl: '/static/temp/c3.png'
					},
					{
						name: '订单管理',
						detailListUrl: './order/order',
						imgUrl: '/static/tab-cart.png'
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
				goodsList: [],
				updateList: []
			}
		},
		components:{
			navBar
		},
		onLoad () {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.height = uni.getSystemInfoSync().windowHeight - (this.statusBarHeight+80)
			// #ifdef H5
				this.getH5info()
			// #endif
			// #ifdef MP-WEIXIN
				this.getuserInfo();
			// #endif
			this.getDateList ()
		},
		onShow () {
			// this.getUserInfo()
			// this.loadData()
		},
		methods: {
			// 获取微信用户信息
			getuserInfo(){
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					if (userInfo.name) {
					 this.user.name = userInfo.name
					}else {
					   this.user.name = userInfo.nickName
					}
					if (!userInfo.url) {
						this.user.url = this.user.detailUrl
					}
				}
			},
			// 获取h5用户信息
			getH5info () {
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name
					console.log(this.user.name)
				}
			},
			search () {
			},
			toAgentList (data) { //去个人的代理商品列表
				var url = data.detailListUrl
				console.log(url)
				uni.navigateTo({
					url: url,
				});
			},
			async getDateList () {
				let params = {
					pageNum:1,
					pageSize: 10
				}
				let list = await Api.apiCall('post', Api.agent.user.dateList, params);
				if (list) {
					// console.log(list)
					this.updateList = list.result.records
				}
			},
			navToDetailPage (item) {
				let  agentGoodsId = item.id,goodsId =item.goodsId
				
				uni.navigateTo({
					// goodsId=7604921082513985536&userType=agent&agentGoodsId=7630608619278438400
					url: '/pages/agent/goods/goodsDetail/goodsDetail?agentGoodsId='+agentGoodsId+'&goodsId='+goodsId+'&userType=agent',
				});
			}
		}
	}
</script>

<style scoped lang="scss">
.container {
	background:#fff;
	padding-bottom: 160upx;
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
		font-size: 25upx;
		text-align: center;
		margin-bottom: 20upx;
		.agency-list-main {
			padding: 20upx 20upx 0 20upx;
			width: 25%;
			&:nth-child(1){
				border-right: 1upx solid rgba(255,31,31,0.8);
			}
			&:nth-child(2){
				border-right: 1upx solid rgba(255,31,31,0.8);
			}
			&:nth-child(3){
				border-right: 1upx solid rgba(255,31,31,0.8);
			}
			.span {
				display: inline-block;
				color: #303133;
				line-height: 60upx;
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
			font-size: 22upx;
		}
	}
}
/* 商品列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		width: 100%;
		// height: 200upx;
		padding-bottom: 40upx;
		margin: 40upx 0;
		background: #fff;
		border-bottom: 1upx solid #eee;
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
			width: 100%;
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
