<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/index-top-bg.png"></image>
			<view class="user-info-box">
				<view class="member-top-c">
					<view class="" style="display: flex;align-items: center;" >
						<image class="portrait" mode="aspectFill" :src="user.url">{{user.name}}(团长)</image>
					</view>
				</view>
			</view>
			<view class="agent-main">
				<view class="agent-main-list" v-for="(item,index) in agentList" @click="toUrl(item.url)" :key='index'>
					<text class="text-blue list-icon" :class="item.icon"></text>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="today-push">
			<text class="today-push-title text-red">今日必推</text>
			<!-- <text class="line"></text> -->
			<view class="today-push-list">
				<view class="today-push-list-item" v-for="item in todayPush" :key='item.activityGoodsPicBean.id' @click="onToDetail(item.activityGoodsPicBean)">
					<image :src="item.activityGoodsPicBean.goodsPicesBean.goodsDetailPhotos[0].url" mode="" class="today-push-img"></image>
					<view class="today-push-item-content">
						<view class="item-title clamp">
							{{item.activityGoodsPicBean.goodsPicesBean.goodsName}}
							<view class="cu-tag badge bg-yellow">Hot</view>
						</view>
						<text class="item-sub-title">{{item.activityGoodsPicBean.goodsPicesBean.goodsSubtitle}}</text>
						<view class="item-buttom">
							<view class="item-price">
								<text class="price-sale price-symbol">{{item.activityGoodsPicBean.offlinePrice}}</text>
								<text class="price-mart price-symbol">{{item.activityGoodsPicBean.goodsPicesBean.martPrice}}/{{item.activityGoodsPicBean.goodsPicesBean.unit}}</text>
							</view>
							<button type="default" class="promotion-btn">分享推广</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="exit-btn" @click="toUrl('/pages/client/info/index', 'tab')">
			退出
		</view>
		<!-- 分享 -->
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
				user:{
					relationId: '',
					userType: '',
					agentType: '普通会员',
					name: null || '普通会员',
					url: '/static/logo.png',
					detailUrl: '/static/logo.png'
				},
				imageUrl: '',
				agentId: '',
				goodsName: '',
				goodsId: '',
				activityId: '',
				agentGoodsId: '',
				shareClientId: -1,
				todayPush: '',
				shareList: [
					{
					  icon: "/static/share_wechat.png",
					  text: "微信好友",
					  type: 1
					}
				],
				agentList:[
					// {
					// 	name: '配送管理',
					// 	icon: 'cuIcon-calendar',
					// 	url: '/pages/agent/info/order/index'
					// },
					{
						name: '订单管理',
						icon: 'cuIcon-calendar',
						url: '/pages/agent/info/iorder/orderlist'
					},
					{
						name: '物流管理',
						icon: 'cuIcon-deliver',
						url: '/pages/agent/info/logistics/index'
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-refund',
						url: ''
					}
				]
			}
		},
		components: {
			navBar, share
		},
		onLoad () {
			
			this.getuserinfo()
			this.netWork().getBaoKuaiGoods()
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
					shareClientId: -1,
					userType: 'Client'
				},
				path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
			}
			return shareObj
		},
		methods: {
			netWork () {
				return {
					getBaoKuaiGoods: async () => {
						let params = {}
						let data = await Api.apiCall('post', Api.agent.agentInfo.baoKuaiGoods, params, true);
						if (data) {
							console.log(data.result)
							if (data.result.length) {
								this.todayPush = data.result
							}
						}
					}
				}
			},
			getuserinfo(){ // 获取微信用户信息
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name || '普通会员'
					this.user.url = userInfo.wxPic;
					this.user.relationId = userInfo.relationId
					this.agentId = userInfo.relationId
					if (!userInfo.wxPic) {
						this.user.url = this.user.detailUrl
					}
				}
			},
			financeGoodsProfit (item) {
				return (Number(item.leader) * 1000 + Number(item.agent) * 1000)/1000
				console.log((Number(item.leader) * 1000 + Number(item.agent) * 1000)/1000)
			},
			share() { //分享显示弹窗
				this.$refs.share.toggleMask();
			},
			async shareSave (item) { //分享调用接口
				this.goodsId = item.goodsId
				this.activityId = item.activityId
				this.agentGoodsId = item.id
				this.goodsName = item.goodsPicesBean.goodsName 
				this.imageUrl = item.goodsPicesBean.goodsDetailPhotos[0].url
				if (Api.isToken()) {
					uni.showLoading({
						title: '正在加载',
						mask: false
					});
					let params = {
						'agentId': this.agentId,
						'goodsId': this.goodsId,
						'activityId': this.activityId,
						'shareId': '-1',
						'type': ''
					} 
					let data = await Api.apiCall('post', Api.agent.share.save, params, true);
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
			onToDetail (item) {
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
			toUrl (url, type) { //页面跳转
				if(url) {
					if (type) {
						uni.switchTab({
						    url: url
						});
					} else {
						// this.$api.msg('敬请期待')
						// return false;
						uni.navigateTo({
							url: url
						})
						// if (url === '/pages/agent/info/logistics/index') {
						// 	this.$api.msg('敬请期待')
						// 	return false;
						// } else {
						// 	uni.navigateTo({
						// 		url: url
						// 	})
						// }
					}
				} else {
					this.$api.msg('敬请期待')
					return false;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: relative;
		// background-color: #f5f5f5;
		padding-bottom: 180upx;
	}
	.user-section {
		padding: 100upx 30upx 0 30upx;
		position: relative;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 360upx;
			// opacity: 0.7;
		}
	}
	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		z-index: 1;
		position: relative;
		.member-top-c {
			display: flex;
			align-items: center;
		}
		.portrait {
			width: 100upx;
			height: 100upx;
			border: 5upx solid #fff;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		.username {
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}
	.agent-main {
		width: 90%;
		background-color: #fff;
		margin: 0 auto;
		border-radius: 15upx;
		display: flex;
		flex-wrap: wrap;
		position: absolute;
		z-index: 3;
		.agent-main-list {
			text-align: center;
			font-size: 30upx;
			width: 25%;
			display: flex;
			color: #212121;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			padding: 20upx 10upx;
			.list-icon {
				width: 100%;
				font-size: 60upx;
			}
		}
	}
	.today-push {
		width: 90%;
		margin: 0 auto;
		padding-top: 300upx;
		position: relative;
		.today-push-title {
			display: block;
			margin: 0 auto;
			width: 50%;
			text-align: center;
			font-size: 35upx;
			font-weight: bold;
			line-height: 70upx;
		}
		.line {
			width: 90%;
			height: 1upx;
			top: 335upx;
			background-color: #555;
			position: absolute;
			margin-left: -45%;
			left: 50%;

		}
		.today-push-list {
			.today-push-list-item {
				display: flex;
				justify-content: start;
				background-color: #fff;
				width: 100%;
				border-radius: 15upx;
				padding: 15upx;
				margin-bottom: 15upx;
				.today-push-img {
					height: 165upx;
					width: 165upx;
					border-radius: 15upx;
					margin-right: 30upx;
				}
				.today-push-item-content {
					width: calc(100% - 200upx);
					.item-title {
						position: relative;
						display: inline-block;
						font-size: 28upx;
						color: #000;
						line-height: 50upx;
						.cu-tag.badge {
							top: 0;
							right: -50upx;
						}
					}
					.item-sub-title {
						font-size: 24upx;
						width: 100%;
						color: #555;
						height: 60upx;
						display: flex;
						align-items: flex-start;
					}
					.item-buttom {
						display: flex;
						justify-content: space-between;
						.item-price {
							.price-sale {
								color: red;
								width: 100%;
								display: inline-block;
								font-size: 26upx;
							}
							.price-mart {
								color: #555;
								font-size: 22upx;
								text-decoration: line-through;
							}
						}
						.promotion-btn {
							width: 180upx;
							height: 50upx;
							text-align: center;
							line-height: 50upx;
							margin: 0;
							padding: 0;
							border-radius: 35upx;
							font-size: 28upx;
							background-image: linear-gradient(-90deg, #FE8A14, #FED041);
							color: #fff;
							&::after {
								border: none;
							}
						}
					}
				}
			}
		}
	}
	.exit-btn {
		position: fixed;
		bottom: 50upx;
		left: 50%;
		margin-left: -45%;
		width: 90%;
		background-color: #fff;
		color: #555;
		line-height: 80upx;
		height: 80upx;
		font-size: 26upx;
		text-align: center;
		border-radius: 15upx;
		box-shadow: 0 0 14upx 0 rgba(64,181,255, 0.2);
	}
</style>
