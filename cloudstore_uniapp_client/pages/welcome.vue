<template>
	<view class="container">
		<image src="/static/welcome-bg.png" mode="" class="welcome-bg"></image>
		<view class="welcome-main">
			<image src="/static/welcome-logo.png" mode="" class="welcome-logo"></image>
		</view>
	     <!-- <mallplusCopyright></mallplusCopyright> -->
	</view>
</template>

<script>
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	// import {
	// 	mapMutations,
	// 	mapState
	// } from 'vuex';
	export default {
		components: {
			mallplusCopyright
		},
		data() {
			return {
				goodsId: "",
				agentGoodsId: "",
				shareClientId: "",
				userType: 'Client',
				token: ''
			}
		},
		onShow() {
			var that = this;
			const timeout = setTimeout(function() {
				that.getAgentInfo(timeout);
			},2000)
		},
		onLoad(ops) {
			this.token = uni.getStorageSync('token')
			this.goodsId = ops.goodsId
			this.agentGoodsId = ops.agentGoodsId
			this.shareClientId = ops.shareClientId
			uni.setStorageSync('goodsInfo', ops)
		},
		methods: {
			async getAgentInfo(timeout) {
				this.logining = false;
				let params = {};
				var that = this;
				
				uni.request({
					url: Api.BASEURI + Api.client.info.searchInfo,
					method: 'post',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'auth': this.token
					},
					data: params,
					success: res => {
						var data = res.data.result
						if (data.code<0) {
							uni.showToast({
								title: '[' + data.msg + ']',
								icon: 'none'
							});
							let timer = setTimeout(() => {
								clearTimeout(timer);
								uni.navigateTo({
									url: `/pages/client/public/login`
								})
							}, 2000);
						} else {
							let loginuser = data.result;
							uni.setStorageSync('userInfo', loginuser)
							uni.setStorageSync('token', loginuser.token)
							clearTimeout(timeout)
							if (this.goodsId) {
								uni.navigateTo({
									url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
								});
							} 
							else {
								uni.switchTab({
									url:'/pages/client/recommend/index'
								})
							}
						}
					}
				});
				
				// let data = await Api.apiCall('post', Api.client.info.searchInfo, params, true, false);
				// if (data) {
				// 	console.log(data)
				// 	let loginuser = data.result;
				// 	uni.setStorageSync('userInfo', loginuser)
				// 	uni.setStorageSync('token', loginuser.token)
				// 	clearTimeout(timeout)
				// 	if (this.goodsId) {
				// 		uni.navigateTo({
				// 			url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
				// 		});
				// 	} 
				// 	else {
				// 		uni.switchTab({
				// 			url:'/pages/client/recommend/index'
				// 		})
				// 	}
				// } 
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
		.welcome-bg {
			width: 100%;
			height: 100%;
		}
		.welcome-main {
			position: absolute;
			top: 30%;
			z-index: 10;
			margin-left: -150upx;
			left: 50%;
		}
		.welcome {
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			margin-top: 60rpx;
			letter-spacing: 10rpx;
		}
		.welcome-logo {
			height: 376upx;
			width: 296upx;
			display: block;
		}
	}
	
</style>
