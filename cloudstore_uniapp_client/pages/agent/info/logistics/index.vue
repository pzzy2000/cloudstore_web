<template>
	<view class="container">
		<nav-bar backState="1000">物流配送</nav-bar>
		<view class="logistics">
			<view class="logistics-tab">
				<view scroll-x class="logistics-tab-nav bg-white nav text-center">
					<view class="cu-item logistics-tab-text" :class="index === TabCur ?'text-blue cur':''" v-for="(item,index) in tabList" :key="item.id" @tap="onTabSelect(item)" :data-id="index">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="earning-empty" v-if="!logisticsList.length">
				<image src="/static/client/earning-logo.png" mode="" class="earning-logo"></image>
				<view class="earning-empty-text">暂无{{tabName}}数据</view>
			</view>
			<view class="logistics-main">
				<view class="logistics-main-content" v-for="item in logisticsList" :key="item.id" @click="onLogisticsDetail(item.id)">
					<view class="logistics-time">
						<text>配送时间：{{item.allocationTime}}</text>
						<template>
							<text class="status" v-if="item.status === 'dps'">待配送</text>
							<text class="status" v-else-if="item.status === 'yps'">已配送</text>
							<text class="status" v-else-if="item.status === 'ysd'">已送达</text>
						</template>
					</view>
					<view class="logistics-info">
						<text class="name">团长:{{item.agentBean.name}}&nbsp;&nbsp;&nbsp;&nbsp;电话:{{item.agentBean.phone}}</text>
						
					</view>
					<view class="logistics-address">
						<text>{{item.agentBean.detailAddress}}</text>
					</view>
					<view class="logistics-btn" v-if="item.status === 'yps'">
						<button @click.stop="onShowModal(item)">确认签收</button>
					</view>
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
						name: '全部', //默认显示全部
						status: '',
					},
					{
						id: 1,
						name: '待配送',
						status: 'dps',
					},
					{
						id: 2,
						name: '已配送',
						status: 'yps',
					},
					{
						id: 3,
						name: '已送达',
						status: 'ysd'
					}
				],
				TabCur: 0,
				tabName: '',
				pageNum: 1,
				status: '',
				logisticsList: []
			}
		},
		components: {
			navBar
		},
		onLoad() {
			this.netWork().getLogistics()
		},
		onPullDownRefresh() { //下拉刷新
			this.pageNum = 1
			this.logisticsList.length = 0
			this.netWork().getLogistics()
		},
		onReachBottom() { //上拉加载
		 	this.pageNum = this.pageNum + 1;
			// this.logisticsList.length = 0
			this.netWork().getLogistics()
		},
		methods: {
			netWork () {
				return {
					getLogistics: async () => {
						let parmas = {
							pageNum: this.pageNum,
							pageSize: 10,
							status: this.status
						}
						let data = await Api.apiCall('post', Api.agent.agentLogistics.list, parmas, true )
						if (data.result.records.length != 0) {
							this.logisticsList = this.logisticsList.concat(data.result.records)
						} else {
							// this.$api.msg('没有更多了')
							this.pageNum--
						}
						uni.stopPullDownRefresh();
					}
				}
			},
			handle () {
				return {
					initData: () => {
						this.pageNum = 1,
						this.logisticsList.length = 0
					},
					onAffirm: async (item) => {
						let parmas = {
							id: item.id,
							deliveryType: 'Logistics'
						}
						console.log(item)
						let data = await Api.apiCall('post', Api.agent.agentLogistics.yps, parmas, true )
						if(data) {
							if (data.code === 0) {
								this.$api.msg('确认收货成功')
								this.netWork().getLogistics(this.id)
								this.handle().initData()
							}
						}
					},
				}
			},
			onTabSelect (item) {
				this.TabCur = item.id
				this.status = item.status
				this.tabName = item.name
				this.pageNum = 1
				this.handle().initData()
				this.netWork().getLogistics()
			},
			onShowModal (item) {
				uni.showModal({
					title: '提示',
					content: '您确认收货吗',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						this.handle().onAffirm(item)
					}
				})
			},
			onLogisticsDetail (id) {
				uni.navigateTo({
					url: '/pages/agent/info/logistics/detail?id='+id,
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background-color: #F5F5F5;
		height: 100%;
		width: 100%;
	}
	.logistics {
		width: 100%;
		.logistics-tab-nav {
			margin-bottom: 20upx;
			display: flex;
			font-size: 26upx;
			color: #222;
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
			background-color: #fff;
			padding: 0 40upx;
			margin-top: 30upx;
			.logistics-time {
				line-height: 70upx;
				height: 70upx;
				display: flex;
				justify-content: space-between;
				color: #999;
				font-size: 24upx;
				border-bottom: 1upx solid #eee;
				.status {
					color: #49B1FE;
				}
			}
			.logistics-info {
				line-height: 70upx;
				height: 70upx;
				display: flex;
				justify-content: space-between;
				padding-right: 30upx;
				color: #333;
				font-size: 24upx;
				.status {
					color: #49B1FE;
				}
				.name {
					margin-right: 20upx;
				}
			}
			.logistics-address {
				// line-height: 70upx;
				height: 50upx;
				font-size: 24upx;
				color: #555;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				border-bottom: 1upx solid #eee;
			}
			.logistics-btn {
				height: 70upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				button {
					width: 135upx;
					height: 45upx;
					line-height: 45upx;
					text-align: center;
					background-image: linear-gradient(#68BDFF,#49B1FE);
					color: #fff;
					border-radius: 25upx;
					font-size: 24upx;
					margin: 0;
					padding: 0;
				}
			}
		}
	}
	.earning-empty {
		padding-top: 100upx;
		.earning-logo {
			width: 300upx;
			height: 180upx;
			margin: 0 auto;
			display: block;
		}
		.earning-empty-text {
			color: #999999;
			font-size: 30upx;
			white-space: 5upx;
			line-height: 150upx;
			width: 100%;
			text-align: center;
			display: block;
		}
		.earning-empty-btn {
			color: #F1F1F1;
			background-color: #39A9FF;
			white-space: 5upx;
			width: 500upx;
			height: 72upx;
			text-align: center;
			border: none;
			border-radius: 36upx;
			&:after {
				border: none
			}
		}
	}
</style>
