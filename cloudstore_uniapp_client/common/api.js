import store from '../store/index';
export default {
	BASEURI: 'http://120.24.156.254:18888/platform/',
	//BASEURI: 'http://192.168.0.27:8088/',
	h5Appid: 'wxb4660f37187c0b8e', // h5微信登录的appId  暂时测试用
	source: 1, //1 weixinApplet 2 h5Source 3 pcSource 4 android 5ios
	es: {
		simpleSearchList: 'esProduct/search/simple', //简单搜索
		search: 'esProduct/search', //综合搜索、筛选、排序
	},
	
	areas:{
		province:'/sys/dict/list',
	},
	
	client:{
		login:{
			login:"sys/manager/platform/login"	,
			reg:"sys/manager/platform/register/client"
		},
		info:{
			searchInfo:"client/app/searchClientInfo" //查询当前登录信息
		},
		recommend: {
			newShopinfoByOrder: 'agent/goods/app/newShopinfoByOrder',
			list: 'agent/goods/app/list'
		},
		goods:{
		buy:"agent/goods/app/buyGoodsDetail",
		detail:"agent/goods/app/searchGoodsDetail"
		},
		address:{
			list:'app/client/address/searchClientAddress',
			save:'app/client/address/saveAddress',
			detail:'app/client/address/searchDetailAddress'
		},
		buy: {
			createOrder:'order/app/createOrder',
			prePay: 'app/pay/prePay'
		}
	},
	agent:{
		dictionaries: {
			search: 'sys/dict/search' //字典下拉查询
		},
		activity:{
			searchActivityNavList:'activity/app/showNavlist',
			searchActivityShowList:'activity/app/indexShowlist',
			searchIndexActivitygoodsList:'activity/app/indexShowActivityGoodList',
			searchInfo:'activity/app/get',
			listAll:'activity/app/alllist'
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
		   list: 'goods/app/list' ,//获取商品列表
		   detail: 'goods/app/searchGoodsDetail',
		   agentGoodsDetail:'/agent/goods/app/searchGoodsDetail',//查询代理商品的明细
		   save:'agent/goods/app/save' ,//代理商将商品加入代理
		   loadHtml:'goods/app/loadMobileHtml', //获取商品详情的图文详情
		},
		category: {
			list: '/app/goods/category/list',
			getchildId: 'goods/category/get'
		},
		home: {
			activity: 'activity/app/ilist', //活动名称列表
			activityGoodList: 'activity/app/indexShowActivityGoodList' //活动名称下对应的商品
		},
		hot: {
			hotList: 'activity/app/listActivityGoods'
		},
		address: {
			saveAddress: 'app/client/address/saveAddress',
			searchClientAddress : 'app/client/address/searchClientAddress',
			deleteAddress: 'app/client/address/deleteAddress',
			updateAddressStatus: 'app/client/address/updateAddressStatus'
		}
		
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
