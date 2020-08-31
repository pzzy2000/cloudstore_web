<template>
	<view class="container">
		<!-- <view class="left-bottom-sign"></view> -->
		<!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="welcome">用户登录</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="access" placeholder="请输入手机号码/登录账号" />
				</view>
				<view class="input-item pwd-input">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="password" @confirm="toLogin" />
					<text class="forget-section" @click.stop="toForget">忘记密码？</text>
				</view>
			</view>
			<button class="confirm-btn" @click.stop="toLogin" :disabled="logining">登录</button>
			<view class="register-section">
				还没有账号?<text @click="toRegist">马上注册</text>
			</view>
			<!-- #ifdef APP-PLUS -->
				<view class="vx-btn">
					<image src="/static/temp/share_wechat.png" mode="" class="wxLogin" @click.stop="appLogin"></image>
				</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
				<!-- 微信授权信息 -->
				<!-- <view class="vx-btn">
					<button open-type="getUserInfo" @getuserinfo='getWxInfo'  withCredentials="true">
						<image src="/static/temp/share_wechat.png" mode="" class="wxLogin"></image>
					</button>
				</view> -->
				<!-- 微信授权手机号 -->
				<view class="vx-btn">
					<button open-type='getPhoneNumber' @getphonenumber="getPhoneNumber">
						<image src="/static/share_wechat.png" mode="" class="wxLogin"></image>
					</button>
				</view>
			<!-- #endif -->
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
				access: '',
				password: '',
				sysInfo: '',
				logining: false,
				wxloginCode: '', //获取code
				loginInfo: '',
				goodsInfo: '',
				agentId: '',
				goodsId: "",
				activityId: '',
				activityGoodsId: '',
				agentGoodsId: "",
				shareClientId: "",
				userType: 'Client',
				checked: true,
				vxPhoneInfo: '',
				openId: '',
				sessionKey: '',
				phoneDetail: '',
				actionType: ''
			};
		},
		onLoad() {
			// this.sysInfo = this.$db.get('sysInfo');
			this.goodsInfo =  uni.getStorageSync('goodsInfo')
			this.actionType = this.goodsInfo.actionType
			this.activityGoodsId = this.goodsInfo.agentGoodsId
			this.agentId = this.goodsInfo.agentId
			this.goodsId = this.goodsInfo.goodsId
			this.activityId = this.goodsInfo.activityId
			this.agentGoodsId = this.goodsInfo.agentGoodsId
			this.shareClientId = this.goodsInfo.shareClientId
		},
		onShow() {
			this.getVxOpenId()
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
						// uni.getUserInfo({
						// 	provider: 'weixin',
						// 	success: function(infoRes) {
						// 		if (infoRes) {
						// 			uni.setStorageSync('vxInfo', infoRes.rawData)
						// 		}
						// 	}
						// });
						// that.vxLogin(loginRes)
					}
				});
			},
			async vxLogin () {
				var that = this
				let params = {
					'bean.logintype': 'client',
					'bean.action': 'weixin',
					'bean.password': this.openId,
					'bean.access': this.openId
				} 
				uni.request({
					url: Api.BASEURI + Api.agent.user.wxLogin,
					method: 'post',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: res => {
						var data = res.data
						if(data.result.code === 0) {
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							});
							var userInfo = {
								id: data.result.result.id,
								name: data.result.result.name,
								url: data.result.result.url,
								phone: data.result.result.phone,
								agent: data.result.result.agent,
								userType: data.result.result.userType,
								relationId: data.result.result.relationId,
								wxPic: data.result.result.wxPic
							}
							uni.setStorageSync('userInfo', userInfo)
							uni.setStorageSync('token', data.result.result.token)
							that.toPages() //判断跳到首页还是商品详情页
						} else if (data.result.code === 100006){
							// that.openId = data.result.msg
							that.vxRegister()
						} else {
							that.$api.msg(data.result.msg)
						}
					}
				});
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
					if(!this.checked) {
						throw '请先阅读同意隐私协议';
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
								url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
							});
						} else {
							uni.switchTab({
								url: '/pages/agent/goods/hotsale/hotsale'
							});
						}
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			toPages () {
				if (this.actionType === 'belowTheLine') {
					uni.navigateTo({
						url: '/pages/client/belowTheLine/goods?activityGoodsId='+this.activityGoodsId
					});
				} else {
					if (this.goodsId) {
						uni.navigateTo({
							url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
						});
					} else {
						uni.switchTab({
							url: '/pages/agent/goods/hotsale/hotsale'
						});
					}
				}
			},
			toForget () { //忘记密码
				uni.navigateTo({
					url: '/pages/client/public/forgetPwd',
				});
			},
			toPrivacy () { //协议
				uni.navigateTo({
					url: '/pages/client/info/privacy',
				});
			},
			getVxOpenId (res) {
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				var that = this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
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
							success: res => {
								uni.hideLoading()
								that.openId = res.data.result.result.openid
								that.sessionKey = res.data.result.result.session_key
							}
						});
					},
					fail: function() {
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
					},
				})
			},
			getPhoneNumber (res) { //获取微信手机加密信息
				var that = this
				if (res.detail.errMsg === 'getPhoneNumber:ok') {
					this.vxPhoneInfo = res.detail
					this.vxLogin()
				}else{
					uni.showModal({
						title: '提示',
						content: '微授权手机号码失败,您也可以使用账户密码登录',
						showCancel: false,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							// uni.navigateTo({
							// 	url: '/pages/client/public/reg',
							// });
						},
					});
				}
			},
			async vxRegister () {
				let params = {
					'encryptedData': this.vxPhoneInfo.encryptedData,
					'openId': this.openId,
					'iv': this.vxPhoneInfo.iv,
					'session_key': this.sessionKey
					// 'userInfo': ""
				}
				let data = await Api.apiCall('post', Api.agent.user.savePhone, params ,true)
				if (data) {
					if (data.code === 0) {
						this.vxLogin()
					} else {
						this.$api.msg(data.msg)
					}
				}
			},
			getOpenId() {
				
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
		margin-top: 150rpx;
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
	.pwd-input {
		position: relative;
		.forget-section {
			position: absolute;
			right: 0;
			bottom: 10upx;
			color: #3DABFF;
			font-size: 34upx;
			letter-spacing: 4upx;
			z-index: 10;
		}
	}
	.vx-btn {
		background: #fff;
		display: flex;
		justify-content: space-around;
		height: 90upx;
		button{
			height: 100%;
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
		height: 86upx;
		width: 86upx;
		display: block;
		margin: 0 auto;
	}

	.confirm-btn {
		width: 630upx;
		height: 72upx;
		line-height: 72upx;
		border-radius: 36px;
		margin-top: 70upx;
		margin-bottom: 35upx;
		background: linear-gradient(-90deg, #39A9FF, #6BBFFF);
		color: #fff;
		font-size: 36upx;
		font-weight: blod;
		letter-spacing: 4upx;

		&:after {
			border-radius: 100px;
			border: none;
		}
	}

	.register-section {
		width: 100%;
		font-size: 24upx;
		letter-spacing: 4upx;
		color: #999;
		text-align: right;
		padding: 0 60upx;
		margin-bottom: 65upx;
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
