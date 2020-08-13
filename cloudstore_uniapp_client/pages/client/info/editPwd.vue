<template>
	<view>
		<nav-bar backState="1000">修改密码</nav-bar>
		<view>
			<view class="cu-form-group margin-top">
				<view class="title">手机号码</view>
				<input placeholder="请输入手机号码" name="input" type="text" :value="phone" @input="editInput($event,'phone')"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view>
				<input placeholder="请输入验证码" name="input" type="text" :value="phoneCode" @input="editInput($event,'phoneCode')" maxlength="6"></input>
				<button class='cu-btn bg-blue shadow' v-if="coding == false" @click.stop="getCode">获取验证码</button>
				<button class='cu-btn bg-blue shadow' v-else>{{ auth_time }}秒</button>
			</view>
			<view class="cu-form-group">
				<view class="title">旧密码</view>
				<input placeholder="请输入旧密码" name="input" type="password" :value="oldPassword" @input="editInput($event,'oldPassword')" maxlength="16"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input placeholder="请输入新密码" name="input" type="password" :value="newPassword" @input="editInput($event,'newPassword')" maxlength="16"></input>
			</view>
		</view>
		<view class="flex flex-direction margin-top">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click.stop="editPassword">确定</button>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js'
	export default {
		data() {
			return {
				skeletonShow: true,
				phone: '',
				phoneRule: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
				phoneCode: '',
				oldPassword: '',
				newPassword: '',
				phoneKey: '',
				coding: false,
				auth_time: 180
			}
		},
		components: {
			navBar
		},
		onLoad() {
			this.clientId = uni.getStorageSync('userInfo').id
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
			editInput (e,type) {
				switch (type) {
					case 'phone':
						this.phone = e.detail.value;
					break;
					case 'phoneCode':
						this.phoneCode = e.detail.value;
					break;
					case 'oldPassword':
						this.oldPassword = e.detail.value;
					break;
					case 'newPassword':
						this.newPassword = e.detail.value;
					break;
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
				if (!this.oldPassword) {
					this.$api.msg('请旧新密码')
					return false;
				}
				if (!this.newPassword) {
					this.$api.msg('请填写新密码')
					return false;
				}
				var passWordRule = /^(\d+[a-zA-Z]+|[a-zA-Z]+\d+)([0-9a-zA-Z]*)$/
				if (!passWordRule.test(this.newPassword)) {
					this.$api.msg('新密码必须为英文字母数字组合')
					this.newPassword = ''
					return false;
				}
				let params = {
					'phone': this.phone,
					'code': this.phoneCode ,
					'oldPassword': this.oldPassword,
					'newPassword': this.newPassword,
					'key': this.phoneKey,
					'type': 0,
				}
				let data = await Api.apiCall('post', Api.client.reg.editPassword, params, true)
				if (data) {
					if (data.code === 0) {
						this.emptyData()
						uni.showModal({
							title: '提示',
							content: '修改密码成功，即将前往登录界面',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if (res.confirm) {
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
	}
</script>

<style>

</style>
