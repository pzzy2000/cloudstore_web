<template>
	<view class="container">
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome">修改密码</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="phone" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<view class="input-item-right">
						<input type="number" maxlength="6" placeholder="请输入验证码" v-model="phoneCode" style="width: 70%;"/>
						<view class="codeText" v-if="coding == false" @click.stop="getCode">获取验证码</view>
						<view class="authTime" v-else>{{ auth_time }}秒</view>
					</view>
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="password" placeholder="请输入新密码" v-model="password" maxlength="16"/>
				</view>
				<view class="input-item">
					<text class="tit">新密码</text>
					<input type="password" placeholder="请再次输入新密码" v-model="passwords" maxlength="16"/>
				</view>
			</view>
			<button class="confirm-btn" @click.stop="editPassword">确认修改</button>
		</view>
		<view class="register-section flex justify-between">
			<view class="text-blue">
				<navigator url="/pages/client/public/reg">马上注册</navigator>
			</view>
			<view class="text-blue">
				<navigator url="/pages/client/public/login">立即登录</navigator>
			</view>
		</view>
		<mallplusCopyright></mallplusCopyright>
	</view>
</template>

<script>
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	export default {
		components: {
			mallplusCopyright
		},
		data() {
			return {
				phone: '',
				phoneRule: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
				phoneCode: '',
				password: '',
				passwords: '',
				phoneKey: '',
				coding: false,
				auth_time: 180
			};
		},
		onLoad() {
		},
		methods: {
			async getCode() { // 号码获取验证码
				if (!this.phoneRule.test(this.phone)) {
					this.$api.msg('请输入正确的手机号码')
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
				};
				let data = await Api.ApiFalseToken ('post', Api.client.reg.sendCode, params, true)
				if (data) {
					console.log(data)
					if (data.code === 0) {
						this.phoneKey = data.result.key
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			async editPassword () {
				if (!this.phone) {
					this.$api.msg('请填写手机号')
					return false;
				}
				if (!this.phoneRule.test(this.phone)) {
					this.$api.msg('手机号码格式不正确')
					return false;
				}
				if (!this.phoneCode) {
					this.$api.msg('请填写手机验证码')
					return false;
				}
				if (!this.password) {
					this.$api.msg('请填写新密码')
					return false;
				}
				var passWordRule = /^(\d+[a-zA-Z]+|[a-zA-Z]+\d+)([0-9a-zA-Z]*)$/
				if (!passWordRule.test(this.password)) {
					this.$api.msg('密码必须为英文字母数字组合')
					this.password = ''
					this.passwords = ''
					return false;
				}
				if (!this.passwords) {
					this.$api.msg('请再次填写新密码')
					return false;
				}
				if (this.password != this.passwords) {
					this.$api.msg('两次密码不一致')
					this.passwords = ''
					return false;
				}
				let params = {
					'bean.phone': this.phone,
					'bean.code': this.phoneCode ,
					'bean.newPassword': this.password,
					'bean.key': this.phoneKey,
					'bean.type': 1
				}
				let data = await Api.ApiFalseToken ('post', Api.client.reg.updatePassword, params, true)
				if (data) {
					if (data.code === 0) {
						this.emptyData()
						uni.showModal({
							title: '提示',
							content: '修改密码成功，是否前往登录界面？',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if (res.confirm) {
									console.log('用户点击确定');
									uni.navigateTo({
										url: '/pages/client/public/login',
									});
								} else if (res.cancel) {
								}
							},
						});
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			emptyData () {
				this.phone = ''
				this.phoneCode = ''
				this.password = ''
				this.passwords = ''
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
		margin-top: 100rpx;
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
		border-radius: 4px;
		margin-top: 35upx;
		border-bottom: 1upx solid #F1F1F1;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
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
			letter-spacing: 4upx;
			width: 35%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #3DABFF;
		}

		.authTime {
			font-size: 28upx;
			width: 25%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fa436a;
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
		border-radius: 36px;
		margin-top: 70upx;
		margin-bottom: 25upx;
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
		font-size: $font-sm + 2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		width: 100%;
		font-size: 24upx;
		color: #3DABFF;
		text-align: center;
		letter-spacing: 4upx;
		padding: 0 60upx;
		text {
			color: #3DABFF;
			margin-left: 10upx;
		}
	}
	.navigator-hover {
		background: none;
		opacity: 1;
	}
</style>
