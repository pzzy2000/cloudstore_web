<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<nav-bar>mallcloud商城</nav-bar>
		<view class="MP-search" @click="search()" style=""><input class="MP-search-input" type="text" disabled="true"
			 placeholder="输入关键字搜索" /></view>
		<!-- #endif -->

		<!-- 头部轮播 -->
		<!-- #ifdef MP -->
		<view class="carousel-section" style="margin-top: 80upx;">
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="carousel-section">
				<!-- #endif -->
				<!-- 标题栏和状态栏占位符 -->
				<view class="titleNview-placing"></view>
				<!-- 背景色区域 -->
				<view class="titleNview-background" :style="{ backgroundColor: titleNViewBackground }"></view>
				<swiper class="carousel" circular @change="swiperChange">
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPageL(item.url)">
						<image :src="item.pic" />
					</swiper-item>
				</swiper>
				<!-- 自定义swiper指示器 -->
				<view class="swiper-dots">
					<text class="num">{{ swiperCurrent + 1 }}</text>
					<text class="sign">/</text>
					<text class="num">{{ swiperLength }}</text>
				</view>
			</view>

			<!-- 活动 -->
			<view class="cate-section">
				<view class="cate-item" v-for="item in activity.nav.one" :key="item.id">
					<image v-if="item.isadd == 0" src="/static/temp/c1.png" @click="navToCategory(item)"></image>
					<image v-else src="/static/temp/c5.png"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<view class="cate-section">
				<view class="cate-item" v-for="item in activity.nav.two" :key="item.id" >
					<image v-if="item.isadd == 0" src="/static/temp/c1.png"  @click="navToCategory(item)"></image>
					<image v-else src="/static/temp/c5.png"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<!-- 热门活动列表 -->
			<view  v-for='item  in activity.show' :key="item.id">
				<view   class="f-header m-t" @click="navToCategory(item)">
					<image src="/static/temp/h1.png"></image>
					<view class="tit-box">
						<text class="tit">{{item.name}}</text>
						<text class="tit2">{{item.name}}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
				
				<view class="goods-list">
					<view v-for="(goods, index) in item.goodsList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
						<view class="image-wrapper"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image></view>
						<view class="goods-detail">
							<text class="title clamp">{{ goods.goodsPicesBean.goodsName }}</text>
							<text class="title clamp subhead ">{{goods.goodsPicesBean.goodsSubtitle}}</text>
							<text class="title clamp subhead ">供应商:{{goods.goodsPicesBean.supplierBean.name}}/{{goods.goodsPicesBean.supplierShopBean.shopName}}</text>
							<view class="price-box">
								<view class="price">
									 <text class="price1">价格:</text>
									 <text class="priceSale">{{ goods.goodsPicesBean.salePrice }}</text>
								 /<text class="pricemart">{{ goods.goodsPicesBean.martPrice }}</text>
								</view><!--<button class="goodsBtn">去代理</button> -->
								
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 新品上市 -->
             <!-- 
			<mallplusCopyright></mallplusCopyright>
			-->
			<tabbar :role="'agent'" :ids="'armsp'"></tabbar>
		</view>
	</view>
</template>

