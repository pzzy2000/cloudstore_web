<template>
	<view class="content">
		<nav-bar>商品分类</nav-bar>
		<view class="navbar">
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view v-for="(goods, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
			<view class="image-wrapper"><image :src="goods.goodsPhotos[0].url" mode="aspectFill"></image></view>
			<view class="goods-detail">
				<text class="title clamp">{{ goods.goodsName }}</text>
				<text class="title clamp subhead ">{{goods.goodsSubtitle}}</text>
				<text class="title clamp subhead ">供应商:{{goods.supplierBean.name}}/{{goods.supplierShopBean.shopName}}</text>
				<view class="price-box">
					<view class="price">
						 <text class="price1">价格:</text>
						 <text class="priceSale">{{ goods.salePrice }}</text>
					 /<text class="pricemart">{{ goods.martPrice}}</text>
					</view><!--<button class="goodsBtn">去代理</button> -->
				</view>
			</view>	
			</view>
		</view>
		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask" :style="[{'padding-top': statusBarHeight+45+'px'}]">
					<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
						<scroll-view scroll-y class="cate-list">
							<view v-for="item in cateList" :key="item.id">
								<!-- <view class="cate-item b-b two">{{ item.name }}</view>
								<view v-for="tItem in item.child" :key="tItem.id" class="cate-item b-b" :class="{ active: tItem.id == cateId }" @click="changeCate(tItem)">
									{{ tItem.name }}
								</view> -->
								<view class="cate-item b-b two" @click="changeCate(item)">{{ item.name }}</view>
							</view>
						</scroll-view>
					</view>
				</view>

<tabbar :role="'agent'" :ids="'aspfl'"></tabbar>
	</view>
</template>

<script>
import Api from '@/common/api';
import navBar from '@/components/zhouWei-navBar';
//import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: {
		navBar
	//	uniLoadMore
	},
	data() {
		return {
			activityId:null,
			statusBarHeight:1,
			cateMaskState: 0, //分类面板展开状态
			headerPosition: 'fixed',
			headerTop: '0px',
			keyword: '',
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			pageNum: 1,
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			goodsList: [],
			cateList:[],
			cateId:null
		};
	},

	onLoad(options) {
		//this.activityId = options.id;
		// #ifdef H5
		//this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
		// #endif
		// this.keyword = options.keyword;
		// this.cateId = options.sid;
		// this.loadActiviList();
		// this.loadData();
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},
	//下拉刷新
	onPullDownRefresh() {
		this.pageNum = this.pageNum + 1;
		this.loadData('refresh');
	},
	//加载更多
	onReachBottom() {
		this.pageNum = this.pageNum + 1;
		this.loadData();
	},
	methods: {
		async loadActiviList() {
			let params = {
				pageNum: '1',
				// pageSize: '20',
				parentId: 0
			};
			let list = await Api.apiCall('post', Api.agent.category.list, params);
			//console.log(list)
			if (list) {
				this.cateList = list.result.records
			}
		},
		//加载商品 ，带下拉刷新和上滑加载
		async loadData(type = 'add', loading) {
			//没有更多直接返回
			if (type === 'add') {
				if (this.loadingType === 'nomore') {
					return;
				}
				this.loadingType = 'loading';
			} else {
				this.loadingType = 'more';
			}
			let params={pageNum: this.pageNum};
			if (this.cateId) {
				params['categoryOneId'] = this.cateId;
			} 
			
			if (this.keyword) {
				//这里要在后台改SQL
				// params['keyword'] = this.keyword;
			} 
			let list = await Api.apiCall('post', Api.agent.goods.list, params);
			if(list){
			let goodsList = list.result.records;
			// let goodsList = await this.$api.json('goodsList');
			if (type === 'refresh') {
				this.goodsList = [];
			}
			// //筛选，测试数据直接前端筛选了
			// if (this.filterIndex === 1) {
			// 	goodsList.sort((a, b) => b.sales - a.sales);
			// }
			// if (this.filterIndex === 2) {
			// 	goodsList.sort((a, b) => {
			// 		if (this.priceOrder == 1) {
			// 			return a.price - b.price;
			// 		}
			// 		return b.price - a.price;
			// 	});
			// }

			// this.goodsList = this.goodsList.concat(goodsList);
             this.goodsList = goodsList;
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
			let goodsId = item.id;
			console.log(item)
			// let activitId = -1;
			// let agoodsid= -1;
			// uni.navigateTo({
			// 	url: `/pages/agent/goods/agent/detail?goodsId=${goodsId}&activityId=${activitId}&agoodsid=${agoodsid}`
			// });
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page,
.content {
	background: $page-color-base;
}
.content {
	padding-top: 96upx;
}

.navbar {
	position: fixed;
	left: 0;
	top: 150upx;
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
	z-index: 10;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30upx;
		color: $font-color-dark;
		position: relative;
		&.current {
			color: $base-color;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 120upx;
				height: 0;
				border-bottom: 4upx solid $base-color;
			}
		}
	}
	.p-box {
		display: flex;
		flex-direction: column;
		.yticon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30upx;
			height: 14upx;
			line-height: 1;
			margin-left: 4upx;
			font-size: 26upx;
			color: #888;
			&.active {
				color: $base-color;
			}
		}
		.xia {
			transform: scaleY(-1);
		}
	}
	.cate-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 80upx;
		position: relative;
		font-size: 44upx;
		&:after {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			border-left: 1px solid #ddd;
			width: 0;
			height: 36upx;
		}
	}
}

/* 分类 */
.cate-mask {
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 95;
	transition: 0.3s;
	.cate-content {
		padding-top: 40rpx;
		width: 630upx;
		height: 100%;
		background: #fff;
		float: right;
		transform: translateX(100%);
		transition: 0.3s;
	}
	&.none {
		display: none;
	}
	&.show {
		background: rgba(0, 0, 0, 0.4);

		.cate-content {
			transform: translateX(0);
		}
	}
}
.cate-list {
	display: flex;
	flex-direction: column;
	height: 100%;
	.cate-item {
		display: flex;
		align-items: center;
		height: 90upx;
		padding-left: 30upx;
		font-size: 28upx;
		color: #555;
		position: relative;
	}
	.two {
		height: 64upx;
		color: #303133;
		font-size: 30upx;
		background: #f8f8f8;
	}
	.active {
		color: $base-color;
	}
}

/* 商品列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0 15upx;
	background: #fff;
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		width: 100%;
		height: 100px;
	}
	.image-wrapper {
		width: 100px;
		height:100px;
		border-radius: 3px;
		overflow: hidden;
		image {
			opacity: 1;
		}
	}
	.goods-detail {
		display: inline-block;
		width: 75%;
		padding: 1px;
		.title {
			font-size: 16px;
			color: $font-color-dark;
			//line-height: 80upx;
		}
		.subhead {
			color: #333;
			font-size: 25upx;
		}
		.price-box {
			display: flex;
			align-items: left;
			justify-content: space-between;
			padding: 30px 0px 0px 0px;
			font-size: 14upx;
			color: $font-color-light;
			.price1 {
				font-size: 14px;
				color: $uni-color-primary;
				line-height: 1;
				}
			.price {
				 bottom: 0px; 
				.priceSale {
					font-size: 14px;
					color: $uni-color-primary;
					line-height: 1;
					&:before {
						content: '￥';
						font-size: 14px;
					}	
				}
				.pricemart {
					font-size: 12px;
					color: #000;
					text-decoration:line-through;
					line-height: 1;
					&:before {
						content: '￥';
						font-size: 12px;
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
