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
			<view class="right-box">
				<view class="navbar">
					<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">有货<text class="cuIcon-check text-blue" v-if="havStock"></text></view>
					<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">
						<text>价格</text>
						<view class="p-box">
							<text :class="{ active: priceOrder === 1 }" class="yticon icon-shang"></text>
							<text :class="{ active: priceOrder === 2 }" class="yticon icon-shang xia"></text>
						</view>
					</view>
					<view class="nav-item cuIcon-filter" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">筛选</view>
					<!-- <text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text> -->
					<view class="nav-item-twoCategory" v-if="isTwoCategory">
						<view class="twoCategory-list">
							<view class="twoCategory-title">品牌</view>
							<view v-for="(item, index) in GoodsBrandList" :key="index" class="twoCategory-item" :class="item.select? 'twoCategory-item-select' : '' "  @click="selectTwoCategory(item, index)">
								{{item.name}}
							</view>
						</view>
						<view class="twoCategory-btn">
							<button class="reset" @click="twoCategoryReset">重置</button>
							<button class="submit" @click="twoCategorySubmit">确定</button>
						</view>
					</view>
				</view>
				<scroll-view scroll-y @scrolltolower='scrolltolower' style="width: 100%;height: 100%;padding-top: 80upx;position: relative;">
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
										<button class="price-share" @click.stop='shareSave(item)'><text>{{isType()+item.client}}</text></button>
										<button class="price-buy">立即购买</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
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
				}],
				isTwoCategory:false,
				havStock: '',//是否有货，1为有货，空为全部，0为无货
				dirVal: '',//排序字段
				sortVal: '', //升序（desc），降序（asc）值
				priceOrder: 0,
				GoodsBrandList: [],
				selectGoodsBrandList: [],
				selectTwoCategoryArray: [],
				selectTwoCategoryList: []
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
			this.title = option.title
			this.categoryOneId = option.categoryOneId
			this.agentId = uni.getStorageSync('agentId')
			if (option.categoryList) { //判断是从首页还是从分类页面进去的
				this.itemList = JSON.parse(option.categoryList)
				this.itemList.unshift({
					text: '全部',
					value: ''
				})
				this.current = Number(option.current) + 1
				this.categoryTwoId = this.itemList[this.current].value
				this.loadData()
			} else {
				this.loadTowTypeList ()
			}
			this.loadGoodsBrand()
		},
		methods: {
			isType() { //判断分享的类型
				var userType = uni.getStorageSync('userInfo').agent || uni.getStorageSync('userInfo').userType
				switch (userType){
					case 'agent':
						return '最高赚￥';
					case 'leader':
						return '最高赚￥';
					default:
						return '分享赚￥';
				}
			},
			scrolltolower() { //右边滑动块到底，触发分页
				this.pageNum = this.pageNum + 1;
				this.loadData();
			},
			shareAmount () { //处理分享出去的金额
				for( let i in this.goodsList){
					this.goodsList[i].client= Api.ishareAmount(this.goodsList[i]);
				}
			},
			async loadTowTypeList () { //查询出二级分类的数据
				let params = {
					pageNum: 1,
					parentId: this.categoryOneId
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params, true);
				if (list) {
					if (list.result.records.length != 0) {
						for (let tmp in list.result.records) {
							this.itemList.push({
								text: list.result.records[tmp].name,
								value: list.result.records[tmp].id,
							})
						}
						this.itemList.unshift({
							text: '全部',
							value: '',
						})
						this.categoryTwoId = this.itemList[this.current].value
						this.loadData()
					} else {
						this.$api.msg('暂无分类数据')
					}
				} else {
					this.$api.msg('请求失败')
				}
			},
			async loadGoodsBrand () { //查询商品品牌的数据
				this.GoodsBrandList.length = 0
				let params = {
					categoryOneId: this.categoryOneId,
					categoryTwoId: this.categoryTwoId
				};
				let list = await Api.apiCall('post', Api.agent.goods.goodsBrand, params, true);
				if (list ){
					if (list.code === 0) {
						for (let tmp in list.result) {
							this.GoodsBrandList.push({
								name: list.result[tmp].goodsBrand,
								select: false
							})
						}
					}
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
					havStock: this.havStock,
					dir: this.dirVal,
					sort: this.sortVal,
					goodsBrand: this.selectGoodsBrandList
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
			initData () { //初始化数据
				this.goodsList.length = 0
				// this.selectGoodsBrandList = ''
				// this.selectTwoCategoryArray.length = 0
				this.pageNum = 1
				this.loadData()
			},
			async swichMenu(index, id) { // 点击左边的栏目切换
				this.categoryTwoId = id
				this.isTwoCategory = false
				if(index == this.current) return ;
				this.current = index;
				this.pageNum = 1
				this.goodsList.length = 0
				this.loadGoodsBrand()
				this.selectGoodsBrandList = ''
				this.selectTwoCategoryArray.length = 0
				this.loadData()
			},
			toSearch () { //点击搜索
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
			tabClick (index) { //点击顶部tabbar筛选
				if (index === 0) {
					this.havStock = this.havStock === 1 ? '' : 1
					this.isTwoCategory = false
					this.initData()
				}
				if (index === 1) {
					this.sortVal = this.sortVal === 'desc' ? 'asc' : 'desc'
					this.dirVal = 'salePrice'
					this.priceOrder = this.priceOrder === 1 ? 2 : 1
					this.isTwoCategory = false
					this.initData()
				}
				if (index === 2) {
					this.isTwoCategory = !this.isTwoCategory
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
			},
			selectTwoCategory(item, index) { //点击活动分类的类别
				this.GoodsBrandList[index].select = this.GoodsBrandList[index].select ? false : true
				var index = this.selectTwoCategoryArray.indexOf(item.name);
				if (index > -1) {
					this.selectTwoCategoryArray.splice(index, 1);
				} else {
					this.selectTwoCategoryArray.push(item.name)
				}
			},
			twoCategoryReset () { //重置活动分类
				this.selectGoodsBrandList = ''
				this.selectTwoCategoryArray.length = 0
				for (let tmp in this.GoodsBrandList) {
					this.GoodsBrandList[tmp].select = false
				}
				this.isTwoCategory = false
				this.initData()
			},
			twoCategorySubmit () {//点击确定筛选活动分类
				this.pageNum = 1
				this.selectGoodsBrandList = this.selectTwoCategoryArray.join()
				console.log(this.selectGoodsBrandList)
				this.isTwoCategory = !this.isTwoCategory
				this.goodsList.length = 0
				this.loadData()
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
		height: calc(100% - 200upx);
		.navbar {
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			width: 100%;
			height: 80upx;
			background: #fff;
			border-bottom: 1upx solid #eee;
			z-index: 10;
			.nav-item-twoCategory {
				position: absolute;
				background-color: #fff;
				top: 80upx;
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
						border-bottom: 1upx solid #f5f5f5;
						color: #666;
						background-color: #fff;
						width: 30%;
						border-radius: 0;
					}
					.submit {
						border-bottom: 1upx solid #f5f5f5;
						color: #39a9ff;
						background-color: #fff;
						width: 70%;
						border-radius: 0;
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
						color: #39a9ff;
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
		border-bottom: 2upx solid #fff;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #3AAAFF;
		background: #E4F4FF;
	}
	
	.u-tab-item-active{
		font-weight: bold;
		&::before {
			content: "";
			position: absolute;
			border-left: 4upx solid #3AAAFF;
			height: 100%;
			right: 0;
			top: 0;
		}
	}

	.u-tab-view {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background-color: #f5f5f5;
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
		position: absolute;
		margin-top: -275upx;
		top: 50%;
		left: 50%;
		margin-left: -150upx;
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