<script>
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	import coupon from '@/components/coolc-coupon/coolc-coupon';

	import {
		formatDate
	} from '@/common/date';
	import {
		mapState
	} from 'vuex';
	import navBar from '@/components/zhouWei-navBar';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			coupon,
			mallplusCopyright,
			uniLoadMore,
			navBar
		},
		data() {
			return {
				loadingType: 'more', //加载更多状态
				activity: {
					nav: {},
					show: []
				},
				titleNViewBackground: '',
				carouselList: '',
				swiperCurrent: '',
				swiperLength: ''
			};
		},

		//加载更多
		onReachBottom() {
			this.pageNum = this.pageNum + 1;
		},
		onPullDownRefresh() {
			this.pageNum = this.pageNum + 1;
			this.loadData();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		onShareAppMessage() {},
		onLoad(ops) {
			this.loadData();
		},
		filters: {
			formatCreateTime(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
			},
			formatNull(value) {
				if (value === undefined || value === null || value === '') {
					return '暂无';
				} else {
					return value;
				}
			},
			formatLongText(value) {
				if (value === undefined || value === null || value === '') {
					return '暂无';
				} else if (value.length > 4) {
					return value.substr(0, 4) + '...';
				} else {
					return value;
				}
			},
			formataddress(value){
				try {
				  return value.provinceBean.name + " " + value.cityBean.name + " " + value.areaBean.name;
				} catch (e) {
				  return '数据读取错误';
				}
			},
			formatPayType(value) {
				if (value === 2) {
					return '支付宝';
				} else if (value === 1) {
					return '微信小程序';
				} else if (value === 3) {
					return '余额支付';
				} else if (value === 5) {
					return '积分兑换';
				}
			},
		},
		methods: {
			getCode() {},
			/**
			 *
			 * 加载首页数据
			 */
			async loadData() {
				this.searchActivityNavList();
				this.searchActivityShowList();
			},

			async searchActivityNavList() {
				let params = {
					// pageNum: 1,
					// pageSize: 20
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchActivityNavList, params);
				if (data) {
					this.activity.nav = data.result; //查询出来的 
				}
			},
			async searchActivityShowList() {
				let params = {
					// pageNum: 1,
					// pageSize: 20
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchActivityShowList, params);
				if (data) {
					// this.activity.show = data.result.records;
					let showActivity = data.result.records;
					for (let i = 0; i < showActivity.length; i++) {
						showActivity[i].goodsList = [];
						this.searchActivityGoodsShowList(showActivity[i])
					}
					this.activity.show = showActivity;
					console.log(this.activity.show)
				}
			},
			async searchActivityGoodsShowList(activity) {
				let params = {
					activityId: activity.id,
					pageNum: 1,
					pageSize: 5
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchIndexActivitygoodsList, params);
				if (data) {
					activity.goodsList = data.result.records;
				}
			},
			/**
			 * 获取轮播图
			 */
			async getBanner() {
				let params = {
					storeId: 0
				};
				console.log(uni.getSystemInfoSync().platform);
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						params.type = 2;
						break;
					case 'ios':
						params.type = 3;
						break;
					default:
						params.type = 5;
						break;
				}
				let data = await Api.apiCall('get', Api.index.bannerList, params);
				if (data) {
					this.carouselList = data || [];
					this.swiperLength = this.carouselList.length;
					this.titleNViewBackground = 'rgb(203, 87, 60)';
				}
			},
			/**
			 * 获取轮播图
			 */
			async getCouponList() {
				let params = {
					pageSize: 3
				};
				let data = await Api.apiCall('get', Api.index.selectNotRecive, params);
				if (data) {
					this.couponList = data || [];
				}
			},

			dateFormat(time) {
				if (time == null || time === '') {
					return 'N/A';
				}
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			
			navToTabPage(item) {
				uni.navigateTo({
					url: url
				});
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let goodsId = item.goodsId;
				let activitId = item.activityId;
				let agoodsid= item.id;
				uni.navigateTo({
					url: `/pages/agent/goods/agent/detail?goodsId=${goodsId}&activityId=${activitId}&agoodsid=${agoodsid}`
				});
			},

			async acceptCoupon(item) {
				uni.showLoading({
					title: '请稍后'
				});

				let params = {
					couponId: item.id
				};
				let data = await Api.apiCall('post', Api.index.acceptCoupon, params);
				console.log(data);
				if (data) {
					this.$api.msg(data);
				}
				uni.hideLoading();
			},
			navToCategory(item) {
				console.log(item)
				let activitId = item.id;
				uni.navigateTo({
						url: '/pages/agent/goods/hotGoodsList/hotGoodsList?id='+activitId
				});
			},
			search() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		},

		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '../../pagesU/notice/notice'
				});
			}
		}
	};
</script>

<style lang="scss">
	.MP-search {
		background: #ffffff;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		z-index: 999;
	}

	.MP-search-input {
		font-size: 28upx;
		background: #f5f5f5;
		height: 60upx;
		width: 90%;
		border-radius: 50upx;
		text-align: center;
	}

	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.6);
		}
	}

	page {
		background: $page-color-base;
		padding-bottom: 160upx;
		.cate-section {
			position: relative;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}

		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}

			.carousel {
				.carousel-item {
					padding: 0;
				}
			}

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	.m-t {
		margin-top: 20upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: 0.4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		//background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: 0.7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}


	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 0upx 1upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg + 2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg + 2upx;
			color: $font-color-light;
		}
	}

	

	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100upx;
		position: relative;
		padding-right: 30upx;
	}

	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		background: #fff;
		border-radius: 100px;

		&:after {
			border-radius: 100px;
		}

		&.recom {
			background: #fff9f9;
			color: $base-color;

			&:after {
				border-color: #f7bcc8;
			}
		}
	}


	.getPosition {
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		background-color: #fff;
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
			padding: 20px 0px 0px 0px;
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
