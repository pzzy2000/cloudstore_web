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
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量优先</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon icon-shang xia"></text>
				</view>
			</view>
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
					<text class="title clamp subhead ">{{item.goodsPicesBean.goodsSubtitle}}</text>
					<view class="price-box">
						<view class="price">
							<text class="priceSale">{{item.goodsPicesBean.salePrice}}</text>
							/
							<text class="pricemart">{{item.goodsPicesBean.martPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 分类筛选组件 -->
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
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js';
	export default {
		data() {
			return {
				statusBarHeight: '',
				priceOrder: '',
				cateList: '',
				filterIndex: '',
				cateMaskState: 0, //分类面板展开状态
				goodsList: [],
				pageNum: 1,
			}
		},
		components: {
			navBar
		},
		onReachBottom() { //上拉加载
		 	this.pageNum = this.pageNum + 1;
			this.agentShopListData()
		},
		onLoad () {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			//获取代理商代理的商品列表
			this.agentShopListData()
		},
		methods: {
			async agentShopListData () {
				let parmas = {
					pageNum: this.pageNum,
					pageSize: 10
				}
				let shopListData  = await Api.apiCall('post', Api.agent.user.agentList,parmas,0);
				if (shopListData) {
					if (shopListData.result.records.length === 0) {
						this.$api.msg('没有更多了')
					} else {
						this.goodsList = this.goodsList.concat(shopListData.result.records)
					}
				}
			},
			toggleCateMask (type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer);
			},
			//分类点击
			changeCate(item) {
				this.pageNum = 1;
				this.typeId = item.id;
				this.toggleCateMask();
				this.searchtype()
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
				//this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				});
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
			}
		}
	}
</script>

<style scoped lang="scss">
.content {
	background: $page-color-base;
	padding-bottom: 160upx;
}
.content {
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
	padding: 10upx 30upx;
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
		overflow: visible;
		image {
			width: 200upx;
			height: 200upx;
			opacity: 1;
			overflow: visible;
		}
	}
	.goods-detail {
		display: inline-block;
		width: 100%;
		padding: 0 30rpx;
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 70upx;
			width: 80%;
			display: inline-block;
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
