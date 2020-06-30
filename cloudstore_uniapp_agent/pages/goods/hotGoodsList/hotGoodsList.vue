<template>
	<view>
		<!-- #ifdef H5 -->
		<nav-bar backState="1000">
		热门活动商品</nav-bar>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<nav-bar backState="1000">
      热门活动商品</nav-bar>
		<!-- #endif -->
		<view class="hot-list">
			<view v-for="(item, index) in hotList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper"><image :src="item.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<text class="title clamp">{{item.goodsPicesBean.goodsName}}</text>
					<text class="title clamp subhead ">{{item.goodsPicesBean.goodsSubtitle}}</text>
					<view class="price-box">
						<view class="price">
							<text class="priceSale">{{item.goodsPicesBean.salePrice}}</text>
							/
							<text class="pricemart">{{item.goodsPicesBean.martPrice}}</text>
						</view>
						<button class="goodsBtn">去代理</button>
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
		data() {
			return {
				hotList: [],
				statusBarHeight: '',
				height: ''
			}
		},
		components: {
			navBar
		},
		onLoad (options) {
			this.getHotListData(options.id)
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.height = uni.getSystemInfoSync().windowHeight - (this.statusBarHeight+80)
		},
		methods: {
			async getHotListData (id) {
				let pramas = {		
					activityId: id
				} 
				let getHotList = await Api.apiCall('post', Api.hot.hotList,pramas,0);
				if (getHotList) {
					this.hotList = getHotList.result.records
				}
			},
			navToDetailPage(item) {
				let id = item.goodsId;
				console.log(item)
				uni.navigateTo({
					url: '../goodsDetail/goodsDetail?id='+id
				});
<<<<<<< HEAD
			}

			this.goodsList = this.goodsList.concat(goodsList);

			//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
			this.loadingType = this.goodsList.length > list.total ? 'nomore' : 'more';
			if (type === 'refresh') {
				if (loading == 1) {
					uni.hideLoading();
				} else {
					uni.stopPullDownRefresh();
				}
			}
			}
		},
		//筛选点击
		tabClick(index) {
			this.pageNum = 1;
			if (this.filterIndex === index && index !== 2) {
				return;
			}
			this.filterIndex = index;
			if (index === 2) {
				this.priceOrder = this.priceOrder === 1 ? 2 : 1;
			} else {
				this.priceOrder = 0;
			}
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);

		},
		//显示分类面板
		toggleCateMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(() => {
				this.cateMaskState = state;
			}, timer);
		},
		//分类点击
		changeCate(item) {
			console.log(item.id);
			this.pageNum = 1;
			this.cateId = item.id;
			this.toggleCateMask();
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh', 1);

		},
		//详情
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			let activitId = item.activityId;
			let id = item.goodsId;
			uni.navigateTo({
				url: `/pages/goods/agent/detail?id=${id}&activityId=${activitId}`
			});
		},
		stopPrevent() {}
=======
			},
		}
>>>>>>> branch 'master' of https://github.com/pzzy2000/cloudstore_web.git
	}
</script>

<style scoped lang="scss">
	//热门活动
	.hot-list {
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
			width: 200upx;
			height: 200upx;
			border-radius: 3px;
			image {
				width: 200upx;
				height: 200upx;
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
				line-height: 60upx;
			}
			.subhead {
				color: #333;
				font-size: 30upx;
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
						font-size: 30upx;
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
