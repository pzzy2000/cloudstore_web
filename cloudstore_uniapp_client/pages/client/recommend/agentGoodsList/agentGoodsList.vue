<template>
	<view class="content">
		<nav-bar backState="1000" type='fixed'>代理商品列表</nav-bar>
		<!-- #ifdef H5 -->
		<view class="navbar">
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="navbar">
		<!-- #endif -->
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">商品分类</view>
			<!-- <view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon icon-shang xia"></text>
				</view>
			</view> -->
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<!-- 显示商品的列表 -->
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image>
				</view>
				<view class="goods-detail">
					<text class="title clamp">{{ item.goodsPicesBean.goodsName}}</text>
					<text class="clamp sub-title text-gray">{{item.goodsPicesBean.goodsSubtitle}}</text>
					<text class="clamp subhead text-gray">{{item.activeBean.name}}</text>
					<view class="price-box">
						<view class="price">
							<text class="priceSale">{{item.goodsPicesBean.salePrice}}</text>
							/
							<text class="pricemart">{{item.goodsPicesBean.martPrice}}</text>
						</view>
						<button class="goodsBtn" @click.stop="shareSave(item)">立即分享</button>
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
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
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
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js';
	import tuiCascadeSelection from '@/components/tui-cascade-selection/tui-cascade-selection.vue'
	import uniPopup from '@/components/uni-popup/uni-popup'
	import share from '@/components/share';
	export default {
		data() {
			return {
				agentId: '',
				statusBarHeight: '',
				priceOrder: '',
				cateList: '',
				filterIndex: 0,
				cateMaskState: 0, //分类面板展开状态
				goodsList: [],
				pageNum: 1,
				itemList: [],
				receiveData: [],
				categoryOneId: '',
				categoryTwoId: '',
				categoryThreeId: '',
				activityId: '',
				agentGoodsId: '',
				shareClientId: '',
				userType: '',
				shareList: [
					{
					  icon: "/static/temp/share_wechat.png",
					  text: "微信好友",
					  type: 1
					}
				],
			}
		},
		components: {
			navBar, tuiCascadeSelection, uniPopup, share
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				this.$refs.share.toggleMask();
				var shareObj = {
					title: this.goodsName,
					params: {
						goodsId: this.goodsId,
						agentGoodsId: this.agentGoodsId,
						shareClientId: this.shareClientId || '-1',
						userType: this.userType
					},
					path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType='+this.userType,
				}
			}
			return shareObj
		},
		onReachBottom() { //上拉加载
		 	this.pageNum = this.pageNum + 1;
			this.loadData()
		},
		onLoad (option) {
			console.log(option)
			this.agentId = option.agentId
			this.userType = uni.getStorageSync('userInfo').agent
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			//获取代理商代理的商品列表
			this.loadData('initialize')
			this.loadgoodsType()
			this.loadActiviList()
		},
		onPullDownRefresh() { //下拉刷新
			this.loadData('initialize');
			this.filterIndex = 0
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
					this.activityId = ''
					this.categoryOneId = ''
					this.categoryTwoId = ''
					this.categoryThreeId = ''
					this.receiveData = []
					this.pageNum = 1;
				}
				var params = {
					agentId: this.agentId, 
					activeId: this.activityId,
					pageNum: this.pageNum,
					pageSize: '10',
					categoryOneId: this.categoryOneId,
					categoryTwoId: this.categoryTwoId,
					categoryThreeId: this.categoryThreeId
				};
				let list = await Api.apiCall('post', Api.client.recommend.listAactivity, params);
				if (list) {
					console.log(list)
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
					this.loadData('initialize');
				}
				if (index === 1) {
					this.filterIndex = 1
					this.loadData('initialize');
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
				let id = item.goodsId,agentGoodsId = item.id,userType = 'agent',activeId = item.activeId
				uni.navigateTo({
					url: '/pages/agent/goods/goodsDetail/goodsDetail?goodsId='+id+'&userType='+userType+'&agentGoodsId='+agentGoodsId+'&activeId='+item.activeId
				});
			},
			toShare () {
				this.$refs.share.toggleMask();
			},
			async shareSave (item) {
				this.goodsId = item.goodsId
				this.agentGoodsId = item.id
				this.goodsName = item.goodsPicesBean.goodsName
				// console.log(item)
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let params = {
					'agentGoodsId': this.agentGoodsId,
					'shareId': this.shareClientId || '-1',
					'type': this.userType
				} 
				let data = await Api.apiCall('post', Api.agent.share.save, params);
				if (data) {
					uni.hideLoading() 
					if (data.code === 0) {
						this.shareClientId = data.result.id
						if (this.shareClientId) {
							this.toShare()
						}
					}else{
						uni.showToast({
							title: data.msg
						});
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.content {
	padding-bottom: 100upx;
	padding-top: 96upx;
}
.navbar {
	position: absolute;
	left: 0;
	top: 130upx;
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
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		width: 100%;
		margin-bottom: 10upx;
		background: #fff;
		padding: 10upx;
		// &:nth-child(2n + 1) {
		// 	margin-right: 4%;
		// }
	}
	.image-wrapper {
		width: 200upx;
		height: 200upx;
		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
			opacity: 1;
		}
	}
	.goods-detail {
		display: inline-block;
		width: 70%;
		padding: 0 30rpx;
		.title {
			font-size: 30upx;
			color: #000;
			height: 20%;
			width: 100%;
			display: inline-block;
		}
		.sub-title {
			font-size: 24upx;
			height: 20%;
		}
		.subhead {
			font-size: 24upx;
			height: 30%;
			display: flex;
			align-items: flex-end;
		}
		.price-box {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			font-size: 24upx;
			color: $font-color-light;
			height: 25%;
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
					font-size: 25upx;
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
