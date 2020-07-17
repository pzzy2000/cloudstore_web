<template>
	<view class="container">
		<p class='welcome'>欢迎光临</p>
	     <mallplusCopyright></mallplusCopyright>
	</view>
	
</template>

<script>
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	import {
		mapMutations,
		mapState
	} from 'vuex';
	export default {
		components: {
			mallplusCopyright
		},
		data() {
			return {
				goodsId: "",
				agentGoodsId: "",
				shareClientId: "",
				userType: 'Client'
			}
		},
		onShow() {
			this.getAgentInfo();
		},
		onLoad(ops) {
			// this.getAgentInfo();
			this.goodsId = ops.goodsId
			this.agentGoodsId = ops.agentGoodsId
			this.shareClientId = ops.shareClientId
			uni.setStorageSync('goodsInfo', ops)
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			async getAgentInfo() {
				this.logining = false;
				let params = {};
				let data = await Api.apiCall('post', Api.client.info.searchInfo, params, true, false);
				if (data) {
					let loginuser = data.result;
					uni.setStorageSync('userInfo', loginuser)
					uni.setStorageSync('token', loginuser.token)
					if (this.goodsId) {
						uni.navigateTo({
							url: '/pages/client/goods/detail?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
						});
					} else {
						uni.switchTab({
							url:'/pages/client/recommend/index'
						})
					}
				}
				console.log(data)
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
		.welcome {
			text-align: center;
		}
	}
	
</style>
