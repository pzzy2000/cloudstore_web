<template>
	<view>
		<nav-bar backState="1000">个人资料</nav-bar>
		<view class="cu-card dynamic" v-if="isLoading">
				<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar lg round">
									<image :src="imgUrl" mode="" class="img-avatar"></image>
								</view>
								<view class="content flex-sub">
									<view class="tui-skeleton-rect">用户名:{{name}}</view>
									<view class="text-gray text-sm flex justify-between">
										手机号:{{phone}}
									</view>
								</view>
							</view>
						</view>
						<view class="text-content">
							<text class="tui-skeleton-rect">
								用户类型： {{type}}
							</text>
						</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js'
	import tuiSkeleton from '@/components/tui-skeleton/tui-skeleton.vue'
	export default {
		data() {
			return {
				isLoading: false,
				skeletonShow: true,
				name: '',
				phone: '',
				type: '',
				imgUrl: '',
				detailUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593358672989&di=a7c323de2bac0269ead9e7ab0531ba13&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F9662a766b2e14418b22ed6e8185913c3e7562ab455df-j8mU0R_fw658'
			}
		},
		components: {
			navBar, tuiSkeleton
		},
		onLoad () {
			var that = this
			var timer = setTimeout(function(){
				that.getClientInfo(timer)
			}, 1000)
		},
		methods: {
			async getClientInfo (timer) {
				clearInterval(timer)
				let params = {}
				let data = await Api.apiCall('post', Api.client.info.searchInfo, params, true)
				if (data) {
					console.log(data)
					if (data.code === 0) {
						this.name = data.result.name;
						this.phone = data.result.phone;
						this.type = data.result.agent
						if (this.type === 'agent') {
							this.type = '分销团长'
						} else if (this.type === 'leader'){
							this.type = '团长'
						} else {
							this.type = '普通会员'
						}
						this.imgUrl = data.result.wxPic || this.detailUrl
					} else {
						this.$api.msg(data.msg)
					}
					this.isLoading = true
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.cu-avatar {
		display: flex;
		margin: 40upx 0;
		display: block;
		margin: 0 auto;
		.img-avatar {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.cu-card.dynamic>.cu-item>.text-content {
		margin-top: 40upx;
	}
</style>
