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
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getUserInfo" @getuserinfo='getWxInfo' class="vx-btn">
				<image src="/static/temp/share_wechat.png" mode="" class="wxLogin"></image>
			</button>
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
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	import store from '@/store/index';
	export default {
		components: {
			mallplusCopyright
		},
		data() {
			return {
				access: '15773281581',
				password: '123456',
				sysInfo: '',
				logining: false,
				wxloginCode: '', //获取code
				loginInfo: ''
			};
		},
		onLoad() {
			this.sysInfo = this.$db.get('sysInfo');
			//this.vxCheckSession() //判断登录是否过期
			// this.getWxlogin()
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			toRegist() {
				uni.navigateTo({
					url: '/pages/client/public/reg'
				});
			},

			// vxCheckSession () {
			// 	uni.checkSession({
			// 		success() {
			// 			console.log('状态未过期')

			// 		},
			// 		fail() {
			// 			this.getWxInfo()
			// 		}
			// 	})
			// },
			getWxInfo() { //获取code
				var that = this;
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
						uni.setStorageSync('code',loginRes.code)
						var code = loginRes.code
						let params = {
							'bean.logintype': 'client',
							'bean.action': 'weixin',
							'bean.password': code,
							'bean.access': code
						}
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								if (infoRes) {
									uni.setStorageSync('vxInfo', infoRes.rawData)
								}
							}
						});
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
									console.log(data)
									uni.showModal({
										title: '提示',
										content: '您的手机号暂未绑定微信，请前往绑定',
										showCancel: false,
										cancelText: '取消',
										confirmText: '确定',
										success: res => {
											if (res.confirm) {
												uni.navigateTo({
													url: '/pages/client/public/getVxPhone?openId=' + data.msg
												});
											} else if (res.cancel) {
												uni.navigateTo({
													url: '/pages/client/public/getVxPhone?openId=' + data.msg
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
										userType: res.data.result.result.userType
									}
									uni.setStorageSync('userInfo', userInfo)
									uni.setStorageSync('token', res.data.result.result.token)
									uni.switchTab({
										url: '/pages/client/recommend/index'
									});
								} else {
									uni.showToast({
										title: '微信登录失败',
										icon: 'none'
									});
								}
							}
						})
					}
				});

			},

			async toLogin() {
				var that = this;
				// let phoneReg = /^1[1-9][0-9]\d{8}$/;
				try {
					if (this.access == '') {
						throw '请填写手机号/登录账户';
					}
					// if (!phoneReg.test(this.phone)) {
					// 	throw '手机号格式有误';
					// }
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
					this.access = params.access;
					this.$api.msg("登录成功");
					that.login(data);
					// var userInfo = {
					// 	nickName: data.result.name,
					// 	url: data.result.url
					// }
					uni.setStorageSync('userInfo', data.result);
					uni.setStorageSync('token', data.result.token);
					uni.switchTab({
						url: '/pages/client/recommend/index'
					});
				}
			},
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
