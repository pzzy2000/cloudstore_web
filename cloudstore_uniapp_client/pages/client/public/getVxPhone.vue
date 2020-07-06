<template>
	<view class="container">
		<view class="wrapper">
			<button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber='getPhoneNumber'>微信授权手机号</button>
		</view>
	</view>
</template>

<script>
	import Api from '@/common/api';
	export default {
		data() {
			return {
				vxCode: '',
				vxOpenid: '',
				vxPhoneData: ''
			}
		},
		onLoad (option) {
			this.vxCode = option.openId
			console.log(this.vxCode)
			// this.getVxLoginCode()
		},
		methods: {
			getPhoneNumber (res) {
				console.log(res)
				var that = this;
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
							console.log(res)
							if (res) {
								if (res.data.result.code === 0) {
									var code = uni.getStorageSync('code')
									let params = {
										'bean.logintype': 'weixin',
										'bean.password': code,
										'bean.access': code
									}
									uni.request({
										url: Api.BASEURI + Api.agent.wxLogin,
										method: 'post',
										header: {
											'content-type': 'application/x-www-form-urlencoded'
										},
										data: params,
										success: function(res) {
											if (res) {
												var userInfo = {
													name: res.data.result.result.name,
													url: res.data.result.result.url
												}
												uni.setStorageSync('userInfo',userInfo)
												uni.setStorageSync('token',res.data.result.result.token)
												uni.switchTab({
													url: '/pages/index/index'
												});
											}
											//console.log(res)
										}
									})
								}else{
									uni.showToast({
									    title: res.data.result.msg,
									    duration: 2000,
										icon:'none'
									});
								}
								// var userInfo = {
								// 	name: res.data.result.result.name,
								// 	url: res.data.result.result.url
								// }
								// uni.setStorageSync('userInfo',userInfo)
								// uni.setStorageSync('token',res.data.result.result.token)
								// uni.switchTab({
								// 	url: '/pages/index/index'
								// });
							}else {
								uni.showToast({
								    title: '登录失败，请稍后重试',
								    duration: 2000
								});
							}
						}
					})
				}
				// let params = {
				// 	authResult: 0,
				// 	encryptedData: res.detail.encryptedData,
				// 	iv: res.detail.iv,
				// 	userType: 'agent',
				// 	openId: that.vxOpenid
				// }
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
