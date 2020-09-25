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
						配送地址:{{detail.agentBean.provinceBean.name}}
						{{detail.agentBean.cityBean.name}}
						{{detail.agentBean.townBean.name}}
						{{detail.agentBean.community}}
						{{detail.agentBean.detailAddress}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="logistics-detail-content">
			<view class="cu-timeline">
				<view class="cu-item text-blue" v-for="item in detail.infoBeans.details" >
					<view class="content">
						<text>{{item.time}}</text> 
						<text>{{item.msg}}</text>
					</view>
				</view>
				
			</view>
		</view>
		<!-- <view class="logistics-detail-order">
			<view class="">
				
			</view>
		</view> -->
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				id: '',
				detail:null
			}
		},
		components: {
			navBar
		},
		onLoad(ops) {
			// this.id = ops.id
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
							console.log(data)
							this.detail = data.result;
							// this.logisticsList = data.result.records
						}
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.logistics-detail {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
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
	}
</style>
