<template>
	<view class="u-wrap">
		<nav-bar backState="1000">{{title}}</nav-bar>
		<view class="u-search-box">
			<view class="u-search-inner" @click="toSearch">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索商品</text>
			</view>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in itemList" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index, item.value)">
					<text class="u-line-1">{{item.text}}</text>
				</view>
			</scroll-view>
			<block>
				<scroll-view scroll-y class="right-box" @scrolltolower='scrolltolower'>
					<view class="earning-empty" v-if='goodsList.length === 0'>
						<image src="/static/client/earning-logo.png" mode="" class="earning-logo"></image>
						<view class="earning-empty-text">没有该分类下的商品</view>
					</view>
						<view class="item-container">
							<view class="goods-list" v-for="(item,index) in goodsList" :key='index' @click="navToDetailPage(item)">
								<image class="goods-list-image" :src="item.goodsPhotos[0].url" mode=""></image>
								<view class="goods-detail">
									<view class="detail-title clamp">{{item.goodsName}}</view>
									<view class="detail-subtitle clamp">{{item.goodsSubtitle}}</view>
									<view class="detail-price">
										<view class="price-num">
											<text class="price-sale price-symbol">{{item.salePrice}}</text>
											<text class="price-btn-unit">/{{item.unit || '无'}}</text>
										</view>
										<view class="price-btn">
											<button class="price-share" @click.stop='shareSave(item)'>分享赚<text class="price-symbol" v-text="item.client"></text></button>
											<button class="price-buy">立即购买</button>
										</view>
									</view>
								</view>
							</view>
						</view>
				</scroll-view>
			</block>
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
				title: '',
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				itemList: [],
				categoryId: [],
				categoryList: [],
				pageNum: 1,
				categoryOneId: '',
				categoryTwoId: '',
				goodsList: [],
				agentId:'',
				goodsId: '',
				activityId: '',
				agentGoodsId: '',
				goodsName: '',
				imageUrl: '',
				cateMaskState: 0, //分类面板展开状态
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
		onLoad(option) {
			this.agentId = uni.getStorageSync('agentId')
			this.itemList = JSON.parse(option.categoryList)
			this.current = option.current
			this.title = option.title
			this.categoryOneId = option.categoryOneId
			this.categoryTwoId = this.itemList[this.current].value
			this.loadData()
		},
		methods: {
			scrolltolower() {
				this.pageNum = this.pageNum + 1;
				this.loadData();
			},
			shareAmount () { //处理分享出去的金额
				for( let i in this.goodsList){
					this.goodsList[i].client= Api.ishareAmount(this.goodsList[i]);
				}
			},
			async loadData() { //初始化加载商品数据，包括下拉和下拉刷新
				var params = {
					goodsName: '',
					activityId: '',
					pageNum: this.pageNum,
					pageSize: 10,
					categoryOneId: this.categoryOneId,
					categoryTwoId: this.categoryTwoId,
					categoryThreeId: '',
				};
				let list = await Api.apiCall('post', Api.agent.goods.list, params,true);
				if (list) {
					if (list.result.records.length) {
						this.goodsList = this.goodsList.concat(list.result.records);
						this.shareAmount()
					} else {
						this.$api.msg('没有更多了')
					}
				}
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index, id) {
				this.categoryTwoId = id
				if(index == this.current) return ;
				this.current = index;
				this.pageNum = 1
				this.goodsList.length = 0
				this.loadData()
			},
			toSearch () {
				uni.navigateTo({
					url: '/pages/agent/goods/hotsale/search',
				});
			},
			async shareSave (info) { //分享调用接口
				this.goodsId = info.id
				this.activityId = info.activityId
				this.agentGoodsId = info.activityGoodsId
				this.goodsName = info.goodsName
				this.imageUrl = info.sharePicsUrl
				if (Api.isToken()) {
						uni.showLoading({
							title: '正在加载',
							mask: false
						});
					let params = {
						// 'agentGoodsId': this.agentGoodsId,
						'agentId': this.agentId,
						'goodsId': info.id,
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
			toggleCateMask (type) { //点击顶部右侧的活动分类小图标
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer);
			},
			share() { //分享显示弹窗
				this.$refs.share.toggleMask();
			},
			navToDetailPage(item) { //跳转到商品详情页
				let goodsId = item.id, activitId = item.activityId, activityGoodsId= item.activityGoodsId;
				uni.navigateTo({
					url: `/pages/client/goods/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${activityGoodsId}&agentId=${this.agentId}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		// height: 100%;
		width: 100%;
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
	}
	
	.u-search-box {
		padding: 20upx;
		background-color: #fff;
		box-sizing: content-box;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		background-color: #fff;
		position: relative;
		height: 100%;
	}

	.u-search-inner {
		background-color: #F5F5F5;
		border-radius: 100upx;
		display: flex;
		height: 50upx;
		align-items: center;
		color: #CDCDCD;
		font-size: 26upx;
		justify-content: center;
	}

	.u-search-text {
		font-size: 26rpx;
		color: #cdcdcd;
		margin-left: 10rpx;
	}

	.u-tab-item {
		width: 160upx;
		height: 110upx;
		background: #F5F5F5;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #666666;
		margin-bottom: 2upx;

	}
	
	.u-tab-item-active {
		position: relative;
		color: #3AAAFF;
		background: #E4F4FF;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4upx solid #3AAAFF;
		height: 100%;
		right: 0;
		top: 0;
	}

	.u-tab-view {
		position: absolute;
		left: 0;
		top: 0;
		height: calc(100 - 85px);
		background-color: #fff;
		width: 160upx;
	}
	
	.right-box {
		background-color: #fff;
		width: calc(100% - 165upx);
		position: absolute;
		left: 160upx;
		top: 0;
		height: 100%;
	}
	
	.class-item {
		background-color: #fff;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: #000;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: #000;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
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
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20upx;
	}
	
	.item-menu-image {
		width: 120upx;
		height: 120upx;
	}
	.goods-list {
		display: flex;
		justify-content: flex-start;
		padding: 30rpx 0 30rpx 15rpx;
		border-bottom: 1upx solid #F1F1F1;
		width: 100%;
		.goods-list-image {
			width: 130upx;
			height: 130upx;
			margin-right: 15upx;
			border-radius: 10upx;
		}
		.goods-detail {
			width: calc(100% - 150upx);
			.detail-title {
				width: 100%;
				font-size: 32upx;
				color: #343434;
				letter-spacing: 2upx;
			}
			.detail-subtitle {
				font-size: 24upx;
				color: #9A9A9A;
				letter-spacing: 2upx;
				line-height: 50upx;
			}
			.detail-price {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.price-num {
					letter-spacing: 2upx;
					.price-sale {
						color: #FF1414;
						font-size: 32upx;
					}
					.price-unit {
						color: #999;
						font-size: 24upx;
					}
				}
				.price-btn {
					text-align: center;
					display: flex;
					justify-content: flex-start;
					.price-share {
						color: #fff;
						font-size: 20upx;
						border-radius: 18upx;
						margin: 0;
						padding: 0;
						height: 40upx;
						line-height: 40upx;
						width: 130upx;
						margin-right: 10upx;
						background-image: linear-gradient(90deg, #FECE40, #FE8E18);
						&::after {
							border: none;
						}
					}
					.price-buy {
						color: #fff;
						font-size: 20upx;
						border-radius: 18upx;
						background-color: blue;
						margin: 0;
						padding: 0;
						height: 40upx;
						line-height: 40upx;
						width: 130upx;
						background-image: linear-gradient(90deg, #6ABEFF, #3CAAFF);
						&::after {
							border: none;
						}
					}
				}
			}
		}
	}
</style>
