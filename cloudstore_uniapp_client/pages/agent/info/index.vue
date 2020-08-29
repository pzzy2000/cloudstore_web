<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/index-top-bg.png"></image>
			<view class="user-info-box">
				<view class="member-top-c">
					<template>
						<view class="" style="display: flex;align-items: center;" >
							<image class="portrait" mode="aspectFill" :src="user.url">{{user.name}}</image>
						</view>
					</template>
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
					url: '/static/log.png',
					detailUrl: '/static/log.png'
				},
				agentList:[
					{
						name: '配送管理',
						icon: 'cuIcon-calendar',
						url: '/pages/agent/info/order/index'
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					},
					{
						name: '敬请期待',
						icon: 'cuIcon-loading2',
						url: ''
					}
				]
			}
		},
		components: {
			navBar
		},
		methods: {
			toUrl (url, type) {
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
			font-size: 26upx;
			width: 25%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			padding: 20upx;
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
