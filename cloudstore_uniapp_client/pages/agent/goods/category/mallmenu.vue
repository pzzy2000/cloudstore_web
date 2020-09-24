<template>
	<view class="mallmenu-content">
		<nav-bar>商品分类</nav-bar>
		<view class="u-search-box">
			<view class="u-search-inner" @click="onSearch">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索商品</text>
			</view>
		</view>
		<view class="mallmenu-main">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in goodsOneType" :key="index" class="u-tab-item" :class="[mallmenuOneTypeCurrent==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @click="onGoodsOneType(index, item.value)">
					<text>{{item.text}}</text>
				</view>
			</scroll-view>
			<view class="mallmenu-main-left">
				<!-- 二级分类的弹窗 -->
				<view class="popup-TwoType" v-if="isSelectTwoType">
					<view v-for="(item,index) in goodsTwoType" :key='index' :data-current="index" class="popup-TwoType-text" :class="[mallmenuTwoTypeCurrent==index ? 'action' : '']" @click="onGoodsTwoType(index, item.value)">
						{{item.text}}
					</view>
				</view>
				<view class="masking" v-if="isSelectTwoType" @click="onPullDown" catchtouchmove="false"></view>
				<view class="mallmenu-screen">
					<view class="mallmenuTwoType">
						<scroll-view scroll-x='true' class="mallmenu-scroll">
							<view class="mallmenu-text" v-for="(item,index) in goodsTwoType" :key="index" 
							:class="[mallmenuTwoTypeCurrent==index ? 'action' : '']"
							:data-current="index"
							@click="onGoodsTwoType(index, item.value)">
								{{item.text}}
							</view>
						</scroll-view>
						<view class="pull-down" @click="onPullDown">
							<image src="/static/agent/top.png" mode="" class="cuIcon-triangleupfill" v-if="isSelectTwoType"></image>
							<image src="/static/agent/bottom.png" mode="" class="cuIcon-triangledownfill" v-if="!isSelectTwoType"></image>
							<!-- <text class="cuIcon-triangleupfill" v-if="isSelectTwoType"></text>
							<text class="cuIcon-triangledownfill" v-if="!isSelectTwoType"></text> -->
						</view>
					</view>
					<view class="mallmenu-screen-main">
						<view :class="havStock ? 'text-blue' : ''" @click="onselectAvailable">有货</view>
						<view class="screen-main-price" @click="onPrice">
							价格
							<view class="p-box">
								<text class="cuIcon-triangleupfill icon" :class="sortVal === 'desc' ? 'text-blue' : '' "></text>
								<text class="cuIcon-triangledownfill icon" :class="sortVal === 'asc' ? 'text-blue' : ''"></text>
							</view>
						</view>
						<view :class="selectGoodsBrandListValue ? 'text-blue' : ''" @click="onBrand" class="cuIcon-filter">筛选</view>
						<view class="nav-item-twoCategory" v-if="isGoodsBrand">
							<view class="twoCategory-list">
								<view class="twoCategory-title">品牌</view>
								<view v-for="(item, index) in goodsBrandList" :key="index" class="twoCategory-item" :class="item.select? 'twoCategory-item-select' : '' "  @click="selectTwoCategory(item, index)">
									{{item.name}}
								</view>
							</view>
							<view class="twoCategory-btn">
								<button class="reset" @click="onGoodsBrandReset">重置</button>
								<button class="submit" @click="onGoodsBrandSubmit">确定</button>
							</view>
						</view>
					</view>
				</view>
				<view class="brand-masking" v-if="isGoodsBrand" @click="onBrand" catchtouchmove="false"></view>
				<scroll-view scroll-y class="mallmenu-right-scroll" @scrolltolower='scrolltolower' catchtouchmove="false">
					<view class="earning-empty" v-if='goodsList.length === 0'>
						<image src="/static/client/earning-logo.png" mode="" class="earning-logo"></image>
						<view class="earning-empty-text">没有该分类下的商品</view>
					</view>
					<view class="item-container">
						<view class="masking" v-if="ismask" @click="isMasking" catchtouchmove="false"></view>
						<view class="goods-list" v-for="(item,index) in goodsList" :key='index' @click="onNavToDetailPage(item)">
							<image class="goods-list-image" :src="item.goodsPhotos[0].url" mode=""></image>
							<view class="goods-detail">
								<view class="detail-title clamp">{{item.goodsName}}</view>
								<view class="detail-subtitle clamp">{{item.goodsSubtitle}}</view>
								<view class="detail-price">
									<template>
										<view class="price-num" v-if="item.salePrice != 0.01">
											<text class="price-sale price-symbol">{{item.salePrice}}</text>
											<text class="price-btn-unit">/{{item.unit || '无'}}</text>
										</view>
										<view class="price-text" v-else>
											<text class="price-sale">静待惊喜价</text>
										</view>
									</template>
									<view class="price-btn">
										<button class="price-share" @click.stop='onShareSave(item)'><text>{{handler().isType()+item.client}}</text></button>
										<button class="price-buy">立即购买</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<share ref="share" :contentHeight="580" :shareList="shareList"></share>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import share from '@/components/share';
	export default {
		data() {
			return {
				pageToType: '',
				agentId:'',
				goodsId: '',
				activityId: '',
				agentGoodsId: '',
				goodsName: '',
				imageUrl: '',
				goodsOneType: [],
				mallmenuOneTypeCurrent: '', //控制一级分类的选中样式
				goodsTwoType: [],
				mallmenuTwoTypeCurrent: '',//控制二级分类的选中样式
				isSelectTwoType: '',
				goodsList: [],
				pageNum: 1,
				categoryOneId: '',
				categoryTwoId: '',
				havStock: '',  //有货显示
				dirVal: "", //salePrice
				sortVal: "",//asc
				goodsBrandList: [],
				isGoodsBrand: false,
				selectGoodsBrandList: [],
				selectGoodsBrandListValue: '',
				shareList: [{
					icon: "/static/share_wechat.png",
					text: "微信好友",
					type: 1
				}]
			}
		},
		components: {
			navBar,share
		},
		onLoad(ops) {
			// console.log(ops)
			this.agentId = uni.getStorageSync('agentId')
			this.netWork().getGoodsOneType(ops.index) //初始化调用获取一级分类列表
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
			netWork () { //网络层
				return {
					getGoodsOneType: async (index) => { //初始化加载商品一级分类
						let params = {
							pageNum: 1,
							parentId: 0
						};
						let list = await Api.apiCall('post', Api.agent.category.list, params, true);
						if (list) {
							if (list.result.records.length != 0) {
								for (let tmp in list.result.records) {
									this.goodsOneType.push({
										text: list.result.records[tmp].name,
										value: list.result.records[tmp].id,
										action: false
									})
								}
								if (index) { //判断是否从首页跳转
									// this.goodsOneType[index].action = true
									this.mallmenuOneTypeCurrent = index
									this.categoryOneId = this.goodsOneType[index].value //赋值一级分类的id
								} else {
									this.goodsOneType[0].action = true
									this.categoryOneId = this.goodsOneType[0].value 
								}
								this.netWork().getGoodsTwoType() //调用获取二级分类的方法
							} else {
								this.$api.msg('暂无一级分类数据')
							}
						} else {
							this.$api.msg('请求失败')
						}
					},
					getGoodsTwoType: async ()=> { //查询出二级分类的数据
						let params = {
							pageNum: 1,
							parentId: this.categoryOneId
						};
						let list = await Api.apiCall('post', Api.agent.category.list, params, true);
						if (list) {
							if (list.result.records.length != 0) {
								this.goodsTwoType.length = 0
								for (let tmp in list.result.records) {
									this.goodsTwoType.push({
										text: list.result.records[tmp].name,
										value: list.result.records[tmp].id,
										action: false
									})
								}
								this.goodsTwoType.unshift({
									text: '全部',
									value: '',
								})
								this.goodsTwoType[0].action = true
								this.categoryTwoId = this.goodsTwoType[0].value //赋值二级分类的id
								this.netWork().getGoodsData()
								this.netWork().getGoodsBrand()
							} else {
								this.$api.msg('暂无二级分类数据')
							}
						} else {
							this.$api.msg('请求失败')
						}
					},
					getGoodsData: async () => { //初始化加载商品数据，包括下拉和下拉刷新
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
							goodsBrand: this.selectGoodsBrandListValue
						};
						let list = await Api.apiCall('post', Api.agent.goods.list, params,true);
						if (list) {
							if (list.result.records.length) {
								this.goodsList = this.goodsList.concat(list.result.records);
								this.handler().shareAmount()
							} else {
								if (this.pageNum != 1) {
									this.$api.msg('没有更多了')
								}
								// this.pageNum --
							}
						}
					},
					getGoodsBrand: async () => { //查询商品品牌的数据
						this.goodsBrandList.length = 0
						let params = {
							categoryOneId: this.categoryOneId,
							categoryTwoId: this.categoryTwoId
						};
						let list = await Api.apiCall('post', Api.agent.goods.goodsBrand, params, true);
						if (list ){
							if (list.code === 0) {
								for (let tmp in list.result) {
									this.goodsBrandList.push({
										name: list.result[tmp].goodsBrand,
										select: false
									})
								}
							}
						}
					},
				}
			},
			handler () { //逻辑处理
				return {
					shareAmount () { //处理分享出去的金额
						for( let i in this.goodsList){
							this.goodsList[i].client= Api.ishareAmount(this.goodsList[i]);
						}
					},
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
					initData: () => { //将需要初始化的数据抽离出来
						this.goodsList = [] //清空商品列表
						this.isGoodsBrand = false //品牌选择框隐藏
						this.isSelectTwoType = false //下拉二级分类隐藏
						this.selectGoodsBrandList = [] //品牌选择列表清空
						this.selectGoodsBrandListValue = '' //传给后台的品牌选择列表数据清空
						this.pageNum = 1 //分页页码变为1
						this.havStock = '' //默认筛选为全部，而不是有货
						this.dirVal = ''  //初始化价格排序
						this.sortVal = '' //初始化价格排序
					}
				}
			},
			//以下为事件层
			onGoodsOneType (index, value) { //点击一级分类
				this.handler().initData()
				this.mallmenuOneTypeCurrent = index //获取一级分类的下标,实现选中高亮
				this.categoryOneId = value //获取一级分类的id
				this.mallmenuTwoTypeCurrent = 0 //二级分类默认选择全部
				this.netWork().getGoodsTwoType()
			}, //点击二级分类
			onGoodsTwoType (index, value)  {
				this.handler().initData()
				this.mallmenuTwoTypeCurrent = index
				this.categoryTwoId = value
				this.netWork().getGoodsData()
				this.netWork().getGoodsBrand()
			},
			onPullDown () { //点击二级分类筛选
				this.isSelectTwoType = !this.isSelectTwoType
				this.isGoodsBrand = false
			},
			scrolltolower() { //右边滑动块到底，触发分页
				this.pageNum = this.pageNum + 1;
				this.netWork().getGoodsData();
			},
			onselectAvailable () { //点击有货和全部商品
				this.havStock = this.havStock ? '' : 1
				this.isSelectAvailable = !this.isSelectAvailable
				this.goodsList.length = 0
				this.pageNum = 1
				this.netWork().getGoodsData()
			},
			onPrice () { //价格升序和降序
				this.goodsList.length = 0
				this.pageNum = 1
				this.dirVal = 'salePrice'
				this.sortVal = this.sortVal === 'desc' ? 'asc' : 'desc'
				this.netWork().getGoodsData()
			},
			onBrand () { //显示平牌的筛选
				this.isGoodsBrand = !this.isGoodsBrand
				this.isSelectTwoType = false
			},
			selectTwoCategory(item, index) { //点击活动分类的类别
				this.goodsBrandList[index].select = this.goodsBrandList[index].select ? false : true
				var index = this.selectGoodsBrandList.indexOf(item.name);
				if (index > -1) {
					this.selectGoodsBrandList.splice(index, 1);
				} else {
					this.selectGoodsBrandList.push(item.name)
				}
			},
			onGoodsBrandReset () { //重置活动分类
				// this.selectGoodsBrandList = ''
				this.selectGoodsBrandList = []
				this.selectGoodsBrandListValue = ''
				for (let tmp in this.goodsBrandList) {
					this.goodsBrandList[tmp].select = false
				}
				this.goodsList.length = 0
				this.isGoodsBrand = !this.isGoodsBrand
				this.netWork().getGoodsData()
			},
			onGoodsBrandSubmit () {//点击确定筛选活动分类
				this.pageNum = 1
				this.isGoodsBrand = !this.isGoodsBrand
				this.selectGoodsBrandListValue = this.selectGoodsBrandList.join()
				this.goodsList.length = 0
				this.netWork().getGoodsData()
			},
			onSearch () {
				uni.navigateTo({
					url: '/pages/agent/goods/hotsale/search',
				});
			},
			onNavToDetailPage (item) {
				let goodsId = item.id, activitId = item.activityId, activityGoodsId= item.activityGoodsId;
				uni.navigateTo({
					url: `/pages/client/goods/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${activityGoodsId}&agentId=${this.agentId}`
				});
			},
			async onShareSave(info) {
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
			share() { //分享显示弹窗
				this.$refs.share.toggleMask();
			},
		}
	}
</script>

<style scoped lang="scss">
	.mallmenu-content {
		width: 100%;
		height: 100%;
	}
	.u-search-box {
		padding: 20upx;
		background-color: #fff;
		box-sizing: content-box;
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
	}
	.mallmenu-main {
		flex: 1;
		display: flex;
		background-color: #fff;
		// position: fixed;
		// left: 0;
		height: calc(100% - 220upx);
	}
	.u-tab-view {
		width: 160upx;
		height: 100%;
		background-color: #fff;
		.u-tab-item {
			display: inline-block;
			height: 110rpx;
			background: #f5f5f5;
			border-bottom: 2upx solid #fff;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #666;
			letter-spacing: 4upx;
		}
		.u-tab-item-active {
			position: relative;
			color: #3AAAFF;
			font-size: 26upx;
			background: #E4F4FF;
			letter-spacing: 2upx;
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
	}
	.mallmenu-main-left {
		width: calc(100% - 160upx);
		position: relative;
		.popup-TwoType {
			width: 100%;
			background-color: #fff;
			position: absolute;
			left: 0;
			top: 80upx;
			padding: 20upx;
			display: flex;
			flex-wrap: wrap;
			z-index: 4;
			.popup-TwoType-text {
				background-color: #F5F5F5;
				border-radius: 10upx;
				color: #666;
				height: 50upx;
				line-height: 50upx;
				padding: 0 20upx;
				margin-bottom: 20upx;
				margin-right: 20upx;
				text-align: center;
				display: inline-block;
			}
			.action {
				background-color: #8BCDFF;
				color: #fff;
			}
		}
		.masking {
			width: 100%;
			height: 100%;
			background: rgba(0,0,0, 0.5);
			position: absolute;
			z-index: 2;
		}
		.mallmenu-screen {
			width: 100%;
			z-index: 3;
			.mallmenuTwoType {
				display: flex;
				white-space:nowrap;
				border-bottom: 1upx solid #F1F1F1;
				padding: 15upx 0;
				position: relative;
				background: #fff;
				z-index: 3;
				.mallmenu-scroll {
					padding-right: 50upx;
				}
				.pull-down {
					position: absolute;
					right: 0;
					height: 100%;
					height: 50upx;
					width: 100upx;
					text-align: right;
					padding-right: 10upx;
					line-height: 50upx;
					background-image: linear-gradient(to left, rgb(255, 255, 255),rgb(255, 255, 255), transparent);
					background-image: -webkit-linear-gradient(to left, rgb(255, 255, 255),rgb(255, 255, 255), transparent);
					background-image: -o-linear-gradient(to left, rgb(255, 255, 255),rgb(255, 255, 255), transparent);
					.cuIcon-triangledownfill {
						width: 100%;
						height: 100%;
						font-size: 40upx;
					}
					.cuIcon-triangleupfill {
						width: 100%;
						height: 100%;
						font-size: 40upx; 
					}
				}
				.mallmenu-text {
					display: inline-block;
					font-size: 26upx;
					background-color: #f5f5f5;
					height: 50upx;
					text-align: center;
					line-height: 50upx;
					padding: 0 35upx;
					border-radius: 10upx;
					color: #666;
					margin-left: 15upx;
				}
				.action {
					background-color: #8BCDFF;
					color: #fff;
				}
			}
			.mallmenu-screen-main {
				display: flex;
				justify-content: space-between;
				border-bottom: 1upx solid #f1f1f1;
				height: 80upx;
				line-height: 80upx;
				padding: 0 20upx;
				background: #fff;
				z-index: 3;
				position: relative;
				.screen-main-price {
					display: flex;
					justify-content: center;
					align-items: center;
					.p-box {
						display: flex;
						flex-direction: column;
						.icon {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 30upx;
							height: 14upx;
							line-height: 1;
							margin-left: 4upx;
							font-size: 26upx;
							// color: #888;
						}
					}
				}
				.nav-item-twoCategory {
					position: absolute;
					background-color: #fff;
					top: 80upx;
					right: 0upx;
					width: 100%;
					z-index: 3;
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
							line-height: 50upx;
							padding: 5rpx 15rpx;
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
			}
		}
		.brand-masking {
			width: 100%;
			height: 100%;
			position: absolute;
			background: rgba(0,0,0, 0.5);
			z-index: 2;
			top: 0;
		}
		.mallmenu-right-scroll {
			height: calc(100% - 190upx);
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
		.item-container {
			display: flex;
			flex-wrap: wrap;
			position: relative;
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
								font-weight: 500;
							}
							.price-unit {
								color: #999;
								font-size: 24upx;
							}
						}
						.price-text {
							color: #FF1414;
							font-size: 24upx;
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
								min-width: 130upx;
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
		}
	}
</style>
