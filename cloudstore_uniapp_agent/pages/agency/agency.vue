<template>
	<view>
		<view class="" @click="search()" style="background: #FFFFFF;height: 80upx;display: flex;justify-content: center;align-items: center;" :style="[{'margin-top': statusBarHeight+45+'px'}]">
			<input class="" type="text" value="" placeholder="输入关键字搜索" style="font-size: 28upx;background: #F5F5F5;height: 60upx;width: 90%;border-radius: 50upx;text-align: center;" />
		</view>
		<view class="agency-main">
			<view class="agency-header">
				<image src="" mode="" alt='头像'></image>
				<view class="header-info">
					<text class="title samp">这是名称</text>
					<text>回头率：50 &nbsp;&nbsp;&nbsp;&nbsp;收藏量： 40</text>
				</view>
			</view>
			<view class="agency-list">
				<view class="" v-for="(item, index) in headerList">
					<text>{{item.number}}</text>
					<p>{{item.name}}</p>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: '',
				height: '',
				headerList: [
					{
						name : '今日访客',
						number: '20'
					},
					{
						name : '今日订单数',
						number: '20'
					},
					{
						name : '今日订单全部',
						number: '20'
					},
					{
						name : '分享店铺',
						number: '20'
					},
				]
			}
		},
		onLoad () {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			this.height = uni.getSystemInfoSync().windowHeight - (this.statusBarHeight+80)
		},
		methods: {
			search () {
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.agency-main{ 
		width: 94%;
		margin: 0 auto;
		.agency-header {
			display: flex;
			justify-content: flex-start;
			padding: 20upx 0;
			uni-image{
				height: 150upx;
				width: 150upx;
				background-color: red;
			}
			.header-info {
				width: 60%;
				font-size: 20upx;
				color: #999;
				padding: 30upx;
				.title {
					color: #000000;
					font-size: 30upx;
					display: block;
				}
			}
		}
		.agency-list {
			display: flex;
			justify-content: space-between;
			font-size: 35upx;
			text-align: center;
			span {
				font-size: 25upx;
				color: #303133;
			}
		}
	}
</style>
