<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">欢迎</view>
			<view class="welcome">用户注册</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="phone" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="password" @confirm="reg" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<view class="input-item-right">
						<input type="number" maxlength="6" placeholder="请输入验证码" v-model="code" @confirm="toLogin" style="width: 70%;" />
						<view class="codeText" v-if="coding == false" @click="getCode()">获取验证码</view>
						<view class="authTime" v-else>{{ auth_time }}秒</view>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="reguser" :disabled="logining">注册</button>
			<view class="forget-section">
				<text @click="getWxCode">微信注册</text>
			</view>
			<view class="forget-section">已经有账号?<text @click="toLoginPwd">马上登录</text></view>
		</view>
		<uni-popup ref="popup" type="center">
			<button type="primary" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber">微信授权手机号码</button>
		</uni-popup>
		<popup-layer ref="popupRef" :direction="'top'" v-model="boolShow">
			<view class="regBox" >
				<input type="text" :value="vxPhone" class="input-height"/>
				<view class="phone-code">
					<input type="text" :value="phoneCode" placeholder="请输入手机验证码" class="phone-input"/>
					<button type="primary" class="code-btn">发送验证码</button>
				</view>
				<input type="password" :value="userPwd" placeholder="请输入登录密码" class="input-height"/>
				<view class="regBox-btn">
					<button type="primary" @tap="registerBtn">注册</button>
					<button type="primary" @tap="close">关闭</button>
				</view>
			</view>
		</popup-layer>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import Api from '@/common/api';
	import store from '@/store/index';
	import uniPopup from '@/components/uni-popup/uni-popup'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
	import popupLayer from '@/components/uni-popup/popup-layer.vue'
	export default {
		components: {
			uniPopup, uniPopupDialog, popupLayer
		},
		data() {
			return {
				phone: '',
				code: '',
				password: '',
				logining: false,
				coding: false,
				auth_time: 180,
				codekey: '',
				title: '注册',
				//以下为微信注册
				vxOpenId: '',
				vxUserInfo: '',
				vxPhoneInfo: '',
				vxPhone: '',
				vxPhoneKey: '',
				boolShow: false,
				phoneCode: '1234',
				userPwd: '123456'
			};
		},
		onLoad() {
		},
		computed: {
			// ...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			// ...mapMutations(['login']),
			// inputChange(e) {
			// 	const key = e.currentTarget.dataset.key;
			// 	this[key] = e.detail.value;
			// },
			toLoginPwd() {
				uni.navigateTo({
					url: '/pages/client/public/login'
				});
			},
			navBack() {
				uni.switchTab({
					url: '/pages/client/public/login'
				});
			},
			async reguser() {
				var that = this;
				let phoneReg = /^1[1-9][0-9]\d{8}$/;
				try {
					if (this.phone == '') {
						throw '请填写手机号';
					}
					if (!phoneReg.test(this.phone)) {
						throw '手机号格式有误';
					}
					if (this.password == '') {
						throw '请填写密码';
					}
					if (this.code == '') {
						throw '请填写验证码';
					}
				} catch (err) {
					this.$api.msg(err);
					return;
				}
				this.logining = false;
				let params = {
					'bean.phone': this.phone,
					'bean.password': this.password,
					'bean.name': this.phone,
					'bean.access': this.phone,
					'bean.userType': 'Client',
					'code.codeType': 'reg',
					'code.code': this.code,
					'code.key': this.codekey
				};

				let data = await Api.apiCall('post', Api.client.login.reg, params, true, false);
				//this.logining = false;
				if (data) {
					console.log(data);
					this.$api.msg("注册成功");
					setInterval(() => {
						this.toLoginPwd();
					}, 2000);
				}
			},
			// 获取验证码
			async getCode() {
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.phone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号码'
					});
					return false;
				}
				//设置倒计时秒
				this.auth_time = 60;
				this.coding = true;
				var auth_timetimer = setInterval(() => {
					this.auth_time--;
					if (this.auth_time < 0) {
						this.coding = false;
						clearInterval(auth_timetimer);
					}
				}, 1000);
				//获取验证码
				let params = {
					phone: this.phone,
					codeType: 'reg'
				};
				let data = await Api.apiCall('post', Api.index.sendCodes, params);
				if (data) {
					this.codekey = data.key;
				}
			},
			getWxCode () {
				this.$refs.popup.open()
				var that = this;
				uni.showLoading({
					title: '微信注册中',
					mask: true
				});
				this.wxInfo()
				uni.login({
					provider: 'weixin',
					fail: function() {
						uni.hideLoading();
						uni.showToast({
							title: '微信注册失败',
							icon: 'none'
						});
					},
					success: function(loginRes) {
						uni.hideLoading();
						let params = {
							'bean.code': loginRes.code
						}
						uni.request({
							url: Api.BASEURI + Api.client.reg.auth,
							method: 'post',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: params,
							success: function(res) {
								if (res.data.result.code === 0) {
									that.vxOpenId = res.data.result.result.openid
								}
							}
						})
						// console.log(loginRes)
						// that.wxInfo()
						// that.$refs.popup.open()
					},
				})
			},
			wxInfo () {
				var that = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						if (infoRes) {
							that.vxUserInfo =  infoRes
						}
					},
					fail:function(e) {
						uni.showToast({
							title: '微信授权用户失败'
						});
					}
				});
			},
			getPhoneNumber (res) {
				console.log(res)
				if (res.detail.iv === '') {
					uni.showToast({
						title: '授权失败'
					});
				}else{
					this.vxPhoneInfo = res.detail
					this.getPhoneKey()
				}
			},
			getPhoneKey () {
				var that = this;
				let params = {
					'bean.encryptedData': this.vxPhoneInfo.encryptedData,
					'bean.iv': this.vxPhoneInfo.iv,
					'bean.openId': this.vxOpenId,
				}
				uni.request({
					url: Api.BASEURI + Api.client.reg.getPhone,
					method: 'POST',
					data: params,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						this.$refs.popup.close()
						if(res.data.result.code === 0) {
							that.vxPhone = res.data.result.result.phone
							that.vxPhoneKey =  res.data.result.result.codeKey
							this.$refs.popupRef.show()
						}else if(res.data.result.code === 100003) {
							uni.showModal({
								title: '提示',
								content: res.data.result.msg,
								showCancel: false,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/client/public/login'
										});
									} else if (res.cancel) {
									}
								}
							});
						}else{
							uni.showToast({
								title: res.data.result.msg,
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '解密微信手机号码失败'
						});
					}
				});
			},
			vxRegister () { //微信注册最后一步
				var that = this;
				let params = {
					'bean.code': this.phoneCode,
					'bean.codeKey': this.vxPhoneKey,
					'bean.openId': this.vxOpenId,
					'bean.password': this.userPwd,
					'bean.phone': this.vxPhone,
					'bean.userInfo': this.vxUserInfo.rawData
				}
				uni.request({
					url: Api.BASEURI + Api.client.reg.saveClientInfo,
					method: 'POST',
					data: params,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: res => {
						if(res.data.result.code === 0) {
							console.log(res)
							uni.showToast({
								title: '微信注册成功，正在前往登录界面',
								icon: 'none'
							});
							uni.showModal({
								title: '提示',
								content: '微信注册成功，正在前往登录界面',
								showCancel: false,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/client/public/login'
										});
									} else if (res.cancel) {
										this.$refs.popupRef.close() // 关闭
									}
								}
							});
						}else{
							uni.showToast({
								title: res.data.result.msg,
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '微信手机注册失败'
						});
					}
				});
			},
			registerBtn () {
				if(!this.phoneCode){
					this.$api.msg('请填写手机验证码');
					return;
				}
				if(!this.userPwd){
					this.$api.msg('请填写密码');
					return;
				}
				this.vxRegister()
			},
			close () {
				this.$refs.popupRef.close() // 关闭
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
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

	.input-item-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: space-between;
	}

	.codeText {
		font-size: 28upx;
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fa436a;
	}

	.authTime {
		font-size: 28upx;
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fa436a;
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

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
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
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.register-pwd {
		color: #fff;
		background-color: #179B16;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
		font-weight: normal;
		text-align: center;
		border-radius: 5px;
	}
	.regBox {
		width: 85%;
		padding: 30upx 0;
		margin: 0 auto;
		.input-height {
			line-height: 80upx;
			height: 80upx;
			margin-bottom: 20upx;
		}
		.uni-input-wrapper {
			height: 80rpx;
			line-height: 80rpx;
		}
		.phone-code {
			display: flex;
			align-items: center;
			line-height: 80upx;
			height: 80upx;
			margin-bottom: 20upx;
			.phone-input {
				width: 65%;
			}
			.code-btn {
				width: 35%;
				font-size: 25upx;
			}
		}
		.regBox-btn {
			display: flex;
			justify-content: space-between;
			button {
				width: 50%;
			}
		}
	}
</style>
