<template>
	<view class="logistics-detail">
		<nav-bar backState="1000">配送详情</nav-bar>
		<view class="logistics-detail-main">
			<view class="logistics-info">
				<view class="info-number">
					<text>配送单号：</text>
					<text>2009160957775023</text>
				</view>
				<view class="info-time">
					<text>配送时间：</text>
					<text>2020-09-16 09:58:34</text>
				</view>
				<view class="info-relation">
					<view class="info-relation-title">物流单号：</view>
					<view class="info-relation-detail">
						<text class="cuIcon-locationfill"></text>
						<view class="relation-info">
							<text>李先生</text>
							<text>13844556677</text>
						</view>
						<view class="relation-address">深圳市宝安区福永华丰智谷福海科技产业园</view>
					</view>
				</view>
			</view>
		</view>
		<view class="logistics-detail-content">
			<view class="cu-timeline">
				<view class="cu-item text-blue">
					<view class="content">
						<text>2020-12-12</text> 快件已到达月球，准备发往地球
					</view>
				</view>
				<view class="cu-item text-blue">
					<view class="content">
						<text>2020-12-12</text> 快件已到达月球，准备发往地球
					</view>
				</view>
				<view class="cu-item text-blue">
					<view class="content">
						<text>2020-12-12</text> 快件已到达月球，准备发往地球
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
				
			}
		},
		components: {
			navBar
		},
		methods: {
			
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
