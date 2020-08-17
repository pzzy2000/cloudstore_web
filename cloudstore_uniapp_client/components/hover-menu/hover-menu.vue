<template>
	<view>
		<!-- 遮罩 -->
		<!-- <view class="mask" v-if="show" @tap="show = false" @touchmove.stop.prevent></view> -->
		<!-- 按钮 -->
		<view class="major-box" :class="{show: show}">
			<view class="" style="position: relative;">
				<view class="click-btn" @tap="show = !show" draggable="true" @touchstart="touchstart"
				 @touchmove.stop.prevent="touchmove">
				<!-- <view class="click-btn" v-if="!show" @tap="show = !show" draggable="true" @touchstart="touchstart"
				 @touchmove.stop.prevent="touchmove"> -->
					<!-- <view>快捷导航</view> -->
					<image src="../../static/tabbar/logo.png" mode="" class="click-btn-img"></image>
				</view> 
					<view class="nav-box" v-if="show">
							<view class="nav-btn" v-for="(btn, index) in btnList" :key="index" @tap="clickBtn(btn.type)">
								<view class="nav-icon">
									<image class="icon" :src="btn.icon"></image>
								</view>
								<!-- <view class="nav-text">{{btn.text}}</view> -->
							</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataId: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				show: false, // 是否显示
				deviationTop: 0, // 偏移量
				windowHeight: uni.getSystemInfoSync().windowHeight, // 视图高度 
				btnList: [ // 所有按钮 
					{
						text: '我的',
						icon: '../../static/tabbar/my-meun.png',
						type: 1
					},
					{
						text: '购物车',
						icon: '../../static/tabbar/cart-meun.png',
						type: 2
					},
					{
						text: '收益',
						icon: '../../static/tabbar/earnings-meun.png',
						type: 3
					},
				]
			};
		},
		methods: {
			// 点击按钮 
			clickBtn: function(type) {
				// this.show = false
				if (type == 1) {
					uni.reLaunch({
						url: '/pages/client/info/index'
					});
				}
				if (type == 2) {
					uni.reLaunch({
						url: '/pages/client/cart/index'
					});
				}
				if (type == 3) {
					uni.reLaunch({
						url: '/pages/client/earnings/index'
					});
				}
			},
			// 拖动开始，记录一下偏移量
			touchstart: function(e) {
				var touch = e.touches[0] || e.changedTouches[0];
				this.deviationTop = touch.clientY - this.top;
				// console.log(this.deviationTop);
			},
			// 上下拖动时 
			touchmove: function(e) {
				var touch = e.touches[0] || e.changedTouches[0];
				var top = touch.clientY;
				top = top - this.deviationTop;
				if (top < 0) {
					top = 0;
				}
				if (top > this.windowHeight - 40) {
					top = this.windowHeight - 40;
				}
				this.top = top;
				return false;
			},
		}
	};
</script>

<style>
	/* 遮罩 */
	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 99;
		background: rgba(248, 248, 248, 0);
	}

	/* 总盒子 */
	.major-box {
		border: 1px 0 solid;
		z-index: 100;
		position: fixed;
		bottom: 20%;
		right: 10upx;
		height: 80upx;
		transition: left 0.5s;
		overflow: hidden;
		background: #040303;
		border-radius: 100rpx;
		opacity: 0.7;
	}

	.click-btn,
	.nav-box {
		float: right;
	}

	/* 按钮样式 */
	.nav-box {
		background-color: #FFF;
		border-radius: 0 0 0 5px;
	}

	.click-btn {
		text-align: center;
		border-radius: 50%;
		height: 80upx;
		width: 80upx;
	}

	.click-btn uni-view {
		line-height: 80upx;
		font-size: 28upx;
	}
	.click-btn-img {
		height: 100%;
		width: 100%;
	}
	/* 按钮盒子 */
	.nav-box {
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		justify-content: center;
		background-color: #040303;
		color: #fff;
		opacity: 0.8;
		text-align: center;
		border-radius: 100upx;
	}

	.nav-btn {
		flex: 1;
		border: 0px #000 solid;
		min-width: 80upx;
	}

	.icon {
		margin: 0 auto;
		width: 70upx;
		height: 70upx;
	}

	.nav-text {
		font-size: 28upx;
	}
</style>
