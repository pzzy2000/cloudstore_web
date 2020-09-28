<template>
	<view class="container">
		<nav-bar backState="1000">支付</nav-bar>
		<!-- 地址 -->
		<navigator url="/pages/client/info/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<text class="address">{{addressData|address}}</text>
					<view class="top">
						<text class="mobile">{{addressData.phone}}</text>
						<text class="name">{{addressData.name}}</text>
					</view>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</navigator>
		
		<view class="goods-section">
			<view class="g-item" v-for="(item,index) in buyGoodsList" :key='index'>
				<image :src="item.image.url"></image>
				<view class="right">
					<view class="right-title">
						<text class="title clamp">{{item.title}}</text>
						<text class="activity">{{item.activityName}}</text>
					</view>
					<text class="subtitle clamp">{{item.subtitle}}</text>
					<view class="price-box">
						<view class="">
							<text class="price price-symbol">{{item.price}}</text>
							<text class="sku">/{{item.attr_val}} </text>
						</view>
						<view class="">
							<uni-number-box
								class="step"
								:min="1"
								:max="item.stock"
								:value="item.number>item.stock?item.stock:item.number"
								:isMax="item.number>=item.stock?true:false"
								:isMin="item.number===1"
								:index="index"
								@eventChange="numberChange1"
							></uni-number-box>
						</view>
					</view>
				</view>
			</view>
		</view>
	
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{cartTotal}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit">配送方式</text>
				<picker @change="PickerChange" :value="pickerIndex" :range="picker">
					<view class="picker clamp">
						{{pickerIndex>-1?picker[pickerIndex]:'暂无配送方式'}} >
					</view>
				</picker>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view>
			<view class="yt-list-cell desc-cell pickAddress" v-if="isPickAddress">
				<text class="cell-tit" >{{showtransport(transportType)}}</text>
				<textarea :value="pickAddress" class="textarea" disabled="true" style="line-height: 20upx;"></textarea>
			</view>
			<!-- <view class="cu-form-group margin-top">
				<textarea maxlength="-1" :value="pickAddress"></textarea>
			</view> -->
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{cartTotal}}</text>
			</view>
			<text class="submit" @click="btnBuy">去支付</text>
		</view>
		
		<!-- 优惠券面板 
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				 优惠券页面，仿mt 
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>
						
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>
		 -->
	</view>
