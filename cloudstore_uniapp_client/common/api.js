import store from '../store/index';
export default {
	// BASEURI: 'http://120.24.156.254:18888/platform/',
	BASEURI: 'http://106.52.184.24:18888/platform/',
	APPBASEURI: 'http://106.52.184.24:18888/',
	//BASEURI: 'http://192.168.0.27:8088/',
	h5Appid: 'wxb4660f37187c0b8e', // h5微信登录的appId  暂时测试用
	source: 1, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
	es: {
		simpleSearchList: 'esProduct/search/simple', //简单搜索
		search: 'esProduct/search', //综合搜索、筛选、排序
	},
	areas:{
		province:'sys/dict/list',
	},
	finance: {
		get: 'app/private/finance/get',
		list: 'app/private/finance/list'
	},
	client:{
		login:{
			login:"sys/manager/platform/login"	,
			reg:"sys/manager/platform/register/client"
		},
		reg: {
			auth: 'sys/manager/platform/weixin/auth',  //传code
			getPhone: 'sys/manager/platform/weixin/getPhone', // 传手机号加密信息
			saveClientInfo: 'sys/manager/platform/weixin/saveClientInfo' ,//再传一系列信息
			sendCode: 'sys/manager/platform/register/client/send',//获取手机验证码
			updatePassword: 'sys/manager/platform/updatePassword', //忘记密码
			editPassword: 'app/private/sys/manager/user/updatePassword' //修改密码
		},
		info:{
			searchInfo:"app/private/client/searchClientInfo" //查询当前登录信息
		},
		recommend: {
			newShopinfoByOrder: 'agent/goods/app/newShopinfoByOrder', //查询客户端最新买的商品的商店信息
			list: 'agent/goods/app/list',
			listAactivity: 'agent/goods/app/listAactivity',
			listbyagentid: 'agent/goods/app/listbyagentid'
		},
		goods:{
			buy:"app/private/agent/goods/buyGoodsDetail",
			detail:"agent/goods/app/searchGoodsDetail", 
			searchMyAgentGoods: 'agent/goods/app/searchMyAgentGoods'
		},
		address:{
			list:'app/private/client/address/searchClientAddress',
			save:'app/private/client/address/saveAddress',
			detail:'app/private/client/address/searchDetailAddress',
			deleteAddress: 'app/private/client/address/deleteAddress',
			getClientAddressById: 'app/private/client/address/getClientAddressById'
		},
		buy: {
			getAgentDistanceType: 'app/public/agent/getAgentDistanceType',
			createOrder:'app/private/order/createOrder',
			prePay: 'app/pay/prePay',
			paySuccess: 'app/pay/paySuccess'
		},
		order: {
			getClientOrder: 'app/private/order/getClientOrder',
			getClientOrderDetail : 'app/private/order/getClientOrderDetail',
			refundOrder: 'app/pay/refundOrder'
		},
		applyAgent: {
			getClientAgent: 'app/private/agent/getClientAgent',
			save: 'app/private/agent/save'
		},
		cart: {
			addShopCar: 'app/private/shopCar/addShopCar',//新增购物车商品
			deleteShopCar: 'app/private/shopCar/deleteShopCar',//删除购物车商品
			myShopCar: 'app/private/shopCar/myShopCar', //我的购物车列表
			listShopCar: 'app/private/shopCar/listShopCar' //购物车结算列表
		}
	},
	agent:{
		dictionaries: {
			search: 'sys/dict/search' //字典下拉查询
		},
		activity:{
			searchActivityNavList:'app/public/activity/showNavlist ',
			searchActivityShowList:'app/public/activity/indexShowlist',
			searchIndexActivitygoodsList:'app/public/activity/indexShowActivityGoodList',
			searchInfo:'app/public/activity/get',
			listAll:'app/public/activity/alllist',
			getAgentDistance: 'app/public/agent/getAgentDistance'
		},
		user: {
			userinfo:"/agent/get",//获取用户信息
			userlogin:"sys/manager/platform/login",
			reg:"sys/manager/platform/register/agent",
			wxLogin: 'sys/manager/platform/login', //判断微信登录
			savePhone: 'sys/manager/platform/weixin/login' ,//微信第一次利用手机号绑定登录
			agentList: 'agent/goods/app/list', //获取代理商代理的商品信息
			dateList: 'agent/goods/app/dateList', //获取今日上新的商品
		},
		goods: { //商品接口
		   list: 'app/public/goods/list' ,//获取商品列表
		   detail: 'app/public/goods/searchGoodsDetail',
		   agentGoodsDetail:'app/public/goods/searchGoodsDetail',//查询代理商品的明细
		   save:'agent/goods/app/save' ,//代理商将商品加入代理
		   loadHtml:'app/public/goods/loadMobileHtml', //获取商品详情的图文详情
		},
		share: {
			save: 'app/private/share/apply'
		},
		category: {
			list: 'app/public/goods/category/list',
			getchildId: 'goods/category/get'
		},
		home: {
			activity: 'activity/app/ilist', //活动名称列表
			activityGoodList: 'activity/app/indexShowActivityGoodList' //活动名称下对应的商品
		},
		hot: {
			hotList: 'app/public/activity/listActivityGoods',
			alllist: 'app/public/activity/alllist',
			topPiceList:'app/public/sys/hotsale/pice/list'
		},
		address: {
			saveAddress: 'app/client/address/saveAddress',
			searchClientAddress : 'app/private/client/address/searchDetailAddress',
			deleteAddress: 'app/client/address/deleteAddress',
			updateAddressStatus: 'app/client/address/updateAddressStatus'
		},
		order: {
			getAgentOrder: 'order/app/getAgentOrder',
			getClientOrder:　'order/app/getClientOrder',
			getAgentOrderCount: 'order/app/getAgentOrderCount' //我的小店的订单数量，代理商品
		},
		agentInfo: {
			getAgentShop: 'agent/goods/app/getAgentShop'
		}
	},
	statusBarHeight () {
		return  uni.getSystemInfoSync().statusBarHeight
	},
	apiCallbackCall(method, endpoint, data, load, isSwitch, callback) {
		if (load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let token = uni.getStorageSync('token') || null;
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
				'content-type':isSwitch ==true ? 'application/x-www-form-urlencoded' :'application/json',
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
		// if (token == null && (endpoint != this.client.login.reg && endpoint != this.client.login.login)) {
		// 	uni.showToast({
		// 		title: '请先登录',
		// 		icon: 'none'
		// 	});
		// 	uni.navigateTo({
		// 		url: `/pages/client/public/login`
		// 	})
		// }
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
	async ApiFalseToken (methods, endpoint, formData ,load) {
		if (load) {
			uni.showLoading({
				title: '正在加载',
				mask: false
			});
		}
		let [error, res] = await uni.request({
			url: (this.BASEURI + endpoint),
			data: formData,
			method: methods,
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		});
		if (load) {
			uni.hideLoading();
		}
		if (undefined == res || 'undefined' == res) {
			console.log('index');
			uni.showToast({
				title: '系统请求错误',
				icon: 'none'
			});
		} else {
			let result = res.data.result;
			if (result.code < 0) {
				// uni.showToast({
				// 	title: '[' + result.msg + ']',
				// 	icon: 'none'
				// });
				return result;
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
	isToken () {
		var token = uni.getStorageSync('token')
		if (token) {
			return true;
		} else {
			uni.showToast({
				title: '请先登录',
				duration: 1500,
				icon: 'none'
			});
			let timer = setTimeout(() => {
					clearTimeout(timer);
					uni.navigateTo({
						url: `/pages/client/public/login`
					})
			}, 2000);
		}
		// if (token) {
		// 	uni.navigateTo({
		// 		url: url,
		// 	});
		// } else {
		// 	let timer = setTimeout(() => {
		// 			clearTimeout(timer);
		// 			uni.navigateTo({
		// 				url: `/pages/client/public/login`
		// 			})
		// 	}, 2000);
		// }
	}
}
