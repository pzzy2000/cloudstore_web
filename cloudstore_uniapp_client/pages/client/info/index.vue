<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" src="/static/client/info-bg.png"></image>
			<view class="user-info-box">
				<view class="member-top-c">
					<template>
						<view class="" style="display: flex;align-items: center;" >
							<image class="portrait" mode="aspectFill" :src="user.url">{{user.name}}</image>
						</view>
					</template>
				</view>
			</view>
			<view class="vip-card-box">
				<view class="tit">
					<text class="yticon icon-iLinkapp-">{{user.agentType }}</text>
				</view>
				<text class="e-m"></text>
				<text class="e-b"></text>
			</view>
		</view>
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/client/order/order?status=0')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouye text-blue"></text>
					<text class="text">全部订单</text>
				</view>
				<view class="order-item cu-item" @click="navTo(false,false)" hover-class="common-hover" :hover-stay-time="50">
					<text class="cuIcon-sponsor text-blue" style="font-size: 60upx;"></text>
					<text class="text">提现</text>
				</view>
				<view class="order-item" @click="navTo('/pages/client/order/afterSaleList', 'afterSale')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-yishouhuo text-blue"></text>
					<text class="text">售后</text>
				</view>

				<view class="order-item" @click="navTo(false,false)" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan text-blue"></text>
					<text class="text">敬请关注</text>
				</view>
			</view>
			<!-- 浏览历史 -->
			<view class="cu-list menu sm-border margin-top">
				<view class="cu-item arrow" @click="toapplyAgent('/pages/client/info/address')" v-if="user.userType">
					<view class="content">
						<text class="cuIcon-location"></text>
						<text class="text-block text">地址管理</text>
					</view>
				</view>
				<view class="cu-item arrow" @click="toapplyAgent('/pages/client/info/showInfo')">
					<view class="content">
						<text class="cuIcon-peoplelist"></text>
						<text class="text-block text">个人资料</text>
					</view>
				</view>
				<view class="cu-item arrow"  @click="toapplyAgent('/pages/client/info/applyAgent')" v-if="user.userType == 'client'">
					<view class="content">
						<text class="cuIcon-vip"></text>
						<text class="text-block text">申请团长</text>
					</view>
				</view>
				<view class="cu-item arrow"  @click="toapplyAgent('/pages/client/info/applyAgent')" v-if="user.userType == 'agent'">
					<view class="content">
						<text class="cuIcon-vip"></text>
						<text class="text-block text">分销团长资料</text>
					</view>
				</view>
				<!-- <view class="cu-item arrow"  @click="toapplyAgent('/pages/agent/info/index')" v-if="user.userType == 'leader'">
					<view class="content">
						<text class="cuIcon-vip"></text>
						<text class="text-block text">团长入口</text>
					</view>
				</view> -->
				<view class="cu-item arrow">
					<button class="cu-btn content" open-type="contact">
						<text class="cuIcon-service"></text>
						<text class="text-block text">联系客服</text>
					</button>
				</view>
				<view class="cu-item arrow"  @click="toapplyAgent('/pages/client/info/about')">
					<view class="content">
						<text class="cuIcon-question"></text>
						<text class="text-block text">关于我们</text>
					</view>
				</view>
				<view class="cu-item arrow"  @click="toapplyAgent('/pages/client/info/editPwd')" v-if="user.userType">
					<view class="content">
						<text class="cuIcon-lock"></text>
						<text class="text-block text">修改密码</text>
					</view>
				</view>
				<view class="cu-item arrow" @click="navTo('/pages/client/public/login',)" v-if="!user.userType">
					<view class="content">
						<text class="cuIcon-exit"></text>
						<text class="text-block text">登录</text>
					</view>
				</view>
			</view>
		</view>
		<view @click="navTo('/pages/agent/goods/hotsale/hotsale','exit')" v-if="user.userType" class="info-exit">
			<button class="cu-btn block lg bg-white">退出</button>
		</view>
		<!-- <tabbar :role="'client'" :id="'cwd'"></tabbar> -->
	</view>
</template>
<script>
	import Api from '@/common/api';
	// import listCell from '@/components/mix-list-cell';
	// import neilModal from '@/components/neil-modal.vue';
	import { mapState,mapMutations } from 'vuex';
	let startY = 0, moveY = 0, pageAtTop = true;
	export default {
		components: {
		},
		data() {
			return {
				// inputShow: false,
				feild: undefined,
				inputContent: '',
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				userDetailInfo: {
					blance: 0,
					integration: 0
				},
				user:{
					relationId: '',
					userType: '',
					agentType: '游客',
					name: null || '游客',
					url: '/static/logo.png',
					detailUrl: '/static/logo.png'
				}
			};
		},
		onLoad() {
			this.getData()
		},
		async onShow() {
			this.getData()
		},
		computed: {
		},
		methods: {
			getData(){
				this.getuserinfo();
			},
			// 获取微信用户信息
			getuserinfo(){
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name || '普通会员'
					this.user.url = userInfo.wxPic;
					this.user.relationId = userInfo.relationId
					if (!userInfo.wxPic) {
						this.user.url = this.user.detailUrl
					}
					this.user.userType = 'client'
					this.isUserType(userInfo.agent)
				}
			},
			isUserType (type) {
				switch (type) {
					case null:
						this.user.agentType = '普通会员'
						this.user.userType = 'client'
					break;
					case 'agent':
						this.user.agentType = '分销团长'
						this.user.userType = 'agent'
					break;
					case 'leader':
						this.user.agentType = '团长'
						this.user.userType = 'leader'
					break;
					default:
						this.user.agentType = '普通会员'
						this.user.userType = 'client'
				}
				console.log(this.user.userType)
			},
			toNav(url){
				uni.navigateTo({
					url: url
				});
			},
			toAgent(){
				uni.navigateTo({
					url:"/pages/agent/home/index"
				})
			},
			toapplyAgent(url){
				if (url) {
					uni.navigateTo({
						url: url,
					});
				}else{
					uni.showToast({
						title: '敬请期待',
						icon: 'none'
					});
				}
			},
			async toExit(url){
				let params ={logintype:'client'};
				let data = await Api.apiCall('post', Api.client.login.logout, params, true, true);
				if(data){
					this.$api.msg("退出成功");
					setTimeout(function(){
					uni.clearStorage();
					uni.reLaunch({
						url: url
					});
					},2000); 
					
					// uni.navigateTo({
					// 	url:"/pages/client/public/login"
					// })
					
				}
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url,type) {
				if (type === 'exit') {
					
					this.toExit(url);
					// uni.reLaunch({
					// 	url: url
					// });
				} else if (type === false) {
					this.$api.msg('敬请期待')
				} else {
					uni.navigateTo({
						url: url +'?action=login'
					});
				}
				//this.$api.msg('提现功能于9月30日开发')
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
		}
	};
