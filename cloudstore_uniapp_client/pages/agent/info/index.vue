<template>
	<view class="container">
		<view class="user-section">
			<!-- <image class="bg" src="/static/user-bg.jpg"></image> -->
			<view class="user-info-box">
				<view class="member-top-c">
					<template v-if="userDetailInfo && userDetailInfo.id">
						<view class="" style="display: flex;align-items: center;" >
							<image class="portrait" mode="aspectFill" :src="userDetailInfo.icon" @click="toUserInfo"></image>
							<view class="user-name" style="margin-left: 10upx;color: #FFFFFF;" @click="toUserInfo">{{ userDetailInfo.nickname || userDetailInfo.username }}</view>
							<view  v-if="userDetailInfo.storeId" class="vip-card-box1" @click="toNav('../../pagesC/seller/index')">
                            <view class="b-btn">卖家中心</view>
                            </view>
						</view>
					</template>
					<template v-else>
						<!-- #ifdef H5 || APP-PLUS -->
						<!-- <image class="portrait" mode="aspectFill" src="/static/missing-face.png" @click="toLogin">{{user.name}}</image> -->
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<image class="portrait" mode="aspectFill" :src="user.url" @click="toWeChatLogin">{{user.name}}</image>
                        <!-- #endif -->
						<!-- #ifdef H5 -->
						<image class="portrait" mode="aspectFill" :src="user.url" @click="toLogin">{{user.name}}</image>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="portrait"></view>
						<view><button class="login-btn" open-type="getAuthorize" @click="getALICode" hover-class="btn-hover">授权登录</button></view>
						<!-- #endif -->
					</template>
				</view>
			</view>
			<view class="vip-card-box">
				<view class="b-btn" v-if='isLeader' @click.stop="upgrade">立即升级</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-">{{userTypeName}}</text>
				</view>
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
			<image class="arc" src="/static/arc.png"></image>
			<!-- <view class="tj-sction">
				<view class="tj-item" @click="toNav('../../pagesU/user/deposit')">
					<text class="num">{{ userDetailInfo.blance || 0 }}</text>
					<text>余额</text>
				</view>
				<view class="tj-item" @click="toNav('../../pagesU/user/coupon')">
					<text class="num">{{ couponList.length || 0 }}</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item" @click="toNav('/pages/integral/home/home')">
					<text class="num">{{ userDetailInfo.integration || 0 }}</text>
					<text>积分</text>
				</view>
			</view> -->
			<view class="cu-list menu sm-border margin-top">
				<view class="cu-item arrow" @click="navTo('/pages/client/info/applyAgent', 'agent')">
					<view class="content">
						<text class="cuIcon-group text-pink"></text>
						<text class="text-block">代理资料</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<button class="cu-btn content" open-type="contact">
						<text class="cuIcon-servicefill text-olive"></text>
						<text class="text-block">联系客服</text>
					</button>
				</view>
				<view class="cu-item arrow" @click="navTo('/pages/client/info/index','client')">
					<view class="content">
						<text class="cuIcon-exit text-purple"></text>
						<text class="text-block">代理商退出</text>
					</view>
				</view>
			</view>
		</view>
		<neil-modal :show="inputShow" @close="cancel" title="编辑" @cancel="cancel" @confirm="confirm">
			<input v-model="inputContent" style="margin:20upx" placeholder="请输入..." />
		</neil-modal>
		
		<tabbar :role="'agent'" :ids="'adlxx'"></tabbar>	
	</view>
