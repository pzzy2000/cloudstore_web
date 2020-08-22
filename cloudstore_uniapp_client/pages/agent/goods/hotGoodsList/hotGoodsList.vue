<template>
	<view class="content" :class="isTwoCategory ? '.content-shade-box': ''">
		<nav-bar backState="1000">{{activitName}}</nav-bar>
		<view class="content-shade" @click="tabClick(2)" v-if="isTwoCategory"></view>
		<view class="navbar" :style="{ top: statusBarHeight + 'px' }">
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">{{activitName}}</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">筛选</view>
			<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
			<view class="nav-item-twoCategory" v-if="isTwoCategory">
				<view class="twoCategory-list">
					<view class="twoCategory-title">活动类别</view>
					<view v-for="(item, index) in selectTwoCategoryList" :key="index" class="twoCategory-item" :class="item.select? 'twoCategory-item-select' : '' "  @click="selectTwoCategory(item, index)">
						{{item.name}}
					</view>
				</view>
				<view class="twoCategory-btn">
					<button class="reset" @click="twoCategoryReset">重置</button>
					<button class="submit" @click="twoCategorySubmit">确定</button>
				</view>
			</view>
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
		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''" @click="toggleCateMask"
		 :style="[{'padding-top': statusBarHeight+'px'}]">
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
    <share ref="share" :contentHeight="580" :shareList="shareList"></share>
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
				goodsId: '',
				agentId: '',
				goodsName: '',
				activityId: null,
				activitName: '',
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
				categoryThreeId: '',
				shareList: [{
					icon: "/static/share_wechat.png",
					text: "微信好友",
					type: 1
				}],
				isTwoCategory: false,
				selectTwoCategoryArray: [],
				selectTwoCategoryList: [],
			}
		},
		onLoad(options) {
			this.statusBarHeight = Number(Api.statusBarHeight())
			uni.showLoading({
				title: '正在加载',
				mask: false
			});
			this.activitName = options.name
			this.agentId = options.agentId
			this.activityId = options.id;
			this.keyword = options.keyword;
			this.cateId = options.sid;
			// this.loadGoodsTypeList();
			this.loadActiviList();
			this.selectTwoCategoryData(this.activityId)
			// this.loadgoodsType();
			this.loadData();
		},
		onShow () {
			this.shareAmount ()
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
			this.twoCategoryReset()
		},
		onReachBottom() { //加载更多
			this.pageNum = this.pageNum + 1;
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
		},
		methods: {
			shareAmount () { //处理分享出去的金额
				for( let i in this.goodsList){
					this.goodsList[i].goodsPicesBean.client= Api.ishareAmount(this.goodsList[i].goodsPicesBean);
				}
			},
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
					categoryTwoIds_: this.categoryTwoId,
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
					this.shareAmount()
					uni.hideLoading()
					uni.stopPullDownRefresh()
				}
			},
			async selectTwoCategoryData (id) {
				this.selectTwoCategoryList.length = 0
				let params = {
					ativityId: id,
				};
				let list = await Api.apiCall('post', Api.agent.activity.selectTwoCategory, params, true, false);
				if (list) {
					if(list.code === 0) {
						// this.selectTwoCategoryList = list.result
						for (let tmp in list.result) {
							this.selectTwoCategoryList.push({
								id: list.result[tmp].categoryId,
								name: list.result[tmp].categoryBean.name,
								select: false
							})
						}
					}
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
				let list = await Api.apiCall('post', Api.agent.hot.alllist, params, true);
				if (list) {
					this.cateList = list.result.records
				}
			},
			selectTwoCategory(item, index) { //点击活动分类的类别
				this.selectTwoCategoryList[index].select = this.selectTwoCategoryList[index].select ? false : true
				var index = this.selectTwoCategoryArray.indexOf(item.id);
				if (index > -1) {
					this.selectTwoCategoryArray.splice(index, 1);
				} else {
					this.selectTwoCategoryArray.push(item.id)
				}
			},
			twoCategoryReset () { //重置活动分类
				this.selectTwoCategoryArray.length = 0
				for (let tmp in this.selectTwoCategoryList) {
					this.selectTwoCategoryList[tmp].select = false
				}
			},
			twoCategorySubmit () {//点击确定筛选活动分类
				this.categoryTwoId = this.selectTwoCategoryArray.join()
				this.isTwoCategory = !this.isTwoCategory
				this.loadData()
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
				this.selectTwoCategoryData(item.id)
				this.isTwoCategory = false
				this.selectTwoCategoryArray.length = 0
				this.categoryTwoId = ''
				this.activitName = item.name
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
					this.pageNum = 1;
					this.isTwoCategory = false
					this.loadData();
				}
				if (index === 1) {
					this.filterIndex = 1
					this.pageNum = 1;
					this.isTwoCategory = false
					this.loadData();
				}
				if (index === 2) {
					this.filterIndex = 2
					// this.pageNum = 1;
					// this.loadData();
					this.isTwoCategory = !this.isTwoCategory
					// this.$refs.popup.open()
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
			toggleCateMask(type) { //显示分类面板
				// let timer = type === 'show' ? 10 : 300;
				let timer = type === 'show' ? 0 : 0;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer);
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
			},
			stopPrevent() {
				
			}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
	}
	.content-shade-box {
		overflow:hidden;
		height:100%
	}
	.content {
		padding-top: 85upx;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.content-shade {
		background-color: rgba(0,0,0,0.2);
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		overflow: hidden;
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
		.nav-item-twoCategory {
			position: absolute;
			background-color: #fff;
			top: 82upx;
			right: 0upx;
			width: 100%;
			.twoCategory-title {
				color: #999999;
				width: 100%;
				font-size: 22upx;
				line-height: 50upx;
				letter-spacing: 2upx;
			}
			.twoCategory-list {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				color: #333;
				padding: 40upx 26upx;
				width: 100%;
				.twoCategory-item {
					font-size: 26upx;
					padding: 10upx 25upx;
					margin: 15rpx 15rpx 15rpx 0;
					background-color: #F5F5F5;
					color: #666666;
					letter-spacing: 2upx;
					border-radius: 10upx;
				}
				.twoCategory-item-select {
					background-color: #DDEFFF;
					color: #49A2F2;
				}
			}
			.twoCategory-btn {
				display: flex;
				border-top: 1upx solid #f5f5f5;
				font-size: 32upx;
				align-items: center;
				text-align: center;
				button {
					&::after {
						border: none;
					}
				}
				.reset {
					border-right: 1upx solid #f5f5f5;
					color: #666;
					background-color: #fff;
					width: 30%;
				}
				.submit {
					color: #39a9ff;
					background-color: #fff;
					width: 70%;
				}
			}
		}
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
				right: 0;
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
		// transition: 0.3s;

		.cate-content {
			width: 30%;
			height: 100%;
			background: #fff;
			float: left;
			// transform: translateX(100%);
			// transition: 0.3s;
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
