<template>
	<view class="content">
		<nav-bar backState="1000">商品列表</nav-bar>
		<view class="nav-main" :style="{ top: statusBarHeight + 'px' }">
			<view class="u-search-box">
				<view class="u-search-inner" @click="toSearch">
					<u-icon name="search" color="#909399" :size="28"></u-icon>
					<text class="u-search-text">搜索商品</text>
				</view>
			</view>
			<view class="navbar">
				<view class="nav-item" :class="{ current: filterIndex === 0 }" @click.stop="tabClick(0)">推荐</view>
				<view class="nav-item" :class="{ current: filterIndex === 1 }" @click.stop="tabClick(1)">
					<text>销量</text>
					<view class="p-box">
						<text :class="{ active: quantityOrder === 1 && filterIndex === 1 }" class="yticon icon-shang"></text>
						<text :class="{ active: quantityOrder === 2 && filterIndex === 1 }" class="yticon icon-shang xia"></text>
					</view>
				</view>
				<view class="nav-item" :class="{ current: filterIndex === 2 }" @click.stop="tabClick(2)">
					<text>价格</text>
					<view class="p-box">
						<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
						<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon icon-shang xia"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-list" v-if='isGoodsList'>
			<view v-for="(goods, index) in goodsList" :key="index" class="goods-item shadow" @click="navToDetailPage(goods)">
				<view class="image-wrapper"><image :src="goods.goodsPhotos[0].url" mode="aspectFill"></image></view>
				<view class="goods-detail">
					<view class="detail-title clamp">{{ goods.goodsName }}</view>
					<view class="sub-title clamp text-gray">{{ goods.goodsSubtitle }}</view>
					<view class="price-box">
						<view class="price">
							 <text class="priceSale price-symbol">{{ goods.salePrice }}</text>/{{ goods.unit }}
						</view>
						<view class="flex justify-around">
							<button class="price-btn share" @click.stop='shareSave(goods)'>分享赚<text class="price-symbol">{{goods.client}}</text></button>
							<button class="price-btn buy">立即购买</button>
						</view>
					</view>
				</view>	
			</view>
		</view>
		<view class="earning-empty" v-if='goodsList.length === 0'>
			<image src="/static/client/earning-logo.png" mode="" class="earning-logo"></image>
			<view class="earning-empty-text">暂无搜索的商品哦！</view>
		</view>
		<!-- 分类筛选组件 -->
		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask" :style="[{'padding-top': statusBarHeight+'rpx'}]">
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
				activeColor="#08affe"
				lineColor="#08affe"
				checkMarkColor="#08affe"
				:itemList="itemList"
				request
				@complete="complete"
				:receiveData="receiveData"
				@change="typeChange"
			></tui-cascade-selection>
		</uni-popup>
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
		<!-- <tabbar :role="'agent'" :ids="'aspfl'"></tabbar> -->
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import tuiCascadeSelection from '@/components/tui-cascade-selection/tui-cascade-selection.vue'
	import uniPopup from '@/components/uni-popup/uni-popup'
	import share from '@/components/share';
	export default {
		components: {
			navBar, tuiCascadeSelection, uniPopup, share
		},
		data() {
			return {
				agentId: '',
				goodsName: '',
				goodsId: '',
				activityId: '',
				agentGoodsId: '',
				shareClientId: '',
				imageUrl: '',
				statusBarHeight: '',
				cateMaskState: 0, //分类面板展开状态
				headerPosition: 'fixed',
				headerTop: '0px',
				keyword: '',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				pageNum: 1,
				priceOrder: 1, //1 价格从低到高 2价格从高到低
				quantityOrder: 1, //1 销量从底到高 2.销量从高到低
				dirVal: '',//价格排序值
				sortVal: 'asc', //升序（desc），降序（asc）值
				goodsList: {
					activityBean: {
						name: '不参与活动'
					},
				},
				isGoodsList: false,
				cateList:[],
				cateId:null,
				itemList: [],
				receiveData: [],
				categoryOneId: '',
				categoryTwoId: '',
				categoryThreeId: '',
				shareList: [{
					icon: "/static/share_wechat.png",
					text: "微信好友",
					type: 1
				}]
			};
		},
		onLoad(options) {
			this.statusBarHeight = Number(Api.statusBarHeight())
			this.goodsName = options.goodsName
			this.agentId = uni.getStorageSync('agentId')
			this.loadActiviList();
			this.loadgoodsType();
			this.loadData();
			this.pageNum = 1;
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
			// this.goodsName = ''
			this.loadData('next');
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
			this.$refs.share.toggleMask();
		},
		methods: {
			shareAmount () { //处理分享出去的金额
				for( let i in this.goodsList){
					this.goodsList[i].client= Api.ishareAmount(this.goodsList[i]);
				}
				console.log(this.goodsList)
			},
			async loadData(type) { //初始化加载商品数据，包括下拉和下拉刷新
				if (type === 'initialize') {
					this.goodsName = ''
					this.activityId = ''
					this.categoryOneId = ''
					this.categoryTwoId = ''
					this.categoryThreeId = ''
					this.receiveData = []
				} 
				var params = {
					goodsName: this.goodsName || '',
					activityId: this.activityId,
					pageNum: this.pageNum,
					pageSize: '10',
					categoryOneId: this.categoryOneId,
					categoryTwoId: this.categoryTwoId,
					categoryThreeId: this.categoryThreeId,
					dir: this.dirVal,
					sort: this.sortVal
				};
				let list = await Api.apiCall('post', Api.agent.goods.list, params,true);
				if (list) {
					let goodsList = list.result.records;
					this.isGoodsList = true
					if (type === 'next') {
						if (goodsList.length === 0) {
							this.$api.msg('没有更多了')
							this.pageNum = this.pageNum - 1 
						}
						this.goodsList = this.goodsList.concat(goodsList);
					}else{
						this.goodsList = goodsList;
					}
					this.shareAmount()
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
				this.goodsName = ''
				this.categoryOneId = '';
				this.categoryTwoId = '';
				this.categoryThreeId = '';
				this.pageNum = '1';
				this.loadData();
				this.toggleCateMask('hide');
			},
			toggleCateMask (type) { //点击顶部右侧的活动分类小图标
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
					this.pageNum = 1;
					this.loadData();
				}
				if (index === 1) {
					this.filterIndex = 1
					this.pageNum = 1;
					this.quantityOrder = this.quantityOrder === 1 ? 2 : 1
					this.dirVal = 'sale_quantity'
					this.sortVal = this.sortVal === 'desc' ? 'asc' : 'desc'
					this.loadData();
				}
				if (index === 2) {
					// this.filterIndex = 2
					// this.$refs.popup.open()
					this.filterIndex = 2
					this.pageNum = 1;
					this.priceOrder = this.priceOrder === 1 ? 2 : 1 
					this.dirVal = 'salePrice'
					this.sortVal = this.sortVal === 'desc' ? 'asc' : 'desc'
					this.loadData();
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
			async searchtype () { //查询分类的具体数据
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
			navToDetailPage(item) { //跳转到商品详情页
				let goodsId = item.id, activitId = item.activityId, activityGoodsId= item.activityGoodsId;
				uni.navigateTo({
					url: `/pages/client/goods/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${activityGoodsId}&agentId=${this.agentId}`
				});
			},
			stopPrevent() {},
			async shareSave (info) { //分享调用接口
				this.goodsId = info.id
				this.activityId = info.activityId
				this.agentGoodsId = info.activityGoodsId
				this.goodsName = info.goodsName
				this.imageUrl = info.sharePicsUrl
				if (Api.isToken()) {
					let params = {
						// 'agentGoodsId': this.agentGoodsId,
						'agentId': this.agentId,
						'goodsId': info.id,
						'activityId': info.activityId,
						'shareId': this.shareClientId || '-1',
						'type': ''
					} 
					let data = await Api.apiCall('post', Api.agent.share.save, params, true);
					if (data) {
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
			},
			toSearch () {
				uni.navigateTo({
					url: '/pages/agent/goods/hotsale/search',
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
page,
.content {
	padding-top: 150upx;
	padding-bottom: 60upx;
}
.nav-main {
	position: fixed;
	left: 0;
	top: 135upx;
	width: 100%;
	z-index: 10;
}
.navbar {
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
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
			color: #08affe;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 120upx;
				height: 0;
				border-bottom: 4upx solid #08affe;
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
				color: #08affe;
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

.u-search-box {
	padding: 20upx;
	width: 100%;
	background-color: #fff;
	box-sizing: padding-box;
}

.u-menu-wrap {
	flex: 1;
	display: flex;
	background-color: #fff;
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
	width: 100%;
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		align-items: center;
		width: 100%;
		height: 190upx;
		background: #fff;
		border-bottom: 1upx solid #f1f1f1;
		padding: 15upx
	}
	.image-wrapper {
		width: 130upx;
		height: 130upx;
		border-radius: 3upx;
		overflow: hidden;
		background-color: #fff;
		image {
			opacity: 1;
			border-radius: 15upx;
		}
	}
	.goods-detail {
		display: inline-block;
		margin-left: 20upx;
		width: calc(100% - 155upx);
		height: 130upx;
		.detail-title {
			font-size: 32rpx;
			letter-spacing: 2upx;
			color: #000;
			width: 100%;
			.number {
				color: #999;
				font-size: 26upx;
				line-height: 50upx;
				height: 50upx;
			}
		}
		.sub-title {
			font-size: 24upx;
			display: flex;
			align-items: flex-end;
			line-height: 50upx;
			color: #999;
			letter-spacing: 2upx;
		}
		.activity {
			height: 20%;
			display: flex;
			align-items: flex-end;
			font-size: 24upx;
		}
		.share-amount {
			height: 35upx;
			line-height: 35upx;
			border-radius: 5upx;
			width: 160upx;
			text-align: center;
			background-color: #FFEFBC;
			color: #FF8213;
			font-size: 18upx;
			margin-top: 10upx;
			display: inline-block;
		}
		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 100%;
			color: #999;
			.price {
				font-size: 22upx;
				.priceSale {
					color: red;
					font-size: 35upx;
					margin-right: 5upx;
				}
				.pricemart {
					color: #999;
					font-size: 25upx;
					margin-left: 15upx;
					text-decoration: line-through;
				}
			}
			.price-btn {
				padding: 0;
				margin: 0;
				font-size: 22rpx;
				padding: 0 20rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 10rpx;
				background-color: #08affe;
				color: #fff;
			}
			.buy {
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
			.share {
				color: #fff;
				font-size: 20upx;
				border-radius: 18upx;
				margin: 0;
				padding: 0 20upx;
				height: 40upx;
				line-height: 40upx;
				margin-right: 20upx;
				letter-spacing: 2upx;
				width: 180upx;
				background-image: linear-gradient(90deg, #FECE40, #FE8E18);
				&::after {
					border: none;
				}
			}
		}
	}
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
}
</style>
