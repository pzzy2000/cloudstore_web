<template>
	<view class="logistics-detail">
		<nav-bar backState="1000">配送详情</nav-bar>
		<view class="logistics-detail-main">
			<view class="logistics-info">
				<view class="info-number">
					<text>配送单号：</text>
					<text>{{detail.allocationNo}}</text>
				</view>
				<view class="info-number">
					<text>配送时间：</text>
					<text>{{detail.allocationTime}}</text>
				</view>
				<view class="info-relation">
					<view class="info-relation-detail">
						<text class="cuIcon-locationfill"></text>
						<view class="relation-info">
							<text>收货人:</text>
							<text>{{detail.agentBean.name}}</text>
						</view>
						<view class="relation-info">
							<text>联系电话:</text>
							<text>{{detail.agentBean.phone}}</text>
						</view>
						<view class="relation-address">
						配送地址:{{detail.agentBean.provinceBean.name || ''}}
						{{detail.agentBean.cityBean.name || ''}}
						{{detail.agentBean.townBean.name || ''}}
						{{detail.agentBean.community || ''}}
						{{detail.agentBean.detailAddress || ''}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="logistics-detail-content">
			<view class="cu-timeline">
				<view class="cu-item text-blue" v-for="item in detail.infoBeans.details" :key='item.id'>
					<view class="content">
						<text>{{item.time}}</text> 
						<text>{{item.msg}}</text>
					</view>
				</view>
				<view class="content" v-if="detail.infoBeans.details.length === 0" style="padding: 0 30upx;">暂无物流信息</view>
			</view>
		</view>
		<view class="logistics-detail-order">
			<view class="order-detail" v-for="item in detailList" :key="item.id">
				<view class="time">
					<text>下单时间：{{item.orderBean.createTime}}</text>
					<button class="affirm-btn" @click="onShowModal(item)" v-if="item.deliveryType === 'Manual' && item.status === 'yps'">确认收货</button>
				</view>
				<view class="name-phone">
					收货人：<text style="margin-right: 20upx;">{{item.orderBean.clientAddressBean.name}}</text><text>{{item.orderBean.clientAddressBean.phone}}</text>
				</view>
				<view class="address">收货人地址：{{item.orderBean.clientAddressBean.provinceBean.name}}{{item.orderBean.clientAddressBean.cityBean.name}}{{item.orderBean.clientAddressBean.areaBean.name}}{{item.orderBean.clientAddressBean.detailAddress}}</view>
				<view class="order-person">
					下单人信息:<view class="">姓名:{{item.orderBean.clientBean.name}}</view>
					<view class="">电话:{{item.orderBean.clientBean.phone}}</view>
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
				id: '',
				detail:null,
				detailList: ''
			}
		},
		components: {
			navBar
		},
		onLoad(ops) {
			this.id = ops.id
			this.netWork().getLogisticsDetail(ops.id)
		},
		methods: {
			netWork () {
				return {
					getLogisticsDetail: async (id) => {
						let parmas = {
							id: id,
						}
						let data = await Api.apiCall('post', Api.agent.agentLogistics.detail, parmas, true )
						if (data) {
							this.detail = data.result;
							this.detailList = this.detail.orderBeans
							// this.logisticsList = data.result.records
						}
					}
				}
			},
			handle () {
				return {
					onAffirm: async (item) => {
						let parmas = {
							id: item.id,
							deliveryType: 'Manual'
						}
						// console.log(item.id)
						let data = await Api.apiCall('post', Api.agent.agentLogistics.yps, parmas, true )
						if(data) {
							if (data.code === 0) {
								this.netWork().getLogisticsDetail(this.id)
								this.$api.msg('确认收货成功')
								this.handle().initData()
							}
						}
					},
					initData: () => {
						this.detail.length = 0
						this.detailList.length = 0
					}
				}
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
					},
				});
			}
			
		}
	}
</script>

<style scoped lang="scss">
	.logistics-detail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
		padding-bottom: 20upx;
	}
	.logistics-detail-main {
		padding: 20upx;
		.logistics-info {
			background-color: #FFFFFF;
			color: #555555;
			padding: 30upx 20upx;
			border-radius: 20upx;
			.info-number {
				line-height: 60upx;
				height: 60upx;
			}
			.info-time {
				line-height: 60upx;
				height: 60upx;
			}
			.info-relation {
				.info-relation-title {
					line-height: 60upx;
					height: 60upx;
				}
				.info-relation-detail {
					position: relative;
					padding-left: 70upx;
					.cuIcon-locationfill {
						position: absolute;
						left: 10upx;
						top: 50%;
						margin-top: -20upx;
						font-size: 40upx;
					}
					.relation-info {
						height: 50upx;
					}
				}
			}
		}
	}
	.logistics-detail-content {
		padding: 0 20upx;
		.cu-timeline {
			padding: 20upx 0;
			border-radius: 20upx;
		}
		.cu-timeline>.cu-item>.content {
			padding: 15upx;
			background: #f3f3f3;
			border-radius: 15rpx;
		}
	}
	.logistics-detail-order {
		padding: 0 20upx;
		margin-top: 20upx;
		margin-bottom: 30upx;
		.order-detail {
			padding: 20upx 30upx;
			border-radius: 20upx;
			font-size: 24upx;
			border-bottom: 1upx solid #EEE;
			background-color: #fff;
			line-height: 50upx;
			margin-bottom: 20upx;
			.time {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #999;
				.affirm-btn {
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
			.name-phone {
				color: #333333;
			}
			.address {
				color: #666666;
				border-bottom: 1upx solid #eee;
			}
		}
		.order-person {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
