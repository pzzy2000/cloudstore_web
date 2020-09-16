<template>
	<view class="container">
		<nav-bar backState="1000">物流配送</nav-bar>
		<view class="logistics">
			<view class="logistics-tab">
				<view scroll-x class="logistics-tab-nav bg-white nav text-center">
					<view class="cu-item logistics-tab-text" :class="index === TabCur ?'text-blue cur':''" v-for="(item,index) in tabList" :key="item.id" @tap="tabSelect" :data-id="index">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="logistics-main">
				<view class="logistics-main-content" v-for="item in logisticsList" :key="item.id">
					<view class="logistics-time">
						<text>{{item.time}}</text>
						<text class="status">{{item.status}}</text>
					</view>
					<view class="logistics-info">
						<text class="name">{{item.name}}</text>
						<text>{{item.phone}}</text>
					</view>
					<view class="logistics-address">{{item.address}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				tabList: [
					{
						id: 0,
						name: '配送中'
					},
					{
						id: 1,
						name: '已签收'
					}
				],
				TabCur: 0,
				logisticsList: [
					{
						id: '123456',
						time: '2020-08-20',
						status:'配送中',
						name: '李先生',
						phone: '13844556677',
						address: '深圳市宝安区福永华丰智谷福海科技产业园'
					}
				]
			}
		},
		components: {
			navBar
		},
		methods: {
			netWork () {
				return {
					
				}
			},
			tabSelect (e) {
				this.TabCur = e.currentTarget.dataset.id;
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding: 20upx;
		background-color: #F5F5F5;
		height: 100%;
		width: 100%;
	}
	.logistics {
		width: 100%;
		.logistics-tab-nav {
			margin-bottom: 20upx;
			border-radius: 20upx;
			display: flex;

			.logistics-tab-text {
				width: 15%;
				padding: 0;
				margin: 0 auto;
			}
		}
	}
	.logistics-main {
		width: 100%;
		.logistics-main-content {
			width: 100%;
			border-radius: 20upx;
			background-color: #fff;
			padding: 20upx 40upx;
			.logistics-time {
				line-height: 50upx;
				height: 50upx;
				display: flex;
				justify-content: space-between;
				color: #555;
				font-size: 30upx;
				.status {
					color: #555;
				}
			}
			.logistics-info {
				line-height: 50upx;
				height: 50upx;
				display: flex;
				justify-content: flex-start;
				color: #555;
				.name {
					margin-right: 20upx;
				}
			}
			.logistics-address {
				line-height: 50upx;
				height: 50upx;
				color: #555;
			}
		}
	}
</style>