</template>
<script>
	import Api from '@/common/api';
	import listCell from '@/components/mix-list-cell';
	import neilModal from '@/components/neil-modal.vue';
	import { mapState,mapMutations } from 'vuex';
	let startY = 0, moveY = 0, pageAtTop = true;
	export default {
		components: {
			listCell, neilModal
		},
		data() {
			return {
				isLeader: false,
				userTypeName: '',
				inputShow: false,
				feild: undefined,
				inputContent: '',
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				userDetailInfo: {
					blance: 0,
					integration: 0
				},
				couponList: [],
				viewList: [],
				user:{
					name: null || '未登录',
					url: '',
					detailUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593358672989&di=a7c323de2bac0269ead9e7ab0531ba13&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F9662a766b2e14418b22ed6e8185913c3e7562ab455df-j8mU0R_fw658'
				}
			};
		},
		onLoad() {
			this.getuserinfo()
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '../../pagesU/notice/notice'
				});
			}
		},
		// #endif

		computed: {
			...mapState(['hasLogin', 'userInfo']),
			// 获取店铺联系人手机号
			kfmobile() {
				return '13146587722' || 0;
			}
		},
		methods: {
			...mapMutations(['logout']),
			inputShowModal(feild) {
				this.feild = feild;
				this.inputShow = true;
				this.inputContent = '';
			},
			cancel() {
				this.inputShow = false;
			},
			confirm() {
				const that = this;
				if (!that.inputContent) {
					that.$api.msg('输入不能为空');
					return;
				}
				let obj = {	id:this.userDetailInfo.id};
				obj[that.feild] = that.inputContent;
				Api.apiCall('post', Api.member.updateMember, obj);
				that.$api.msg('修改成功');
				that.userInfos[that.feild] = that.inputContent
			},
			// 获取微信用户信息
			getuserinfo(){
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name || this.user.nickName
					this.user.url = userInfo.wxPic || this.user.detailUrl
					if (!userInfo.wxPic) {
						this.user.url = this.user.detailUrl
					}
					if (userInfo.agent === 'agent') {
						this.userTypeName = '代理商'
						this.isLeader = true
					}else {
						this.userTypeName = '团长'
					}
				}
			},
			// 获取h5用户信息
			async getH5info () {
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.user.name = userInfo.name
				}
			},
			// 获取浏览历史
			async getHistory(){
				if(this.hasLogin){
					let params = {  };
					let data = await Api.apiCall('get', Api.goods.viewList, params);
					this.viewList = data.result;
				}
			},
			toNav(url){
				uni.navigateTo({
					url: url
				});
			},
			toUserInfo(){
				uni.navigateTo({
					url: '../../pagesU/user/profile'
				});
			},
			toWeChatLogin(){
				uni.clearStorageSync();
				uni.navigateTo({
					url: '/pages/public/login',
				});
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `../../pagesA/product/product?id=${id}`
				});
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url,type) {
				// if (!this.hasLogin) {
				// 	url = '/pages/public/login';
				
				if (type === 'client') {
					uni.switchTab({
						url: url
					});
				}else{
					uni.navigateTo({
						url: url
					});
				}
			},
			upgrade () {
				uni.showModal({
					title: '提示',
					content: '请联系客服',
					showCancel: false,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {},
				});
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
			},
			getUserInfo(e) {
				let _this = this;
				//return false;
				console.log('eeeee',e)
				if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
					_this.$common.errorToShow('未授权');
				} else {
					var data = {
						open_id: _this.open_id,
						iv: e.detail.iv,
						edata: e.detail.encryptedData,
						signature: e.detail.signature
					};
					//有推荐码的话，带上
					var invitecode = _this.$db.get('invitecode');
					if (invitecode) {
						data.invitecode = invitecode;
					}
					_this.toWxLogin(data);
				}
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/client/public/login'
				});
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
	background: #00a79d;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		filter: blur(1px);
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
		width: 130upx;
		height: 130upx;
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
	border-radius: 20upx;
}
.vip-card-box {
	display: flex;
	flex-direction: column;
	color: #f7d680;
	height: 240upx;
	background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 20upx 24upx;
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
	.arc {
		position: absolute;
		left: 0;
		top: -34upx;
		width: 100%;
		height: 36upx;
	}
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
	padding: 28upx 0;
	margin-top: 20upx;
	.order-item {
		@extend %flex-center;
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		font-size: $font-sm;
		color: $font-color-dark;
	}
	.yticon {
		font-size: 48upx;
		margin-bottom: 18upx;
		color: #fa436a;
	}
	.icon-shouhoutuikuan {
		font-size: 44upx;
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
</style>
