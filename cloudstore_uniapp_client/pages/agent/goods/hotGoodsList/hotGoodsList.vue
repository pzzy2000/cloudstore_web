<template>
	<view class="content">
		<nav-bar backState="1000">热门商品列表</nav-bar>
		<view class="navbar" :style="{ top: statusBarHeight + 'rpx' }">
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">商品分类</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
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
							<view class="">市场价￥{{goods.goodsPicesBean.martPrice}}</view>
							<view class="surprised">抢购价 <text class="surprised-price">￥{{goods.goodsPicesBean.salePrice}}</text></view>
						</view>
						<button type="primary" class="price-btn">立即代理</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask"
		 :style="[{'padding-top': statusBarHeight+'rpx'}]">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two" @click="selectActivity(item)">{{ item.name }}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<tui-cascade-selection
				height="350px"
				activeColor="#EB0909"
				lineColor="#EB0909"
				checkMarkColor="#EB0909"
				:itemList="itemList"
				request
				@complete="complete"
				:receiveData="receiveData"
				@change="typeChange"
			></tui-cascade-selection>
		</uni-popup>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import tuiCascadeSelection from '@/components/tui-cascade-selection/tui-cascade-selection.vue'
	import uniPopup from '@/components/uni-popup/uni-popup'
	export default {
		components: {
			navBar, tuiCascadeSelection, uniPopup
		},
		data() {
			return {
				activityId: null,
				statusBarHeight: '',
				cateMaskState: 0, //分类面板展开状态
				headerPosition: 'fixed',
				headerTop: '0px',
				keyword: '',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				pageNum: 1,
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				goodsList: [],
				cateList: [],
				tCateList: [],
				sCateList: [],
				cateId: null,
				itemList: [],
				receiveData: [],
				categoryOneId: '',
				categoryTwoId: '',
				categoryThreeId: ''
			};
		},
		onLoad(options) {
			this.statusBarHeight = Number(Api.statusBarHeight())+ 88 + 27
			uni.showLoading({
				title: '正在加载',
				mask: false
			});
			this.activityId = options.id;
			this.keyword = options.keyword;
			this.cateId = options.sid;
			// this.loadGoodsTypeList();
			this.loadActiviList();
			this.loadgoodsType();
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		onPullDownRefresh() { //下拉刷新
			this.loadData('initialize');
		},
		onReachBottom() { //加载更多
			this.pageNum = this.pageNum + 1;
			this.loadData('next');
		},
		methods: {
			async loadData(type) { //初始化加载商品数据，包括下拉和下拉刷新
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				if (type === 'initialize') {
					this.categoryOneId = ''
					this.categoryTwoId = ''
					this.categoryThreeId = ''
					this.pageNum = 1;
				}
				var params = {
					activityId: this.activityId,
					pageNum: this.pageNum,
					pageSize: '10',
					categoryOneId: this.categoryOneId,
					categoryTwoId: this.categoryTwoId,
					categoryThreeId: this.categoryThreeId
				};
				let list = await Api.apiCall('post', Api.agent.hot.hotList, params);
				if (list) {
					let goodsList = list.result.records;
					if (type === 'next') {
						if (goodsList.length === 0) {
							this.$api.msg('没有更多了')
						}
						this.goodsList = this.goodsList.concat(goodsList);
					}else{
						this.goodsList = goodsList;
					}
					uni.hideLoading()
					uni.stopPullDownRefresh()
				}
			},
			async loadgoodsType () { //初始化加载商品一级分类
				let params = {
					pageNum: '1',
					parentId: 0
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params);
				if (list) {
					for (let tmp in list.result.records) {
						this.itemList.push({
							text: list.result.records[tmp].name,
							value: list.result.records[tmp].id
						})
					}
				}
			},
			async loadActiviList () { //获取活动分类
				let params = {
					pageNum: 1,
					pageSize: 20
				};
				let list = await Api.apiCall('post', Api.agent.hot.alllist, params);
				if (list) {
					this.cateList = list.result.records
				}
			},
			async typeChange(e) { //选择商品类型
				this.receiveData = []
				switch (e.layer) {
					case 0:
					this.categoryOneId = e.value
					this.categoryTwoId = ''
					this.categoryThreeId = ''
					break;
					case 1:
					this.categoryTwoId = e.value
					this.categoryThreeId = ''
					break;
					case 2:
					this.categoryThreeId = e.value
					break;
				}
				let params = {
					pageNum: '1',
					parentId: e.value
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params);
				if (list) {
					if (list.code === 0 && list.result.total != 0) {
						for (let tmp in list.result.records) {
							this.receiveData.push({
								text: list.result.records[tmp].name,
								value: list.result.records[tmp].id
							})
						}
					}else {
						this.$refs.popup.close()
						this.receiveData = []
					}
				}
				this.loadData()
			},
			complete(e) { //点击了商品分类的上一级分类
			},
			selectActivity (item) { //点击活动后加载数据
				this.activityId = item.id;
				this.categoryOneId = '';
				this.categoryTwoId = '';
				this.categoryThreeId = '';
				this.pageNum = '1';
				this.loadData();
				this.toggleCateMask('hide');
			},
			tabClick(index) { //点击tab列表
				if (index === 0) {
					this.filterIndex = 0
				}
				if (index === 1) {
					this.filterIndex = 1
				}
				if (index === 2) {
					this.filterIndex = 2
					this.$refs.popup.open()
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
			toggleCateMask(type) { //显示分类面板
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer);
			},
			navToDetailPage(item) { //去商品详情
				//测试数据没有写id，用title代替
				console.log(item)
				let goodsId = item.goodsId;
				let activitId = item.activityId;
				let agentGoodsId = item.id;
				uni.navigateTo({
					url: `/pages/agent/goods/agent/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${agentGoodsId}`
				});
			},
			stopPrevent() {}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
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
			width: 45%;
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
			height: 70upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 120upx;
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
		width: 94%;
		margin: 0 auto;
		padding-bottom: 40upx;
		.goods-item {
			display: flex;
			flex-direction: column;
			flex-flow: nowrap;
			width: 100%;
			height: 200upx;
			margin-bottom: 10upx;
			box-shadow: 0 0 4upx rgba(0, 0, 0, 0.1);
			padding: 10upx;
			background: #fff;
		}
		.image-wrapper {
			width: 200upx;
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
				font-size: 16upx;
				color: #000;
				width: 100%;
				.title {
					font-size: 24upx;
				}
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
