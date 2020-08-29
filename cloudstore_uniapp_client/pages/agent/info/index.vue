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
		<view class="exit-btn" @click="toUrl('/pages/client/info/index', 'tab')">
			退出
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
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
				agentList:[
					{
						name: '配送管理',
						icon: 'cuIcon-calendar',
						url: '/pages/agent/info/order/index'
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
			navBar
		},
		onLoad () {
			this.getuserinfo()
		},
		methods: {
			getuserinfo(){ // 获取微信用户信息
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name || '普通会员'
					this.user.url = userInfo.wxPic;
					if (!userInfo.wxPic) {
						this.user.url = this.user.detailUrl
					}
				}
			},
			toUrl (url, type) { //页面跳转
				if(url) {
					if (type) {
						uni.switchTab({
						    url: url
						});
					} else {
						uni.navigateTo({
							url: url
						})
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
		background-color: #f5f5f5;
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
	}
</style>
