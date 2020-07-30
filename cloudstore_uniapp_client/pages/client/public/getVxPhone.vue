<template>
	<view class="container">
		<nav-bar backState="1000">手机号授权</nav-bar>
		<view class="wrapper">
			<button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber='getPhoneNumber'>微信授权手机号</button>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				vxCode: '',
				vxOpenid: '',
				vxPhoneData: '',
				loginCode: ''
			}
		},
		components:{
			navBar
		},
		onLoad (option) {
			// this.getVxLoginCode()
			this.vxCode = option.openId
		},
		methods: {
			getPhoneNumber (res) {
				var that = this
				if (!res.detail.iv) {
					console.log('您取消了微信授权')
				}else {
					let params = {
						'bean.encryptedData': res.detail.encryptedData,
						'bean.openId': this.vxCode,
						'bean.iv': res.detail.iv,
						'bean.userInfo': uni.getStorageSync('vxInfo')
					}
					uni.request({
						url: Api.BASEURI + Api.agent.user.savePhone,
						method: 'post',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: params,
						success: function(res) {
							if (res) {
								if (res.data.result.code === 0) {
									uni.showToast({
									    title: '绑定成功',
									    duration: 2000,
										icon:'none'
									});
									that.wxLogin() //绑定成功后调用微信登录
								}else if (res.data.result.code === 100007){
									uni.showModal({
										title: '提示',
										content: '暂未发现与您微信绑定的手机号，请前往注册',
										showCancel: false,
										cancelText: '取消',
										confirmText: '确定',
										success: res => {
											uni.navigateTo({
												url: '/pages/client/public/reg',
											});
										},
									});
								}else{
									uni.showToast({
									    title: res.data.result.msg,
									    duration: 2000,
										icon:'none'
									});
								}
							}else {
								uni.showToast({
								    title: '登录失败，请稍后重试',
								    duration: 2000
								});
							}
						}
					})
				}
			},
			wxLogin () {
				var that = this;
				uni.showLoading({
					title: '正在登录',
					mask: false
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
						let params = {
							'bean.logintype': 'client',
							'bean.action': 'weixin',
							'bean.password': loginRes.code,
							'bean.access': loginRes.code
						}
						uni.request({
							url: Api.BASEURI + Api.agent.user.wxLogin,
							method: 'post',
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: params,
							success: function(res) {
								uni.hideLoading()
								if (res.data.result.code === 0 ) {
									var userInfo = {
										name: res.data.result.result.name,
										url: res.data.result.result.url,
										userType: res.data.result.userType,
										agent: res.data.result.agent,
										relationId: res.data.result.relationId,
										wxPic: res.data.result.result.wxPic
									}
									uni.setStorageSync('userInfo',userInfo)
									uni.setStorageSync('token',res.data.result.result.token)
									uni.showToast({
									    title: '登录成功',
									    duration: 2000,
										icon:'none'
									});
									uni.switchTab({
										url: '/pages/agent/goods/hotsale/hotsale'
									});
								} else {
									uni.showToast({
									    title: res.data.result.msg,
									    duration: 2000,
										icon:'none'
									});
								}
							}
						})
					},
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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

</style>
