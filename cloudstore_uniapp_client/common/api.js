import store from '../store/index';
export default {
	BASEURI: 'http://120.24.156.254:18888/platform/',
	h5Appid: 'wxb4660f37187c0b8e', // h5微信登录的appId  暂时测试用
	source: 1, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
	es: {
		simpleSearchList: 'esProduct/search/simple', //简单搜索
		search: 'esProduct/search', //综合搜索、筛选、排序
	},
	
	client:{
		login:{
		 login:"sys/manager/platform/login"	,
		 reg:"sys/manager/platform/register/client",
		 logout:"sys/manager/platform/loginout"
		},
		info:{
		searchInfo:"client/app/searchClientInfo" //查询当前登录信息
		}
	},
	agent:{
		activity:{
				searchActivityNavList:'activity/app/showNavlist',
				searchActivityShowList:'activity/app/indexShowlist',
				searchIndexActivitygoodsList:'activity/app/indexShowActivityGoodList',
				},
	},
	
	apiCallbackCall(method, endpoint, data, load, isSwitch, callback) {
		if (load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let token = uni.getStorageSync('token') || null;
		console.log('这是token=' + token)
		if (token == null && (endpoint != this.client.login.reg && endpoint != this.clent.login.login)) {
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
		uni.request({
			url: (this.BASEURI + endpoint),
			data: formData,
			method: method,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				auth: token
			},
			success: function(res) {
				let result = res.data.result;
				if (result.code < 0) {
					uni.showToast({
						title: '[' + result.msg + ']',
						icon: 'none'
					});
					let timer = setTimeout(() => {
						clearTimeout(timer);
						uni.navigateTo({
							url: `/pages/public/login`
						})
					}, 2000);
				} else
				if (result.code > 0) {
					uni.showToast({
						title: '[' + result.msg + ']',
						icon: 'none'
					});
				} else {
					callback(result);
				}

			},
			fail: function(data) {
				uni.showToast({
					title: '请求数据失败',
					icon: 'none'
				});
			},
			complete: function(data) {
				if (load) {
					uni.hideLoading();
				}
			}
		});

	},

	/**
	 * 封装请求（async await 封装uni.request） 对应portal 项目
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 * isSwitch     是否转换
	 */
	async apiCall(method, endpoint, data, load, isSwitch, msg) {
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
		console.log('这是token=' + token)
		if (token == null && (endpoint != this.client.login.reg && endpoint != this.client.login.login)) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			uni.navigateTo({
				url: `/pages/client/public/login`
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
		let [error, res] = await uni.request({
			url: (this.BASEURI + endpoint),
			data: formData,
			method: method,
			header: {
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
					title: '[' + result.msg + ']',
					icon: 'none'
				});
				let timer = setTimeout(() => {
					clearTimeout(timer);
					uni.navigateTo({
						url: `/pages/client/public/login`
					})
				}, 2000);
			} else
			if (result.code > 0) {
				uni.showToast({
					title: '[' + result.msg + ']',
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
