<template>
	<view>
		<nav-bar backState="1000" fontColor="#000" bgColor="#fff" class="nav-title">活动详情</nav-bar>
		<view class="activity-main">
			<image :src="navImg" mode="" class="activity-img"></image>
			<view class="goods-list">
				<view v-for="(goods, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
					<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
					<view class="goods-detail">
						<view class="detail-title">
							<view class="clamp title">{{ goods.goodsPicesBean.goodsName }}</view>
							<view class="number clamp">{{goods.goodsPicesBean.goodsSubtitle}}</view>
						</view>
						<view class="detail-price">
							<view class="price-main">
								<view class="surprised">
									<text class="surprised-price price-symbol">{{goods.goodsPicesBean.salePrice}}</text>
									/{{goods.goodsPicesBean.unit}}
								</view>
							</view>
							<view class="flex justify-around">
								<button type="primary" class="price-btn bg-blue buy">购买</button>
							</view>
						</view>
					</view>
					<view class="share-amount" @click.stop='shareSave(goods)'>
						 分享最高赚 <text class="price-symbol" v-text="goods.goodsPicesBean.client"></text>
					</view>
				</view>
			</view>
		</view>
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import share from '@/components/share';
	export default {
		data() {
			return {
				activityId: '',
				pageNum: 1,
				goodsList: [],
				goodsId: '',
				agentId: '',
				goodsName: '',
				activitName: '',
				agentGoodsId: '',
				shareClientId: '',
				imageUrl: '',
				navImg: '',
				shareList: [{
					icon: "/static/share_wechat.png",
					text: "微信好友",
					type: 1
				}]
			}
		},
		components: {
			navBar, share
		},
		onLoad(option) {
			// 7772965679403110400\
			// option.id = '7772965679403110400'
			this.activityId = option.id
			this.loadData()
			this.activityPic()
		},
		onReachBottom() { //加载更多
			this.pageNum = this.pageNum + 1;
			this.loadData()
		},
		onShareAppMessage(res) {
			var shareObj = {
				title: this.goodsName,
				imageUrl: this.imageUrl,
				params: {
					agentId: this.agentId,
					goodsId: this.goodsId,
					activityId: this.activityId,
					agentGoodsId: this.agentGoodsId,
					shareClientId: this.shareClientId || '-1',
					userType: 'Client'
				},
				path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
			}
			return shareObj
		},
		methods: {
			async loadData(type) { //初始化加载商品数据，包括下拉和下拉刷新
				var params = {
					activityId: this.activityId,
					pageNum: this.pageNum,
					pageSize: '10',
					categoryOneId: '',
					categoryTwoId: '',
					categoryThreeId: ''
				};
				let list = await Api.apiCall('post', Api.agent.hot.hotList, params);
				if (list) {
					let goodsList = list.result.records;
					if (goodsList.length === 0) {
						this.$api.msg('没有更多了')
					}
					this.goodsList = this.goodsList.concat(goodsList);
					uni.stopPullDownRefresh()
				}
			},
			async activityPic () {
				var params = {
					activityId: this.activityId,
				};
				let list = await Api.apiCall('post', Api.agent.activity.activityPic, params,true, false);
				if (list) {
					if (list.code === 0) {
						this.navImg = list.result.posterPice
					}
				}
			},
			navToDetailPage(item) { //去商品详情
				//测试数据没有写id，用title代替
				let goodsId = item.goodsId;
				let activitId = item.activityId;
				let agentGoodsId = item.id;
				uni.navigateTo({
					url: `/pages/client/goods/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${agentGoodsId}&agentId=${this.agentId}`
				});
			},
			async shareSave (info) { //分享调用接口
				  this.goodsId = info.goodsId
				  this.activityId = info.activityId
				  this.agentGoodsId = info.id
				  this.goodsName = info.goodsPicesBean.goodsName
				  this.imageUrl = info.goodsPicesBean.sharePicsUrl
					if (Api.isToken()) {
						uni.showLoading({
							title: '正在加载',
							mask: false
						});
					let params = {
						// 'agentGoodsId': this.agentGoodsId,
						'agentId': this.agentId,
						'goodsId': info.goodsId,
						'activityId': info.activityId,
						'shareId': this.shareClientId || '-1',
						'type': ''
					} 
					let data = await Api.apiCall('post', Api.agent.share.save, params);
					if (data) {
						uni.hideLoading() 
						if (data.code === 0) {
							this.shareClientId = data.result.id
							if (this.shareClientId) {
								this.share()
							}
						}else{
							uni.showToast({
								title: data.msg
							});
						}
					}
				}
			},
			share() { //分享显示弹窗
				this.$refs.share.toggleMask();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-main {
		position: relative;
		height: 100%;
		width: 100%;
	}
	.activity-img {
		width: 100%;
		height: 1000upx;
	}
	/* 商品列表 */
	.goods-list {
		position: absolute;
		top: 700upx;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 0 auto;
		padding: 40upx 20upx;
		background-image: linear-gradient(180deg, #ec5a45, #E22C49, #E22C49, #E22C49);
		.goods-item {
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			height: 190upx;
			margin-bottom: 8upx;
			padding: 10upx;
			background: #fff;
			border-radius: 10upx;
			align-items: center;
			position: relative;
		}
		.share-amount {
			position: absolute;
			right: 0;
			top: 0;
			font-size: 20upx;
			padding: 0 20upx;
			margin: 0;
			color: #fff;
			text-align: center;
			line-height: 40upx;
			height: 40upx;
			background-image: linear-gradient(-90deg, #FE8A14, #FED041);
			border-top-left-radius: 0;
			border-top-right-radius: 10upx;
			border-bottom-left-radius: 10upx;
			border-bottom-right-radius: 0;
			&:after {
				border: none;
			}
		}
		.image-wrapper {
			width: 124upx;
			height: 124upx;
			border-radius: 3upx;
			overflow: hidden;
			margin: 30upx;
			image {
				opacity: 1;
			}
		}
		.goods-detail {
			height: 130upx;
			display: inline-block;
			margin-left: 20upx;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			width: 70%;
			.detail-title {
				font-size: 24upx;
				color: #999;
				width: 100%;
				letter-spacing: 2upx;
				.title {
					font-size: 32upx;
					color: #333;
					width: 70%;
				}
				.number {
					color: #999;
					font-size: 24upx;
					line-height: 50upx;
					height: 50upx;
				}
			}
			.detail-price {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				width: 100%;
				.price-main {
					color: #999;
					font-size: 24upx;
					.surprised {
						font-size: 22upx;
						color: #999;
						.surprised-price {
							font-size: 35upx;
							color: red;
							margin-left: 10rpx;
						}
						.mart-price {
							text-decoration: line-through;
							margin-left: 10rpx;
							font-size: 24upx;
						}
					}
				}
				.price-btn {
					padding: 0;
					margin: 0;
					font-size: 22upx;
					padding: 0 20upx;
					height: 50upx;
					line-height: 50upx;
					background-color: #08affe;
					color: #fff;
				}
				.buy {
					margin-right: 10upx;
				}
			}
		}
	}
</style>
