<template>
	<view class="container">
		<!-- <nav-bar>丫咪购</nav-bar> -->
		<view class="MP-search">
			<image src="/static/index-top-bg.png" mode="" class="indexTopBg"></image>
			<view class="nav-title">丫咪购</view>
			<view class="content">
				<text class="cuIcon-locationfill text-white"></text>
				<text class="text-white">代理点：{{agentShopInfo.address}}</text>
				<!-- ({{agentShopInfo.distance}}km) -->
			</view>
			<view class="search-input" @click.stop="toSearch">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<text>云吞</text>
				</view>
			</view>
		</view>

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<view class="titleNview-background"></view>
			<swiper class="carousel" circular :autoplay='true' :interval="3000" @change="swiperChange" :style="{ height:carouselHeight+'px' }">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
					<image :src="item.piceUrl" @click="toUrl(item)"/>
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{ swiperCurrent + 1 }}</text>
				<text class="sign">/</text>
				<text class="num">{{ swiperLength }}</text>
			</view>
		</view>
		<view class="scroll-view-main">
			<scroll-view scroll-x class="floor-list" @scrolltoupper='scrollMoveLeft' @scrolltolower="scrollMoveRight" @scroll="scroll">
				<view class="scoll-wrapper" :style="{ width: towScreenWidth +'px' }">
					<view class="cate-item" v-for="(item,index) in typeList" :key='index' :style="{ width: itemScreenWidth+ 'px'}" @click="toReclassify(index)">
						<image :src="item.picturePice ==null ? '/static/log.png' : item.picturePice" class="cate-item-img"></image>
						<text class="clamp cate-item-text">{{item.name}}</text>
					</view>
				</view>
			</scroll-view>
			<image src="/static/client/left.png" mode="" class="left" v-if="isLeftArrows"></image>
			<image src="/static/client/right.png" mode="" class="right" v-if="isRightArrows"></image>
			<!-- <text class="cuIcon-back left"></text>
			<text class="cuIcon-right right"></text> -->
		</view>
		<!-- 活动 -->
		<!-- <view class="activity-main">
			<view class="cate-section">
				<view class="cate-item" v-for="(item,index) in activity.nav.one" :key="item.id" @click="navToCategory(item)">
					<image :src="item.picturePice ==null ? '/static/log.png' : item.picturePice"></image>
					<text class="clamp">{{item.name}}</text>
				</view>
			</view>
			<view class="cate-section">
				<view class="cate-item" v-for="(item,index) in activity.nav.two" :key="item.id" @click="navToCategory(item)">
					<image :src="item.picturePice ==null ? '/static/log.png' : item.picturePice"></image>
					<text class="clamp">{{item.name}}</text>
				</view>
			</view>
		</view> -->
		<view  v-for='item  in activity.show' :key="item.id" class="activity-list">
			<!-- <view class="f-header" @click="navToCategory(item)"> -->
				<!-- <view class="faddish-title"> -->
					<!-- <view class="title-main">
						{{item.name}}
					</view> -->
					<image :src="item.picturePice" mode="widthFix" class="title-img" @click="navToCategory(item)"></image>
				<!-- </view> -->
			<!-- </view> -->
			<view class="goods-list">
				<view v-for="(goods, index) in item.goodsList" :key="index" class="goods-item" @click="navToDetailPage(goods)">
					<view class="detail-img"><image :src="goods.goodsPicesBean.goodsPhotos[0].url" mode="aspectFit"></image></view>
					<view class="goods-detail">
						<view class="detail-title">
							<view class="clamp">{{ goods.goodsPicesBean.goodsName }}</view>
						</view>
						<view class="price-box">
							<view class="price">
								<text class="price-sale price-symbol">{{goods.goodsPicesBean.salePrice}}</text>/{{goods.goodsPicesBean.unit}}
							</view>
							<view class="share-amount">
								<!-- <text v-text="goods.goodsPicesBean.client">isType + {{isType() + goods.goodsPicesBean.client}}</text>元 -->
								<text>{{ isType() + goods.goodsPicesBean.client}}</text>元
							</view>
						</view>
						<view class="detail-bottom">
							<view class="price-bazaar">
								<text class="price-bazaar-text">销售价:</text>{{goods.goodsPicesBean.martPrice}}
							</view>
							<view class="cart-icon">购买</view>
						</view>
						<button class="detail-share" @click.stop="shareSave(goods)">分享</button>
					</view>
					<button type="primary" class="detail-share" @click.stop='shareSave(goods)'>分享</button>
				</view>
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
		components: {
			navBar,
			share,
		},
		data() {
			return {
				isLeftArrows: false,
				isRightArrows: true,
				upperThreshold: 50, 
				lowerThreshold: 50,
				screenWidth: '',
				itemScreenWidth:　'',
				towScreenWidth: '',
				carouselHeight: '',
				TabCur: 0,
				scrollLeft: 0,
				agentId: '',
				goodsId: '',
				goodsName: '',
				activityId: null,
				agentGoodsId: '',
				shareClientId: '',
				imageUrl: '',
				agentShopInfo: {
					name: '',
					address: '',
					latitude:  -1,
					longitude:  -1,
					distance: ''
				},
				longLat: '',
				shareAmounts: '',
				userType: '',
				loadingType: 'more', //加载更多状态
				typeList:[],
				activity: {
					nav: {},
					show: []
				},
				activityShopList: '',
				titleNViewBackground: '',
				carouselList: [
					{
						pic: '/static/slideshow/nav1.jpg'
					},
					{
						pic: '/static/slideshow/nav2.jpg'
					},
					{
						pic: '/static/slideshow/nav3.jpg'
					},
				],
				swiperCurrent: '',
				swiperLength: '3',
				shareList: [{
					icon: "/static/share_wechat.png",
					text: "微信好友",
					type: 1
				}],
				skeletonLoading: true
			};
		},
		//加载更多
		onReachBottom() {
			// this.pageNum = this.pageNum + 1;
		},
		onPullDownRefresh() {
			// this.pageNum = this.pageNum + 1;
			this.loadData()
			this.getLocation()
			this.shareAmount()
			uni.stopPullDownRefresh();
			// setTimeout(function() {
			// 	uni.stopPullDownRefresh();
			// }, 2000);
		},
		onLoad(ops) {
			this.loadData();
			// this.shareAmount()
			this.userType = uni.getStorageSync('userInfo').agent || uni.getStorageSync('userInfo').userType
		},
		onShow() {
			this.screenWidth = Api.getSystemInfoSync().screenWidth * 0.94
			this.itemScreenWidth = parseInt(parseInt(Api.getSystemInfoSync().screenWidth) / 5)
			this.towScreenWidth = parseInt(parseInt(this.itemScreenWidth * 10) * 0.6)
			this.carouselHeight = parseInt(parseInt(this.screenWidth) / 1.8)
			this.agentId = uni.getStorageSync('agentId') || '-1'
			this.getLocation()
			this.$nextTick(()=>{
				this.shareAmount()
			})
			// Vue.nextTick(function(){
			// 	this.shareAmount()
			// })
			uni.removeStorageSync('goodsInfo');
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
			isType() {
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
			scroll (event) {
				this.isLeftArrows = true
				this.isRightArrows = true
			},
			scrollMoveLeft () { //判断滑动导航条是否移动到左端
				let timer = setTimeout(()=>{
					this.isLeftArrows = false
					this.isRightArrows = true
					clearTimeout(timer)
				},100)
			},
			scrollMoveRight () {//判断滑动导航条是否移动到右端
				let timer = setTimeout(()=>{
					this.isLeftArrows = true
					this.isRightArrows = false
					clearTimeout(timer)
				},100)
			},
			shareAmount () { //处理分享出去的金额
				this.userType = uni.getStorageSync('userInfo').agent || uni.getStorageSync('userInfo').userType
				let list = this.activity.show;
				for( let i in list){
					let goodsList = list[i].goodsList;
					for( let j in goodsList){
						goodsList[j].goodsPicesBean.client= Api.ishareAmount(goodsList[j].goodsPicesBean);
					}
				}
			},
			async loadData() {
				this.getBanner();
				this.loadgoodsType()
				this.searchActivityNavList();
				this.searchActivityShowList();
			},
			async getAgentShop (res) { //获取最近的代理商
				let agentId = this.agentId || '-1'
				// let userInfo =  uni.getStorageSync('userInfo') ; 
				// if(userInfo!=null && userInfo.agent!=null){
				// 	agentId = userInfo.relationId;
				// }else{
				// 	agentId  = uni.getStorageSync('agentId');
				// 	agentId = (agentId!="undefined" && agentId !=null && agentId!='') ? agentId : '-1'
				// }
				let params = {
					 latitude: this.agentShopInfo.latitude,
					 longitude: this.agentShopInfo.longitude,
					 agentId: agentId || '-1'
				}
				let data = await Api.apiCall('post', Api.agent.activity.getAgentDistance, params,true);
				if (data) {
					if (data.result) {
						this.agentId = data.result.agentId
						uni.setStorageSync('agentId', this.agentId)
						try{
							var tmpData = data.result.agentBean
							this.agentShopInfo.name = tmpData.name
							this.agentShopInfo.address = tmpData.community
							this.agentShopInfo.distance = data.result.distance.toFixed(2)
						}catch(e){
							console.log('获取代理点失败')
						}
					}
				}else{
				}
			},
			async getLocation () { //用户同意获取后获取经纬度信息
				var that = this
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
						if (res) {
							that.agentShopInfo.longitude = res.longitude
							that.agentShopInfo.latitude = res.latitude
							that.getAgentShop(res)
						}
				    },
					fail: function (res) {
						that.getAgentShop()
						uni.showModal({
							title: '提示',
							content: '为方便提取和购买货物，请打开手机定位',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if (res.confirm){
									// that.openSetting()
								} else if(res.cancelText) {
								}
							},
						});
					}
				});
			},
			 openSetting(){ //定位授权
			    // 打开小程序的设置
			    // #ifdef MP-WEIXIN
			    uni.openSetting()
			    // #endif
			    
			    // App跳转系统的设置界面
			    // #ifdef APP-PLUS
			    uni.getSystemInfo({
			        success(res) {
			            if(res.platform=='ios'){ //IOS
			                plus.runtime.openURL("app-settings://");
			            } else if (res.platform=='android'){ //安卓
			                let main = plus.android.runtimeMainActivity();
			                let Intent = plus.android.importClass("android.content.Intent");
			                let mIntent = new Intent('android.settings.ACTION_SETTINGS');
			                main.startActivity(mIntent);
			            }
			        }
			    });
			    // #endif
			},
			async searchActivityNavList() { //查询轮播图下的活动nav
				let params = {
					// pageNum: 1,
					// pageSize: 20
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchActivityNavList, params, true);
				if (data) {
					this.activity.nav = data.result; //查询出来的 
					this.skeletonLoading = false
				}
			},
			async loadgoodsType () { //初始化加载商品一级分类
			this.typeList.length = 0
				let params = {
					pageNum: '1',
					parentId: 0
				};
				let list = await Api.apiCall('post', Api.agent.category.list, params, true);
				if (list) {
					// console.log(list)
					if (list.result.records.length != 0) {
						for (let tmp in list.result.records) {
							this.typeList.push({
								name: list.result.records[tmp].name,
								value: list.result.records[tmp].id,
								picturePice: list.result.records[tmp].categoryPicUrl
							})
						}
					} else {
						this.$api.msg('暂无分类数据')
					}
				} else {
					this.$api.msg('请求失败')
				}
			},
			async searchActivityShowList() {//查询首页显示的活动名称
				let params = {
					// pageNum: 1,
					// pageSize: 20
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchActivityShowList, params, true);
				if (data) {
					// this.activity.show = data.result.records;
					let showActivity = data.result.records;
					for (let i = 0; i < showActivity.length; i++) {
						showActivity[i].goodsList = [];
						this.searchActivityGoodsShowList(showActivity[i])
					}
					this.activity.show = showActivity;
				}
			},
			async searchActivityGoodsShowList(activity) { //查询首页显示活动的商品列表
				let params = {
					activityId: activity.id,
					pageNum: 1,
					pageSize: 5
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchIndexActivitygoodsList, params, true);
				if (data) {
					activity.goodsList = data.result.records;
					if (activity.goodsList) {
						this.shareAmount()
					}
					// this.shareAmount()
					// console.log(activity.goodsList)
				}
			},
			async getBanner() { //获取轮播图
				let params = {
				};
				let data = await Api.apiCall('post', Api.agent.hot.topPiceList, params, false);
				if (data) {
					this.carouselList = data.result || [];
					this.swiperLength = this.carouselList.length;
					this.titleNViewBackground = 'rgb(203, 87, 60)';
				}
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let goodsId = item.goodsId;
				let activitId = item.activityId;
				let agentGoodsId= item.id;
				// uni.navigateTo({
				// 	url: `/pages/agent/goods/agent/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${agentGoodsId}`
				// });
				uni.navigateTo({
					url: `/pages/client/goods/detail?goodsId=${goodsId}&activityId=${activitId}&agentGoodsId=${agentGoodsId}&agentId=${this.agentId}`
				});
			},
			navToCategory(item) { //跳转至热门活动列表
				let activitId = item.id;
				let  agentId = this.agentId;
				if (item.status) {
					if (item.toType === 'haibao') {
						uni.navigateTo({
							url: '/pages/agent/goods/hotsale/activityList?id='+item.id+'&agentId='+agentId,
						});
					} else {
						uni.navigateTo({
							url: '/pages/agent/goods/hotGoodsList/hotGoodsList?agentId='+agentId+'&id='+activitId+'&name='+item.name
						});
					}
				} else {
					this.$api.msg('敬请期待')
				}
			},
			toUrl (item) {
				if (item.type === 'active') {
					uni.navigateTo({
						url: '/pages/agent/goods/hotsale/activityList?id='+item.relatedId+'&agentId='+this.agentId,
					});
				} else if (item.type === 'url') {
					uni.navigateTo({
						url: '/pages/agent/goods/hotsale/webView?url='+item.url,
					});
				} else {
					return false;
				}
			},
			toSearch() { //跳转至搜索界面
				uni.navigateTo({
					url: "/pages/agent/goods/hotsale/search"
				});
			},
			toReclassify (index) {
				uni.reLaunch({
					url:'/pages/agent/goods/category/mallmenu?index='+index
				});
			},
			async shareSave (info) { //分享调用接口
				this.goodsId = info.goodsId
				this.activityId = info.activityId
				this.agentGoodsId = info.id
				this.goodsName = info.goodsPicesBean.goodsName
				this.imageUrl = info.goodsPicesBean.sharePicsUrl
				if (Api.isToken()) {
					let params = {
						'agentId': this.agentId,
						'goodsId': info.goodsId,
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
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		background: #f5f5f5;
	}
	.MP-search {
		.indexTopBg {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: -1;
		}
		position: fixed;
		width: 100%;
		z-index: 999;
		.content {
			width: 100%;
			padding: 0 20upx;
			font-size: 29upx;
		}
		.nav-title {
			color: #fff;
			line-height: 88upx;
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
			padding-top: 20px;
		}
		.search-input {
			width: 100%;
			text-align: center;
			padding: 0 20upx;
			margin: 20upx 0;
		}
		.cu-list {
			width: 100%;
			.cu-item {
				background: #5c8df1;
			}
		}
		.search-form {
			margin: 0;
			height: 60upx;
			line-height: 60upx;
			font-size: 22upx;
			color: #999;
			background-color: #fff;
			.cuIcon-search {
				font-size: 28upx;
				color: #333;
				margin-right: 10upx;
				display: inline-block;
			}
		}
	}
	page {
		background: #f5f5f5;
		padding-bottom: 160upx;
		.activity-main {
			width: 100%;
			padding:15upx 0;
			background-color: #fff;
			margin-bottom: 20upx;
			.cate-section {
				position: relative;
				z-index: 5;
				border-radius: 16upx 16upx 0 0;
			}
			
			.carousel-section {
				padding: 0;
				
				.titleNview-placing {
					padding-top: 0;
					height: 0;
				}
			
				.carousel {
					height: 300upx;
					margin-bottom: 20upx;
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
	}

	.m-t {
		margin-top: 20upx;
	}

	.carousel-section {
		position: relative;
		padding-top: 285upx;
		width: 100%;
		background-color: #fff;
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44upx;
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
	.scroll-view-main {
		width: 100%;
		padding-top: 15rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		position: relative;
		.floor-list {
			width: 100%;
			margin: 0 auto;
			background-color: #fff;
			padding-top: 10upx;
			.scoll-wrapper {
				display:flex;
				flex-wrap: wrap;
				// width: 1580upx;
				// align-items: flex-start;
				.cate-item {
					width: 120upx;
					text-align: center;
					margin-bottom: 30upx;
					// height: 170upx;
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					.cate-item-img {
						width: 120upx;
						height: 130upx;
						border-radius: 50%;
					}
					.cate-item-text {
						width: 100%;
						text-align: center;
						font-size: 26rpx;
					}
				}
			}
		}
		.left {
			height: 30upx;
			width: 30upx;
			// font-size: 30upx;
			margin-top: -15upx;
			top: 50%;
			left: 0;
			position: absolute;
		}
		.right {
			height: 30upx;
			width: 30upx;
			// font-size: 30upx;
			margin-top: -15upx;
			top: 50%;
			right: 0;
			position: absolute;
		}
	}
	.carousel {
		width: 94%;
		margin: 0 auto;
		height: 320upx;
		.carousel-item {
			width: 100%;
			height: 100%;
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

	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 15upx 0;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 20%;
			font-size: $font-sm + 2upx;
			.clamp {
				width: 100%;
				text-align: center;
			}
		}
		image {
			width: 120upx;
			height: 130upx;
			border-radius: 50%;
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

	.activity-list {
		width: 100%;
		.title-img {
			width: 100%;
			margin-top: 5upx;
		}
	}
	.f-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		padding: 0 15upx;
		border-top-left-radius: 25rpx;
		border-top-right-radius: 25rpx;
		.faddish-title {
			font-size: 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #fff;
			width: 100%;
			position: relative;
			.title-img {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
			.title-main {
				font-size: 45upx;
				color: #fff;
				text-align: center;
				position: absolute;
				height: 100%;
				width: 200upx;
				z-index: 1;
				left: 50%;
				margin-left: -100upx;
				top: 50%;
				margin-top: -25upx;
				font-family: '微软雅黑';
				font-weight: bold;
				letter-spacing: 4upx;

			}
			.more {
				color: #666666;
				font-size: 22upx;
				text-align: right;
				display: inline-block;
				width: 100%;
				line-height: 60upx;
			}
		}
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
	.activity-nav {
		font-size: 26upx;
		color: #000;
		height: 80upx;
		line-height: 80upx;
		.cu-item {
			text-align: center;
			width: 25%;
			height: 50upx;
			line-height: 50upx;
			padding: 0;
			margin: 0;
			box-sizing: border-box;
			.cu-item-title {
				border-right: 1upx solid #E5E5E5;
			}
		}
		.activity-nav-text {
			background-color: #fff;
			font-size: 20upx;
			width: 120upx;
			height: 30upx;
			line-height: 30upx;
			display: inline-block;
			border-radius: 14upx;
		}
	}
	// 商品列表
.goods-list {
	display: flex;
	width: 100%;
	justify-content: space-between;
	flex-wrap: wrap;
	align-content: flex-start;
	padding: 20upx 20upx 0;
	background-color: #F5F5F5;
	.goods-item {
		// width: 340upx;
		width: 48.5%;
		padding: 18upx;
		margin-bottom: 20upx;
		border-radius: 10upx;
		background: #fff;
		position: relative;
		.detail-share {
			position: absolute;
			right: 0;
			top: 0;
			font-size: 20upx;
			padding: 0;
			margin: 0;
			color: #fff;
			text-align: center;
			line-height: 40upx;
			width: 70upx;
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
	}
	.detail-img {
		width:270upx ;
		height: 240upx;
		margin: 0 auto;
		display: block;
		image {
			height: 100%;
			width: 100%;
		}
	}
	.detail-title {
		color: #333;
		font-size: 34upx;
	}
	.price-box {
		display: flex;
		.price {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-size: 22upx;
			.price-sale {
				color: #FF1313 ;
				font-size: 32upx;
				display: flex;
				align-items: flex-end;
			}
		}
		.share-amount {
			height: 35upx;
			line-height: 35upx;
			border-radius: 5upx;
			padding: 0 10upx;
			text-align: left;
			background-color: #FFEFBC;
			color: #FF8213;
			font-size: 18upx;
			margin-left: 15upx;
		}
	}
	.detail-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		.price-bazaar {
			line-height: 35upx;
			display: flex;
			color: #BABABA;
			font-size: 26upx;
			text-decoration: line-through;
			display: flex;
			align-items: flex-end;
			.price-bazaar-text {
				font-size: 20upx;
			}
		}
		.cart-icon {
			background-image: linear-gradient(#39A9FF, #2D9BEF);
			height: 40upx;
			width: 70upx;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			border-radius: 10upx;
			color: #fff;
			font-size: 20upx;
		}
	}
}
</style>
