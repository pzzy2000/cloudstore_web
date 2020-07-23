<template>
	<view class="content">
		<nav-bar>商品分类</nav-bar>
		<view class="navbar">
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
				<text>商品分类</text>
				<!-- <view class="p-box">
					<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon icon-shang xia"></text>
				</view> -->
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view v-for="(goods, index) in goodsList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
				<view class="image-wrapper"><image :src="goods.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<view class="detail-title clamp">{{ goods.goodsName }}</view>
					<view class="sub-title clamp">
						<button class="cu-btn round bg-orange sm" v-if="!goods.activityBean.name">无活动</button>
						<button class="cu-btn round bg-orange sm" v-else>{{ goods.activityBean.name }}</button>
					</view>
					<view class="price-box">
						<!-- <view class="clamp subhead">供应商:{{goods.supplierShopBean.shopName}}</view> -->
						<view class="price">
							 <text class="priceSale">￥{{ goods.salePrice }}</text>
							 <text class="pricemart">￥{{ goods.martPrice}}</text>
						</view>
						<button class="price-btn">去代理</button>
					</view>
				</view>	
			</view>
		</view>
		<!-- 分类筛选组件 -->
		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask" :style="[{'padding-top': statusBarHeight+45+'px'}]">
			<view class="cate-content">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two" @click="selectActivity(item)">{{ item.name }}</view>
					</view>
					<view class="cate-item b-b two" v-if='!cateList.length'>暂无活动</view>
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
		<tabbar :role="'agent'" :ids="'aspfl'"></tabbar>
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
			statusBarHeight:1,
			cateMaskState: 0, //分类面板展开状态
			headerPosition: 'fixed',
			headerTop: '0px',
			keyword: '',
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			pageNum: 1,
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			goodsList: {
				activityBean: {
					name: '不参与活动'
				}
			},
			cateList:[],
			cateId:null,
			itemList: [],
			receiveData: [],
			categoryOneId: '',
			categoryTwoId: '',
			categoryThreeId: '',
			activityId: ''
		};
	},

	onLoad(options) {
		// #ifdef H5
		//this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
		// #endif
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
	//下拉刷新
	onPullDownRefresh() {
		this.pageNum = 1;
		this.loadData('initialize');
	},
	//加载更多
	onReachBottom() {
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
				this.activityId = ''
				this.categoryOneId = ''
				this.categoryTwoId = ''
				this.categoryThreeId = ''
				this.receiveData = []
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
			let list = await Api.apiCall('post', Api.agent.goods.list, params);
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
		selectActivity (item) { //点击活动后加载数据
			this.activityId = item.id;
			this.categoryOneId = '';
			this.categoryTwoId = '';
			this.categoryThreeId = '';
			this.pageNum = '1';
			this.loadData();
			this.toggleCateMask('hide');
		},
		toggleCateMask (type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(() => {
				this.cateMaskState = state;
			}, timer);
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
		async typeChange(e) { //选择商品类型
			this.pageNum = 1
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
		//查询分类的具体数据
		async searchtype () {
			let params = {
				pageNum: '1',
				pageSize: '10',
				categoryOneId: this.typeId
			};
			let list = await Api.apiCall('post', Api.agent.goods.list, params);
			if (list) {				
				this.goodsList = list.result.records
				uni.hideLoading();
			}
		},
		navToDetailPage(item) {
			//测试数据没有写id，用title代替
			console.log(item)
			let goodsId = item.id;
			let activitId = item.activityId;
			uni.navigateTo({
				url: `/pages/agent/goods/agent/detail?goodsId=${goodsId}&activityId=${activitId}`
			});
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page,
.content {
	padding-bottom: 100upx;
}
.content {
	padding-top: 96upx;
}

.navbar {
	position: fixed;
	left: 0;
	top: 135upx;
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
		padding-top: 50rpx;
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
		height: 90upx;
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
	background: #fff;
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		width: 100%;
		padding: 20rpx 30rpx;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 10rpx;
	}
	.image-wrapper {
		width: 200upx;
		height:200upx;
		border-radius: 3upx;
		overflow: hidden;
		image {
			opacity: 1;
			border-radius: 15upx;
		}
	}
	.goods-detail {
		display: inline-block;
		margin-left: 20upx;
		width: 65%;
		font-size: 12px;
		height: 100%;
		.detail-title {
			font-size: 30rpx;
			color: #000;
			width: 100%;
			height: 33%;
			.number {
				color: #999;
				font-size: 26upx;
				line-height: 50upx;
				height: 50upx;
			}
		}
		.sub-title {
			height: 33%;
			display: flex;
			align-items: flex-end;
		}
		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 100%;
			height: 33%;
			.price {
				.priceSale {
					color: red;
					font-size: 35upx;
					margin-right: 15upx;
				}
				.pricemart {
					color: #999;
					font-size: 25upx;
					text-decoration: line-through;
				}
			}
			.price-btn {
				padding: 0;
				margin: 0;
				font-size: 24upx;
				padding: 0 20upx;
				height: 50upx;
				line-height: 50upx;
				border-radius: 40upx;
				color: #fff;
				background: #ff4f50;
			}
		}
	}
}
</style>
