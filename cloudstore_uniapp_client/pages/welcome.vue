<template>
	<view class="container">
		<image src="/static/welcome-bg.png" mode="scaleToFill" class="welcome-bg"></image>
		<view class="welcome-main">
			<image src="/static/welcome-logo.png" mode="widthFix" class="welcome-logo"></image>
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
				agentId: '',
				goodsId: "",
				activityId: '',
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
			// this.getLocation()
			console.log('测试版本:'+ ops)
			this.token = uni.getStorageSync('token')
			this.agentId = ops.agentId
			this.activityId = ops.activityId
			this.goodsId = ops.goodsId
			this.agentGoodsId = ops.agentGoodsId
			this.shareClientId = ops.shareClientId
			uni.setStorageSync('goodsInfo', ops)
		},
		onHide () {
			this.goodsId = ""
		},
		methods: {
			async getAgentInfo(timeout) {
				this.logining = false;
				let params = {};
				var that = this;
				
				let data = await Api.ApiFalseToken('post', Api.client.info.searchInfo, params);
				
				if (data) {
					if (this.goodsId) {
						uni.navigateTo({
							url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
						});
					} 
					else {
						uni.switchTab({
							url:'/pages/agent/goods/hotsale/hotsale'
						})
					}
				}
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
