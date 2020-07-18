<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">{{ sysInfo.name }}LOGIN</view>
			<view class="welcome">用户登录</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="access" placeholder="请输入手机号码/登录账号" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="password" @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click.stop="toLogin" :disabled="logining">登录</button>
			<!-- #ifdef MP-WEIXIN -->
			<view class="vx-btn">
				<button open-type="getUserInfo" @getuserinfo='getWxInfo'>
					<image src="/static/temp/share_wechat.png" mode="" class="wxLogin"></image>
				</button>
			</view>
			<!-- #endif -->
			<view class="forget-section" @click="toForget">忘记密码?</view>
		</view>
		<view class="register-section">
			还没有账号?<text @click="toRegist">马上注册</text>
		</view>
		<mallplusCopyright></mallplusCopyright>
	</view>
</template>

<script>
	// import {
	// 	mapMutations,
	// 	mapState
	// } from 'vuex';
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	// import store from '@/store/index';
	export default {
		components: {
			mallplusCopyright
		},
		data() {
			return {
				access: '',
				password: '123456',
				sysInfo: '',
				logining: false,
				wxloginCode: '', //获取code
				loginInfo: '',
				goodsInfo: '',
				goodsId: "",
				agentGoodsId: "",
				shareClientId: "",
				userType: 'Client'
			};
		},
		onLoad() {
			// this.sysInfo = this.$db.get('sysInfo');
			this.goodsInfo =  uni.getStorageSync('goodsInfo')
			this.goodsId = this.goodsInfo.goodsId
			this.agentGoodsId = this.goodsInfo.agentGoodsId
			this.shareClientId = this.goodsInfo.shareClientId
		},
		computed: {
			// ...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			// ...mapMutations(['login']),
			toRegist() { //前去注册界面
				uni.navigateTo({
					url: '/pages/client/public/reg'
				});
			},
			getWxInfo() { //获取code登录并且判断是否已经绑定手机号码
				var that = this
				uni.showLoading({
					title: '微信登录中',
					mask: true
				});
				uni.login({
					provider: 'weixin',
					fail: function() {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
					},
					success: function(loginRes) {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								if (infoRes) {
									uni.setStorageSync('vxInfo', infoRes.rawData)
								}
							}
						});
						that.vxLogin(loginRes)
					}
				});
			},
			vxLogin (loginRes) {
				var that = this
				// uni.setStorageSync('code',loginRes.code)
				var code = loginRes.code
				let params = {
					'bean.logintype': 'client',
					'bean.action': 'weixin',
					'bean.password': code,
					'bean.access': code
				}
				uni.request({
					url: Api.BASEURI + Api.agent.user.wxLogin,
					method: 'post',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: params,
					fail: function() {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
					},
					success: function(res) {
						uni.hideLoading();
						if (res.data.result.code === 100006) {
							var data = res.data.result
							// uni.showModal({
							// 	title: '提示',
							// 	content: '您的微信号暂未注册，请前往注册',
							// 	showCancel: false,
							// 	cancelText: '取消',
							// 	confirmText: '确定',
							// 	success: res => {
							// 		if (res.confirm) {
							// 			uni.navigateTo({
							// 				url: '/pages/client/public/reg'
							// 			});
							// 		} else if (res.cancel) {
							// 			uni.navigateTo({
							// 				url: '/pages/client/public/reg'
							// 			});
							// 		}
							// 	}
							// });
							uni.showModal({
								title: '提示',
								content: '您的微信暂未绑定手机号，请前往绑定。若没有使用手机号注册过请前往注册。',
								showCancel: true,
								cancelText: '注册',
								confirmText: '绑定',
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/client/public/getVxPhone?openId=' + data.msg
										});
									} else if (res.cancel) {
										uni.navigateTo({
											url: '/pages/client/public/reg'
										});
									}
								}
							});
						} else if (res.data.result.code === 0) {
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							});
							var userInfo = {
								name: res.data.result.result.name,
								url: res.data.result.result.url,
								userType: res.data.result.result.userType,
								relationId: res.data.result.result.relationId
							}
							uni.setStorageSync('userInfo', userInfo)
							uni.setStorageSync('token', res.data.result.result.token)
							that.toPages()
						} else {
							uni.showToast({
								title: res.data.result.msg,
								icon: 'none'
							});
						}
					}
				})
			},
			async toLogin() { //账号密码登录
				var that = this;
				try {
					if (this.access == '') {
						throw '请填写手机号/登录账户';
					}
					if (this.password == '') {
						throw '请填写密码';
					}
				} catch (err) {
					this.$api.msg(err);
					return;
				}
				this.logining = false;
				let params = {
					'access': this.access,
					'password': this.password,
					'logintype': 'client',
					'action': 'password'
				};
				let data = await Api.apiCall('post', Api.client.login.login, params,true);
				if (data) {
					if (data.code === 0) {
						uni.setStorageSync('userInfo', data.result);
						uni.setStorageSync('token', data.result.token);
						if (this.goodsId) {
							uni.navigateTo({
								url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
							});
						} else {
							uni.switchTab({
								url: '/pages/client/recommend/index'
							});
						}
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			toPages () {
				if (this.goodsId) {
					uni.navigateTo({
						url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
					});
				} else {
					uni.switchTab({
						url: '/pages/client/recommend/index'
					});
				}
			},
			toForget () { //修改密码
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		padding-top: 65px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.vx-btn {
		background: #fff;
		display: flex;
		justify-content: space-around;
		button{
			background: #fff;
			&:after {
				border: none;
			}
		}
		&:after {
			border-radius: 100px;
			border: none;
		}
	}

	.wxLogin {
		height: 80upx;
		width: 80upx;
		display: block;
		margin: 0 auto;
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		margin-bottom: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm + 2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 100upx;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
