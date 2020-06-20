<template>
	<view class="container">
		<p>欢迎页面</p>
	</view>
</template>

<script>
	import mallplusCopyright from '@/components/mall-copyright/mallplusCopyright.vue';
	import Api from '@/common/api';
	import store from '@/store/index';
	export default {
		components: {
			mallplusCopyright
		},
		
		

		onLoad() {
			this.getAgentInfo();
		},

		methods: {
			async getAgentInfo() {
				console.log("is wei xin "+this.$config.isWeiXin)
				this.logining = false;
				let params = {};
				let data = await Api.apiCall('post', Api.agent.userinfo, params, true, false);
				//this.logining = false;
				if (data) {
                   uni.switchTab({
                   	url:"../index/index"
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
