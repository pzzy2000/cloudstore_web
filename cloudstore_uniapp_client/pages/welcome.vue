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
				token: '',
				base64Array: [],
				codeArray: [],
				actionType: '',
				activityGoodsId: ''//判断是不是线下活动
			}
		},
		onShow() {
			var that = this;
			const timeout = setTimeout(function() {
				if (that.actionType === 'xianxia') {
					console.log(1)
					uni.navigateTo({
						url: '/pages/client/belowTheLine/goods?activityGoodsId='+that.activityGoodsId
					});
				} else {
					that.getAgentInfo(timeout);
				}
			},2000)
		},
		onLoad(ops) {
			// ops.actionType = 'xianxia'
			// ops.activityGoodsId = '7959350568732856320'
			// this.actionType = ops.actionType
			// this.activityGoodsId = ops.activityGoodsId
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
			},
			encodeUrl (uId) {
				var arr1=[];
				var arr =uId.slice(1,uId.length).split('&');
				arr.forEach(function(val){
				      //删除=前面的数据再放进arr
				    arr1.push(val.substr(val.indexOf('=')+1));
				})
				return arr1;
				// console.log(arr1)
			},
			base64_decode (str) { // 解码，配合decodeURIComponent使用
			    return decodeURIComponent(atob(str).split('').map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				}).join(''));
			},
			decode(base64){
				// var b = new Buffer(base64, 'base64')
				// return b.toString();
				 return new Buffer(base64, 'base64').toString();
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