</template>
<script>
	import navBar from '@/components/zhouWei-navBar';
    import Api from '@/common/api.js';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		data() {
			return {
				orderType: '',
				buyListType:'',
				goodsId: '',
				agentId: '',
				activityId: '',
				goodsDetail: {},
				agentShop:{},
				goodsSku:{},
				num: 1,
				isNumBtn: true,
				totalPrice: '',
				buyInfo: '',
				buyType: '',
				activity:'',
				items: [{
						value: 'USA',
						name: '支付宝'
					},
					{
						value: 'CHN',
						name: '微信',
						checked: 'true'
					}
				],
				current: 1,
				vxCode: '',
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				orderId: '',
				shareClientId: '-1',
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: {
					id: '',
					name: '',
					mobile: '',
					addressName: '',
					address: '',
					area: '',
					default: false,
				},
				picker: [],
				pickerIndex: -1,
				pickerList: [],
				transportAgentId: '',
				transportType: '',
				isPickAddress: false,
				pickAddress: '',
				//以下为购物车内容
				cartList: [],
				cartNum: 1,
				cartTotal: '',
				buyGoodsList: [],
				buyGoodsListNum: []
			}
		},
		filters:{
			address(data){
				try{
					return data.provinceBean.name+" "+data.cityBean.name+" "+data.areaBean.name;
				}catch(e){
					return "暂无默认收货地址信息"
				}
			}
		},
		onLoad(option) {
			var that = this;
			this.searchDetailAddress()
			if (option.cartId) { //购物车跳转
				this.searchCart(option.cartId)
				this.buyListType = 'detail'
				this.agentId = uni.getStorageSync('agentId')
				this.buyGoodsListNum = (JSON.parse(option.checkList)).sort()
				console.log(this.buyGoodsListNum)
			} else if (option.orderId){ //订单页面跳转
				console.log(option.orderId)
				this.orderType = 'buyOrder'
				this.orderId = option.orderId
				this.searchWaitBuyDetil(this.orderId)
			} else{ //直接购买单品
				this.buyListType = 'cart'
				this.goodsId = option.goodsId
				this.agentId = option.agentId
				this.activityId = option.activityId
				this.goodsSkuId =option.goodsSkuId;
				this.shareClientId = option.shareClientId
				if ( option.shareClientId == 'undefined') {
					this.shareClientId = '-1'
				}
				this.orderType = option.orderType
				this.orderId = option.orderId
				this.getGoodsData(this.goodsId ,this.agentId ,this.goodsSkuId,this.activityId)
			}
		},
		components: {
			navBar, uniNumberBox
		},
		methods: {
			showtransport(transportType){
				 switch(transportType){
					 case  10: {return '配送点'}
					 case  20: {return '自提点'}
					 default:{
						 return '快递点'
					 }
				 }
			},
			PickerChange (e) {
				this.pickerIndex = e.detail.value
				this.transportType = this.pickerList[e.detail.value].code
				this.isPickAddress = this.transportType == 30 ? false : true
				if(this.transportType ===10){
					
				}else{
					
				}
			},
			async getAgentDistanceType () { //查询交货方式地址和方式
				let params = {
					clientAddressId: this.addressData.id
				}
				let data = await Api.apiCall('post', Api.client.buy.getAgentDistanceType, params, true, false);
				if (data) {
					var tmpData = data.result.agentBean
					try{
						this.pickAddress = tmpData.provinceBean.name+tmpData.cityBean.name+tmpData.areaBean.name+tmpData.townBean.name+tmpData.community+tmpData.detailAddress
					}catch(e){
						//TODO handle the exception
					}
					this.transportAgentId = data.result.agentId
					// if (this.transportAgentId === '-1') {
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: '您收货地址附近没有代理配送点，已自动选择为快递配送',
					// 		showCancel: false,
					// 		cancelText: '取消',
					// 		confirmText: '确定',
					// 		success: res => {},
					// 	});
					// }
					this.picker.length = 0
					this.pickerList.length = 0
					var tmpData = data.result.type
					for(let tmp in tmpData) {
						this.picker.push(tmpData[tmp].name)
						this.pickerList.push({
						   name: tmpData[tmp].name,
						   code: tmpData[tmp].code
						})
					}
					this.transportType = this.pickerList[0].code
					this.pickerIndex = 0
					if(this.transportType === 10) {
						this.isPickAddress = true
					}
				}
			},
			async searchDetailAddress(){ //查询地址信息
				let params = {
				};
				let data = await Api.apiCall('post', Api.client.address.detail, params, false, false);
				if (data) {
					if(data.result.length != 0)
					    this.setAddress(data.result)
					} else {
						this.$api.msg('您还没有默认收货地址')
					}
			},
			async getGoodsData (goodsId,agentId,goodsSkuId,activityId) { //加载商品数据
				let params = {
					goodsId: goodsId ,
					agentGoodsId: agentId,
					goodsSkuId: goodsSkuId,
					activityId: activityId
				};
				let data = await Api.apiCall('post', Api.client.goods.buy, params, true, false);
				if (data) {
					var tmpData = data.result.list
					for (let tmp in tmpData) {
						this.buyGoodsList.push({
							activityId: tmpData[tmp].activityId,
							activityName: tmpData[tmp].activityBean ? tmpData[tmp].activityBean.name : '无活动',
							goodsId: tmpData[tmp].goodsOneSku.goodsId,
							goodsSkuId: tmpData[tmp].goodsOneSku.id,
							shareId: this.shareClientId,
							number: 1,
							payPrice: tmpData[tmp].goodsOneSku.price,
							image: tmpData[tmp].goodsOneSku.photos[0] || tmpData[tmp].goodsPicesBean.goodsDetailPhotos[0],
							title: tmpData[tmp].goodsPicesBean.goodsName,
							subtitle: tmpData[tmp].goodsPicesBean.goodsSubtitle,
							attr_val: tmpData[tmp].goodsOneSku.skuValue,
							price: tmpData[tmp].goodsOneSku.price,
							stock: tmpData[tmp].goodsOneSku.stock,
						})
					}
					this.calcTotal()
				}
			},
			radioChange: function(evt) { //选择支付方式
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			btnBuy () { //点击支付按钮
				Api.debounce(this.buy, 3000, true);
			},
			buy(){ //调用支付方法
				if (!this.addressData.id) {
					this.$api.msg('您还未选择收货地址')
					return;
				}
				if (this.transportAgentId === '-1') {
					uni.showModal({
						title: '提示',
						content: '您收货地址小区暂无团长前置仓，您目前无法下单，敬请理解！',
						showCancel: false,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							// uni.navigateBack({
							//     delta: 1
							// });
						},
					});
					return false;
				}
				uni.showLoading({
					title: '正在创建订单',
					mask: false
				});
				let that = this;
				  uni.login({
				      provider: 'weixin',
				      success: function (loginRes) {
						    let  vxCode = loginRes.code;
							uni.getProvider({ //获取支付的方式
							    service: 'payment',
							    success: function (res) {
									that.buyType = res.provider;
									var params = {
										transportAgentId: that.transportAgentId,
										transportType: that.transportType,
										clientAddressId: that.addressData.id,
										payType: 'weixin',
										detail: []
									}
									for (let tmp in that.buyGoodsList) {
										params.detail.push({
											activityId: that.buyGoodsList[tmp].activityId,
											agentGoodsId: that.agentId,
											clientId: that.buyGoodsList[tmp].clientId,
											goodsId: that.buyGoodsList[tmp].goodsId,
											goodsSkuId: that.buyGoodsList[tmp].goodsSkuId,
											number: that.buyGoodsList[tmp].number,
                                            payPrice: ((Number(that.buyGoodsList[tmp].price) * 1000) * that.buyGoodsList[tmp].number) / 1000,
											price: that.buyGoodsList[tmp].price,
											shareId: that.buyGoodsList[tmp].shareId,
										})
									}
									if (that.orderType === 'buyOrder') {
										let params = {
											'code': vxCode,
											'orderId': that.orderId
										}
										Api.apiCallbackCall("POST", Api.client.buy.prePay, params, false, true, function(da_ta){
										if (da_ta) {
											that.payMent(da_ta)
											}
										});
										uni.hideLoading()
									}else{
										Api.apiCallbackCall("POST", Api.client.buy.createOrder, params, true, false, function(data){
											if (data) {
												let re =data.result;
												let params = {
													'code': vxCode,
													'orderId': re.id
												}
												that.orderId = re.id
												Api.apiCallbackCall("POST", Api.client.buy.prePay, params, true, true, function(da_ta){
												if (da_ta) {
													that.payMent(da_ta)
													}
												});
												uni.hideLoading()
												// that.payMent(data)
											}
										}) 
									}
								},
								fail:function(){
									this.$api.msg("提交订单失败");
								}
							});
						  },
					  fail:function() {
					  	that.$api.msg("提交订单失败");
					  }
				})
			},
			payMent(res) { //调起微信支付
				uni.showLoading({
					title:'正在支付',
					icon: 'none'
				})
				var that = this;
				let vxBuyInfo = res.result;
				//微信支付
				uni.requestPayment({
					provider: 'wxpay',
					//orderInfo: orderInfo, //订单数据
					timeStamp: vxBuyInfo.timeStamp, //时间戳从1970年1月1日至今的秒数，即当前的时间。
					nonceStr: vxBuyInfo.nonceStr, //随机字符串，长度为32个字符以下。
					package: vxBuyInfo.packageValue, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。
					signType: vxBuyInfo.signType, //签名算法，暂支持 MD5。
					paySign: vxBuyInfo.paySign, //签名，具体签名方案参见 微信小程序支付文档
					success: function(res) {
						if (res.errMsg === 'requestPayment:ok') {
							uni.hideLoading();
							that.paySuccess(that.orderId)
							uni.showModal({
								title: '提示',
								content: '支付成功',
								showCancel: false,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									uni.navigateTo({
										url: '/pages/client/goods/buySuccess',
									});
								},
							});
						}
					},
					fail: function(err) {
						uni.hideLoading();
						uni.showModal({  
							content: "支付失败",  
							showCancel: false,
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
									    url: '/pages/client/order/order'
									});
								} else if (res.cancel) {
									uni.navigateTo({
									    url: '/pages/client/order/order'
									});
								}
							}
						})  
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			async paySuccess (id) { //支付成功调用方法
				let parmas = {
					orderId: id
				}
				let data = Api.apiCall('post', Api.client.buy.paySuccess,parmas, true)
				if (data) {
					console.log(data)
				}
			},
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			submit(){
				uni.redirectTo({
					url: '/pages/money/pay'
				})
			},
			stopPrevent(){},
			setAddress(data){
				this.addressData = data;
				this.getAgentDistanceType()
			},
			async searchCart (ids) { //查询购物车内容
				let params = {
					idss: ids
				}
				var data = await Api.apiCall('post', Api.client.cart.listShopCar, params, true)
				if (data) {
					var tmpData = data.result.list.sort()
					for (let tmp in tmpData) {
						this.buyGoodsList.push({
							activityId: tmpData[tmp].activityId,
							activityName: tmpData[tmp].activityBean ? tmpData[tmp].activityBean.name : '无活动',
							goodsId: tmpData[tmp].goodsOneSku.goodsId,
							goodsSkuId: tmpData[tmp].goodsOneSku.id,
							shareId: tmpData[tmp].shareId,
							number: 1,
							payPrice: tmpData[tmp].goodsOneSku.price,
							image: tmpData[tmp].goodsOneSku.photos[0] || tmpData[tmp].goodsPicesBean.goodsDetailPhotos[0],
							title: tmpData[tmp].goodsPicesBean.goodsName,
							subtitle: tmpData[tmp].goodsPicesBean.goodsSubtitle,
							attr_val: tmpData[tmp].goodsOneSku.skuValue,
							price: tmpData[tmp].goodsOneSku.price,
							stock: tmpData[tmp].goodsOneSku.stock,
						})
					}
					for (let i in this.buyGoodsList) {
						for (let j in this.buyGoodsListNum) {
							if (this.buyGoodsListNum[i].goodsSkuId === this.buyGoodsList[j].goodsSkuId) {
								this.buyGoodsList[j].number = this.buyGoodsListNum[i].number
							}
						}
					}
					this.calcTotal()
				}
			},
			async searchWaitBuyDetil (id) { //查询待支付订单内容
				let params = {
					orderId: id
				};
				let data = await Api.apiCall('post', Api.client.order.getClientOrderDetail, params, true);
				if (data) {
					var tmpData = data.result.details
					console.log(tmpData)
					for (let tmp in tmpData) {
						this.buyGoodsList.push({
							activityId: tmpData[tmp].activityId,
							activityName: tmpData[tmp].activityBean ? tmpData[tmp].activityBean.name : '无活动',
							goodsId: tmpData[tmp].goodsId,
							goodsSkuId: tmpData[tmp].goodsSkuId,
							number: tmpData[tmp].quantity,
							payPrice: tmpData[tmp].goodsSkuBean.price,
							image: tmpData[tmp].goodsSkuBean.photos[0] || tmpData[tmp].goodsPicesBean.goodsDetailPhotos[0],
							title: tmpData[tmp].goodsPicesBean.goodsName,
							subtitle: tmpData[tmp].goodsPicesBean.goodsSubtitle,
							attr_val: tmpData[tmp].goodsSkuBean.skuValue,
							price: tmpData[tmp].goodsSkuBean.price,
							stock: tmpData[tmp].goodsSkuBean.stock,
						})
					}
					this.isNumBtn = false
					this.calcTotal()
				}
			},
			numberChange1(data){
				if (!this.isNumBtn) {
					return false;
				}
				this.buyGoodsList[data.index].number = data.number;
				this.calcTotal();
			},
			calcTotal(){ //计算价格
				let list = this.buyGoodsList;
				let cartTotal = 0;
				list.forEach(item=>{
					cartTotal += item.price * item.number;
				})
				this.cartTotal = Number(cartTotal.toFixed(2));
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	.container {
		padding-bottom: 150upx;
	}
	.address-section {
		padding: 30upx 0;
		margin-top: 30upx;
		font-size: 26upx;
		height: 130upx;
		background: #fff;
		position: relative;
		color: #333333;
		.order-content {
			display: flex;
			align-items: center;
			height: 100%;
		}
	
		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			font-size: 35upx;
		}
	
		.cen {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			font-size: 28upx;
			width: 100%;
		}
		.address {
			color: #333333;
			width: 100%;
			line-height: 50upx;
		}
		.top {
			.name {
				font-size: 24upx;
				color: #666666;
				width: 100%;
			}
			.mobile {
				font-size: 24upx;
				// margin-right: 24upx;
				color: #666666;
				width: 100%;
			}
		}
		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}
	
		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}
	
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;
	
		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}
	
		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}
	
		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}
	
		.g-item {
			display: flex;
			padding: 34upx;
			image {
				display: block;
				width: 124upx;
				height: 124upx;
				border-radius: 10upx;
			}
	
			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
				.right-title {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.title {
						font-size: 32upx;
						color: #333333;
						letter-spacing: 4upx;
						line-height: 50upx;
						max-width: 85%;
						margin-right: 10upx;
					}
					.activity {
						color: #FE961C;
						font-size: 15upx;
						border: 1upx solid #FE961C;
						height: 30upx;
						line-height: 30upx;
						border-radius: 5upx;
						width: 70upx;
						text-align: center;
					}
				}
				.subtitle {
					font-size: 24upx;
					color: #999;
					line-height: 50upx;
				}
				.spec {
					font-size: 26upx;
					color: $font-color-light;
				}
					
				.price-box {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 32upx;
					color: $font-color-dark;
					.price {
						color: #FF1313;
						font-size: 32upx;
					}
					.sku {
						color: #999;
						font-size: 24upx;
						margin-left: 10upx;
					}
					.numberBtn {
						height: 100%;
						width: 40upx;
						text-align: center;
						display: inline-block;
					}
					.number{
						font-size: 26upx;
						color: $font-color-base;
						text-align: center;
					}
				}
					
				.step-box {
					position: relative;
				}
			}
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	.yt-list-cell.pickAddress {
		display: flex;
		align-items: flex-start;
		.textarea {
			width: 80%;
			height: 85upx;
			padding-top: 20upx;
		}
	}
	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;
	
		&.cell-hover {
			background: #fafafa;
		}
	
		&.b-b:after {
			left: 30upx;
		}
	
		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;
	
			&.hb {
				background: #ffaa0e;
			}
	
			&.lpk {
				background: #3ab54a;
			}
	
		}
	
		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}
	
		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: #999;
			margin-right: 10upx;
		}
		.picker {
			font-size: 24upx;
		}
		.cell-tip {
			font-size: 24upx;
			color: #333;
	
			&.disabled {
				color: $font-color-light;
			}
	
			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}
	
		&.desc-cell {
			.cell-tit {
				max-width: 20%;
			}
		}
	
		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: #FF1313;
			font-size: 26upx;
			margin-left: 8upx;
		}
		.price{
			font-size: 26upx;
			color: #FF1313;;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 180upx;
			height: 74upx;
			margin-right: 28upx;
			border-radius: 40upx;
			color: #fff;
			font-size: 28upx;
			background-color: #39a9ff;
			letter-spacing: 4upx;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}
	
	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
