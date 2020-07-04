import Vue from 'vue'
import store from './store'
import App from './App'
//import * as otherApi from './config/api.js'


import * as Common from './config/common.js'
import * as Db from './config/db.js'
import * as Config from './config/config.js'

/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
    // #ifdef H5
    return prePage;
    // #endif

	return prePage.$vm;
}
 
import tabBar from "@/pages/tabbar/tabBar.vue"
Vue.component('tabbar', tabBar)

let isWeiXin = Common.isWeiXinBrowser();
// Vue.prototype.$otherApi = otherApi;
Vue.prototype.$common = Common;
Vue.prototype.$db = Db;
Vue.prototype.$config = Config;
Vue.prototype.$config.isWeiXin= isWeiXin;
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg , prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
