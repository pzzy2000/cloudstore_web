<template>
	<view class="container">
		<p>这里是欢迎页面,当前页面要检查用户是否登录</p>
	     <mallplusCopyright> 这里 要 CSS 控制到底部 </mallplusCopyright>
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
		onLoad() {
			this.getAgentInfo();
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			async getAgentInfo() {
				console.log("is wei xin "+this.$config.isWeiXin)
				this.logining = false;
				let params = {};
				let data = await Api.apiCall('post', Api.client.info.searchInfo, params, true, false);
				if (data) {
					let loginuser = data.result;
					uni.setStorageSync('userInfo', loginuser)
					uni.setStorageSync('token', loginuser.token)
                   uni.switchTab({
                   	url:"/pages/client/recommend/index"
                   })
				}
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

</style>