</script>
<style lang="scss">
@font-face {
	font-family: cgtt;
	font-weight: normal;
	font-style: normal;
	src: url('//at.alicdn.com/t/font_1475801_5innv59qqcr.ttf') format('truetype'),
}
page{
	background: #F3F3F3;
	padding-bottom: 100upx;
}
.cgtt {
	font-family: "cgtt" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-userShare:before {
	content: "\c600";
}

.icon-userJoin:before {
	content: "\c601";
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	display: flex;
	justify-content: space-around;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
.user-section {
	height: 520upx;
	padding: 100upx 30upx 0;
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
.login-btn {
	color: #fff;
	width: 180upx;
	height: 50upx;
	line-height: 50upx;
	border-radius: 25upx;
	background: #ff7159;
	font-size: 12px;
}
.cu-list.menu {
	border-radius: 10upx;
}
.vip-card-box {
	display: flex;
	flex-direction: column;
	color: #f7d680;
	height: 240upx;
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 0 24upx;
	.card-bg {
		position: absolute;
		top: 20upx;
		right: 0;
		width: 380upx;
		height: 260upx;
	}
	.b-btn {
		position: absolute;
		right: 20upx;
		top: 16upx;
		width: 132upx;
		height: 40upx;
		text-align: center;
		line-height: 40upx;
		font-size: 22upx;
		color: #36343c;
		border-radius: 20px;
		background: linear-gradient(left, #f9e6af, #ffd465);
		z-index: 1;
	}
	.tit {
		font-size: $font-base + 2upx;
		color: #f7d680;
		margin-bottom: 28upx;
		.yticon {
			color: #f6e5a3;
			margin-right: 16upx;
		}
	}
	.e-b {
		font-size: $font-sm;
		color: #d8cba9;
		margin-top: 10upx;
	}
}
.vip-card-box1 {
	display: flex;
	flex-direction: column;
	color: #f7d680;
	height: 60upx;
	width: 160upx;
	background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 20upx 24upx;

	.b-btn {
		position: absolute;
		right: 10upx;
		top: 10upx;
		width: 132upx;
		height: 40upx;
		text-align: center;
		line-height: 40upx;
		font-size: 22upx;
		color: #36343c;
		border-radius: 20px;
		background: linear-gradient(left, #f9e6af, #ffd465);
		z-index: 1;
	}
	.tit {
		font-size: $font-base + 2upx;
		color: #f7d680;
		margin-bottom: 28upx;
		.yticon {
			color: #f6e5a3;
			margin-right: 16upx;
		}
	}
	.e-b {
		font-size: $font-sm;
		color: #d8cba9;
		margin-top: 10upx;
	}
}
.cover-container {
	background: $page-color-base;
	margin-top: -150upx;
	padding: 0 20upx;
	position: relative;
	background: #f5f5f5;
	padding-bottom: 20upx;
}
.tj-sction {
	@extend %section;
	.tj-item {
		@extend %flex-center;
		flex-direction: column;
		height: 140upx;
		font-size: $font-sm;
		color: #75787d;
	}
	.num {
		font-size: $font-lg;
		color: $font-color-dark;
		margin-bottom: 8upx;
	}
}
.order-section {
	@extend %section;
	height: 200upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10upx;
	.order-item {
		@extend %flex-center;
		width: 25%;
		border-radius: 10upx;
		.text {
			font-size: 30upx;
			color: #212121;
		}
	}
	.yticon {
		font-size: 60upx;
	}
}
.history-section {
	padding: 30upx 0 0;
	margin-top: 20upx;
	background: #fff;
	border-radius: 10upx;
	.sec-header {
		display: flex;
		align-items: center;
		font-size: $font-base;
		color: $font-color-dark;
		line-height: 40upx;
		margin-left: 30upx;
		.yticon {
			font-size: 44upx;
			color: #5eba8f;
			margin-right: 16upx;
			line-height: 40upx;
		}
	}
	.h-list {
		white-space: nowrap;
		padding: 30upx 30upx 0;
		image {
			display: inline-block;
			width: 160upx;
			height: 160upx;
			margin-right: 20upx;
			border-radius: 10upx;
		}
	}
}
.cu-list.menu>.cu-item  {
	display: flex;
	align-items: center;
}
.cu-list.menu>.cu-item .content {
	display: flex;
	align-items: center;
}
.cu-list.menu>.cu-item .content>text {
	font-size: 50upx;
}
.cu-list.menu>.cu-item .content>.text {
	font-size: 30upx;
	color: #333333;
}
.info-exit {
	background-color: #fff;
	color: #000;
	font-size: 30upx;
	margin: 0 20upx;
	border-radius: 10upx;
}
</style>
