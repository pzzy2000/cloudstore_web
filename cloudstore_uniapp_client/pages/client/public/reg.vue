<template>
	<view class="container">
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
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
						<view class="codeText" v-if="coding == false" @click.stop="getCode">获取验证码</view>
						<view class="authTime" v-else>{{ auth_time }}秒</view>
					</view>
				</view>
				<!-- <view class="read-privacy">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox value="" checked="checked" />登录前请阅读
						</label>
						<text @click.stop="toPrivacy" class="text-blue">丫咪购隐私协议</text>
					</checkbox-group>
				</view> -->
				<view class="read-privacy">
					<checkbox-group class="block" @change="CheckboxChange" style="display: flex;align-items: center;">
							<checkbox style="transform:scale(0.5)" class='round blue checked' :class="checkbox[1].checked?'checked':''" :checked="checkbox[1].checked?true:false" value="B"></checkbox>
						登录前请阅读
						<text @click.stop="toPrivacy('/pages/client/info/privacy')" class="text-blue">丫咪购隐私协议</text>
						<text @click.stop="toPrivacy('/pages/client/info/agreement')" class="text-blue">,丫咪购服务私协议</text>
					</checkbox-group>
				</view>
			</view>
			<button class="confirm-btn" @click="reguser" :disabled="logining">注册</button>
			<!-- <view class="forget-section">
				<button class='vxUserInfo-btn' open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">
					微信注册
				</button>
			</view> -->
			<view class="forget-section text-blue" @click="toLoginPwd">已经有账号?<text class="forget-section-login text-blue">马上登录</text></view>
		</view>
		<uni-popup ref="popup" type="center">
			<button type="primary" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber">微信授权手机号码</button>
		</uni-popup>
		<popup-layer ref="popupRef" :direction="'top'" v-model="boolShow">
			<view class="regBox" >
				<view class="cu-form-group">
					<view class="title">手机号码</view>
					<input placeholder="自动获取手机号" name="input" :value="vxPhone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input placeholder="请输入手机验证码" name="input" :value="phoneCode" @input="editInput($event,'code')"></input>
					<button class='cu-btn bg-green text-blue shadow' v-if="registerCoding == false" @click.stop="getRegisterCode">发送验证码</button>
					<button class='cu-btn bg-green text-blue shadow' v-else>{{ auth_register_time }}秒</button>
				</view>
				<view class="cu-form-group pwd">
					<view class="title">密码</view>
					<input placeholder="请输入登录密码" name="input" :value="userPwd" @input="editInput($event,'pwd')"></input>
				</view>
				<!-- <input type="text" :value="vxPhone" class="input-height"/>
				<view class="phone-code">
					手机号：<input type="text" :value="phoneCode" placeholder="请输入手机验证码" class="phone-input" @input="editInput($event,'code')"/>
					验证码：<view class="cu-btn round bg-green code-btn" v-if="registerCoding == false" @click.stop="getRegisterCode">发送验证码</view>
					<view type="primary" class="code-btn" v-else>{{ auth_register_time }}秒</view>
				</view>
				密码：<input type="password" :value="userPwd" placeholder="请输入登录密码" class="input-height pwd" @input="editInput($event,'pwd')"/> -->
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
				checkbox: [{
					value: 'A',
					checked: true
				}, {
					value: 'B',
					checked: false
				}],
				isCheckbox: false,
				phone: '',
				code: '',
				password: '',
				logining: false,
				coding: false,
				registerCoding: false,
				auth_time: 180,
				auth_register_time: 180,
				codekey: '',
				title: '注册',
				//以下为微信注册
				vxOpenId: '',
				vxUserInfo: '',
				vxPhoneInfo: '',
				vxPhone: '',
				vxPhoneKey: '',
				boolShow: false,
				phoneCode: '',
				userPwd: ''
			};
		},
		onLoad() {
		},
		computed: {
		},
		methods: {
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
			async reguser() { //用户账号密码注册
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
					if (!this.isCheckbox) {
						throw '请先阅读同意隐私协议';
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
					if (data.code === 0) {
						uni.showModal({
							title: '提示',
							content: '注册成功',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								this.toLoginPwd();
							},
						});
					} else {
						this.$api.msg(data.msg);
					}
				}
			},
			getCode() { // 号码获取验证码
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
					// codeType: 'reg'
				};
				var that = this
				uni.request({
					url: Api.BASEURI + Api.client.reg.sendCode,
					method: 'post',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res) {
							var data = res.data.result
							if (data.code === 0) {
								that.codekey = data.result.key
							} else {
								that.$api.msg(data.msg)
							}
						} else {
							that.$api.msg('发送验证码失败')
						}
					}
				});
			},
			getRegisterCode () { // 微信号码获取验证码
				var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.vxPhone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号码'
					});
					return false;
				}
				//设置倒计时秒
				this.auth_register_time = 60;
				this.registerCoding = true;
				var auth_timetimer = setInterval(() => {
					this.auth_register_time--;
					if (this.auth_register_time < 0) {
						this.registerCoding = false;
						clearInterval(auth_timetimer);
					}
				}, 1000);
				//获取验证码
				let params = {
					phone: this.vxPhone,
					// codeType: 'reg'
				};
				var that = this
				uni.request({
					url: Api.BASEURI + Api.client.reg.sendCode,
					method: 'post',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						if (res) {
							console.log(res)
							var data = res.data.result
							if (data.code === 0) {
								console.log(data.result.key)
								that.vxPhoneKey = data.result.key
								console.log(that.vxPhoneKey)
							} else {
								that.$api.msg(data.msg)
							}
						} else {
							that.$api.msg('发送验证码失败')
						}
					}
				});
			},
			getuserinfo () { //微信授权获取手机号
				this.$refs.popup.open()
				var that = this;
				uni.showLoading({
					title: '微信注册中',
					mask: true
				});
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						console.log(infoRes)
						if (infoRes) {
							that.vxUserInfo =  infoRes
						}
					},
					fail:function(e) {
						uni.showToast({
							title: '微信授权用户信息失败，请用手机号码登录',
							icon: 'none'
						});
					}
				});
				// this.wxInfo()
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
					}
				})
			},
			wxInfo () { //获取微信用户信息
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
							title: '微信授权用户信息失败，请用手机号码登录',
							icon: 'none'
						});
					}
				});
			},
			getPhoneNumber (res) { //点击按钮获取用户的手机号码
				if (res.detail.errMsg === 'getPhoneNumber:ok') {
					this.vxPhoneInfo = res.detail
					this.getPhoneKey()
				}else{
					uni.showToast({
						title: '授权手机号失败',
						icon: 'none'
					});
					this.$refs.popup.close()
				}
			},
			getPhoneKey () { //将手机加密数据传给后台，后台返回解密后的电话号码和key
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
							title: '解密微信手机号码失败',
							icon:'none'
						});
					}
				});
			},
			editInput (e,type) { //编辑验证码和密码框
				if (type === 'code') {
					this.phoneCode = e.detail.value
				} else {
					this.userPwd = e.detail.value
				}
			},
			vxRegister () { //微信注册最后一步
				var that = this;
				let params = {
					'bean.code': this.phoneCode,
					'bean.codeKey': this.vxPhoneKey,
					'bean.openId': this.vxOpenId,
					'bean.password': this.userPwd,
					'bean.phone': this.vxPhone,
					'bean.userInfo': this.vxUserInfo.rawData,
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
							this.$refs.popupRef.close() // 关闭
							uni.showModal({
								title: '提示',
								content: '微信注册成功，前往登录界面',
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
			registerBtn () { //注册按钮绑定的事件
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
			},
			CheckboxChange (e) {
				var data = e.detail
				if (data.value[0] === 'B') {
					this.isCheckbox = true
				} else {
					this.isCheckbox = false
				}
			},
			toPrivacy (url) {
				uni.navigateTo({
					url: url,
				});
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
		font-size: 34upx;
		width: 35%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3DABFF;
		letter-spacing: 4upx;
	}

	.authTime {
		font-size: 34upx;
		width: 35%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3DABFF;
		letter-spacing: 4upx;
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
		top: -40upx;
		font-size: 52upx;
		letter-spacing: 4upx;
		color: #333333;
		font-weight: blod;
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
		height: 120upx;
		border-radius: 4px;
		margin-top: 35upx;
		border-bottom: 1upx solid #F1F1F1;
		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			letter-spacing: 4upx;
			font-size: 28upx;
			color: #333;
			font-weight: blod;
		}

		input {
			height: 65upx;
			font-size: 34upx;
			color: #999999;
			width: 100%;
			letter-spacing: 4upx;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 72upx;
		line-height: 76upx;
		border-radius: 36px;
		margin-top: 70upx;
		background: linear-gradient(-90deg, #39A9FF, #6BBFFF);
		color: #fff;
		font-size: 36upx;
		font-weight: blod;
		letter-spacing: 4upx;
		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: 24upx;
		letter-spacing: 4upx;
		color: #999999;
		text-align: right;
		margin-top: 40upx;
		padding: 0 60upx;
		.vxUserInfo-btn {
			background: #fff;
			border: none;
			color: #fa436a;
			font-size: 28rpx;
			&:after {
				border:none
			}
		}
	}

	.register-section {
		
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: 24upx;;
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
		width: 100%;
		padding: 30upx 0;
		margin: 0 auto;
		.input-height {
			line-height: 80upx;
			height: 80upx;
			margin-bottom: 20upx;
		}
		.uni-input-wrapper {
			height: 80upx;
			line-height: 80upx;
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
				width: 30%;
				font-size: 25upx;
				line-height: 70upx;
				height: 70upx;
			}
		}
		.pwd {
			margin-bottom: 60upx;
		}
		.regBox-btn {
			display: flex;
			justify-content: space-between;
			button {
				width: 40%;
			}
		}
	}
	.read-privacy {
		display: flex;
		align-items: center;
		margin-top: 20upx;
		font-size: 24upx;
		color: #999;
		letter-spacing: 4upx;
	}
	.checked {
		:before {
			color: #ffff00 !important;
		}
	}
</style>