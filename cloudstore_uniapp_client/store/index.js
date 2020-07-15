import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo:'',
		name:'helloVueX',
		goodsInfo: ''
	},
	mutations: {
		
		login(state, provider) {
			if (provider && provider!=undefined){
                state.hasLogin = true;
				uni.setStorage({//缓存用户登陆状态
					key: 'userInfo',
					data: provider.userInfo
				})
				state.userInfo = provider;
			}
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = '';
			uni.removeStorage({
                key: 'userInfo'
            })
		},
		goods(state,provider) {
			state.goodsInfo = provide
		}
	},
	actions: {

	}
})

export default store
