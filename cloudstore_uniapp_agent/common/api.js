import store from '../store/index';
export default {
	// qq 237524947 wx15d4269d3210863d
	//BASEURI: 'http://localhost:8083/api/',
	// BASEURI: 'http://51wangshi.com:8083/api/',
	BASEURI: 'http://120.24.156.254:18888/platform/',

	// ADMINURI: 'http://51wangshi.com:8085/',
	// ESURI: 'http://192.168.1.169:8081/',
	h5Appid: 'wxb4660f37187c0b8e', // h5微信登录的appId  暂时测试用
	source: 1, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
	es: {
		simpleSearchList: 'esProduct/search/simple', //简单搜索
		search: 'esProduct/search', //综合搜索、筛选、排序
	},
	/**
	 * 接口名称
	 */
	 
	agent:{
	   userinfo:"/agent/get",//获取用户信息	
	   userlogin:"sys/manager/platform/login",
	   reg:"sys/manager/platform/register/agent"
	},
	
	/**
	 * 封装请求（async await 封装uni.request） 对应portal 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 * isSwitch     是否转换
	 */
	async apiCall(method, endpoint, data, load, isSwitch) {
		if (typeof(isSwitch) == 'undefined') {
			isSwitch = true;
		}
		if (load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let token = uni.getStorageSync('token') || null;
		if (token == null && (endpoint != this.agent.reg  &&  endpoint != this.agent.userlogin) ) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
				url: `/pages/public/login`
			})
		}
		let formData = {}
		if (isSwitch) {
			for (let key in data) {
				let key_ = key;
				if (key_ == 'pageNum' || key_ === 'pageSize') {
					key_ = 'commSearchBean.' + key_;
				} else if (key_ == 'optType') {
					key_ = key_;
				} else {
					key_ = 'bean.' + key_;
				}
				if (data[key] != null) {
					formData[key_] = data[key];
				}
			}
		} else {
			formData = data;
		}

		// let fullurl = this.BASEURI + endpoint;
		// var contentType = 'application/x-www-form-urlencoded';
		//console.log(endpoint);
		let [error, res] = await uni.request({
			url: (this.BASEURI + endpoint),
			data: formData,
			method: method,
			header: {
				//'Content-Type': 'application/x-www-form-urlencoded',
				'content-type': 'application/x-www-form-urlencoded',
				auth: token
			},
		});
		if (load) {
			uni.hideLoading();
		}

		// if(res.statusCode==200  || res.statusCode ==201){
		// 	uni.showToast({
		// 		title: '请求错误'+'['+res.errMsg+']',
		// 		icon: 'none'
		// 	});
		// }

		if (undefined == res || 'undefined' == res) {
			console.log('index');
			uni.showToast({
				title: '系统请求错误',
				icon: 'none'
			});
		} else {
			let result = res.data.result;
			if (result.code < 0) {
				uni.showToast({
					title: '[' + result.msg+']',
					icon: 'none'
				});
				 let timer = setTimeout(()=>{
					 console.log(">>>>>>>>>>>>>>>>  lob")
					 clearTimeout(timer);
					 uni.navigateTo({
					 	url: `/pages/public/login`
					 })
				 }, 2000);
			} else
			if (result.code > 0) {
				uni.showToast({
					title: '[' + result.msg+']',
					icon: 'none'
				});
			} else {
				return result;
			}

		}

	},
	
	/**
	 * 封装请求（async await 封装uni.request）  对应search 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiEsCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let fullurl = this.ESURI + endpoint;
		//let fullurl = 'http://localhost:8085/api/' + endpoint;
		let Authorization = `${store.state.userInfo.tokenHead}${store.state.userInfo.token}`;
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				// 'content-type': 'application/json',
				'Authorization': Authorization || ''
			},
		});
		console.log(error);
		if (!load) {
			uni.hideLoading();
		}
		return res;

	},
}
