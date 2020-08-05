<template>
	<view>
		<nav-bar backState="1000">支付</nav-bar>
		<!-- 地址 -->
		<navigator url="/pages/client/info/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<text class="address">{{addressData|address}}</text>
					<view class="top">
						<text class="name">{{addressData.name}}</text>
						<text class="mobile">{{addressData.phone}}</text>
					</view>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		
			<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
		</navigator>
		
		
		
		<view class="goods-section">
			<!-- <view class="g-header b-b">
				<text class="name">店铺:</text>
				<text class="name">{{agentShop.name}}</text>
			</view> -->
			<view class="g-item" v-for="(item,index) in buyGoodsList" :key='index'>
				<image :src="item.image.url"></image>
				<view class="right">
					<text class="title clamp">{{item.title}}</text>
					<text class="spec">商品规格: {{item.attr_val}} </text>
					<view class="price-box">
						<view class="">
							<text class="price">￥{{item.price}}</text>
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
		
		
		<!-- <view class="goods-section">
			<view class="g-header b-b">
				<text class="name">店铺:</text>
				<text class="name">{{agentShop.name}}</text>
			</view>
			<view class="g-item">
				<image :src="goodsDetail.goodsPhotos[0].url"></image>
				<view class="right">
					<text class="title clamp">{{goodsDetail.goodsName}}</text>
					<text class="spec">商品规格: {{goodsSku.skuValue}} </text>
					<view class="price-box">
						<view class="">
							<text class="price">￥{{totalPrice}}</text>
						</view>
						<view class="">
							<text class="numberBtn" @click="subtractNum">-</text>
							<text class="number">{{num}}</text>
							<text class="numberBtn" @click="addNum">+</text>
						</view>
					</view>
				</view>
			</view>
		</view> -->

		
		<!-- 优惠明细 	-->
		<view class="yt-list">
			<!--
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			-->
			<!-- <view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					 
				</view>
				<text class="cell-tit clamp">活动内容</text>
				<text class="cell-tip disabled">{{activity.name}}</text>
			</view> -->
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
						{{pickerIndex>-1?picker[pickerIndex]:'请选择配送方式'}} >
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
			<text class="submit" @click="buy">支付</text>
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
				pickerIndex: 0,
				pickerList: [],
				transportAgentId: '',
				transportType: '',
				isPickAddress: false,
				pickAddress: '',
				//以下为购物车内容
				cartList: [],
				cartNum: 1,
				cartTotal: '',
				buyGoodsList: []
			}
		},
		filters:{
			address(data){
				try{
					return data.provinceBean.name+" "+data.cityBean.name+" "+data.areaBean.name;
				}catch(e){
					return "暂无地址"
				}
			}
		},
		onLoad(option) {
			var that = this;
			this.searchDetailAddress()
			if (option.cartId) {
				this.searchCart(option.cartId)
				this.buyListType = 'detail'
				this.agentId = uni.getStorageSync('agentId')
			} else {
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
				let data = await Api.apiCall('post', Api.client.buy.getAgentDistanceType, params, false, false);
				if (data) {
					var tmpData = data.result.agentBean
					try{
						this.pickAddress = tmpData.provinceBean.name+tmpData.cityBean.name+tmpData.areaBean.name+tmpData.townBean.name+tmpData.community+tmpData.detailAddress
					}catch(e){
						//TODO handle the exception
					}
					this.transportAgentId = data.result.agentId
					if (this.transportAgentId === '-1') {
						uni.showModal({
							title: '提示',
							content: '您收货地址附近没有代理配送点，请选择快递',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {},
						});
					}
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
					if(this.transportType === 20) {
						this.isPickAddress = true
					}
				}
			},
			async searchDetailAddress(){ //查询地址信息
				let params = {
				};
				let data = await Api.apiCall('post', Api.client.address.detail, params, false, false);
				if (data) {
					if(data.result)
					    this.setAddress(data.result)
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
							goodsId: tmpData[tmp].goodsOneSku.goodsId,
							goodsSkuId: tmpData[tmp].goodsOneSku.id,
							shareId: this.shareClientId,
							number: 1,
							payPrice: tmpData[tmp].goodsOneSku.price,
							image: tmpData[tmp].goodsPicesBean.goodsPhotos[0] || tmpData[tmp].goodsPicesBean.goodsDetailPhotos[0],
							title: tmpData[tmp].goodsPicesBean.goodsName,
							attr_val: tmpData[tmp].goodsOneSku.skuValue,
							price: tmpData[tmp].goodsOneSku.price,
							stock: tmpData[tmp].goodsOneSku.stock,
						})
					}
					this.calcTotal()
					// this.goodsDetail = data.result.goodsPicesBean
					// this.agentShop = data.result.agentShopBean;
					// this.goodsSku = data.result.goodsOneSku;
					// this.totalPrice =this.goodsSku.price; 
					// this.activity=data.result.activityBean;
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
			subtractNum() { //商品数量的简单减少
				if (this.num >1) {
					this.num = parseInt(this.num) - 1
					this.totalPrice = (this.num * Number(this.goodsSku.price * 100))/100
				}
			},
			addNum() { //商品数量的简单增加
				this.num = parseInt(this.num) + 1
				this.totalPrice =  (this.num * Number(this.goodsSku.price * 100))/100
			},
			buy(index = 1){
				if (!this.addressData.id) {
					this.$api.msg('您还未选择收货地址')
					return;
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
											payPrice: (Number(that.buyGoodsList[tmp].number) * (Number(that.buyGoodsList[tmp].price) * 100))/100,
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
												Api.apiCallbackCall("POST", Api.client.buy.prePay, params, false, true, function(da_ta){
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
			payMent(res) {
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
						console.log('fail:' + JSON.stringify(err));
					},
					complete: function(res) {
						
					}
				});
			},
			async paySuccess (id) {
				let parmas = {
					orderId: id
				}
				let data = Api.apiCall('post', Api.client.buy.paySuccess,parmas)
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
			//以下为购物车内容
			async searchCart (ids) {
				let params = {
					idss: ids
				}
				var data = await Api.apiCall('post', Api.client.cart.listShopCar, params, true)
				if (data) {
					var tmpData = data.result.list
					for (let tmp in tmpData) {
						this.buyGoodsList.push({
							activityId: tmpData[tmp].activityId,
							goodsId: tmpData[tmp].goodsOneSku.goodsId,
							goodsSkuId: tmpData[tmp].goodsOneSku.id,
							shareId: tmpData[tmp].shareId,
							number: 1,
							payPrice: tmpData[tmp].goodsOneSku.price,
							image: tmpData[tmp].goodsPicesBean.goodsPhotos[0] || tmpData[tmp].goodsPicesBean.goodsDetailPhotos[0],
							title: tmpData[tmp].goodsPicesBean.goodsName,
							attr_val: tmpData[tmp].goodsOneSku.skuValue,
							price: tmpData[tmp].goodsOneSku.price,
							stock: tmpData[tmp].goodsOneSku.stock,
						})
					}
					this.calcTotal()
				}
			},
			numberChange1(data){
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
	
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
	
		.order-content {
			display: flex;
			align-items: center;
		}
	
		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}
	
		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}
	
		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}
	
		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
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
			margin: 20upx 30upx;
	
			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}
	
			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}
	
			.title {
				font-size: 30upx;
				color: $font-color-dark;
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
				padding-top: 10upx;
	
				.price {
					margin-bottom: 4upx;
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
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	.yt-list-cell.pickAddress {
		display: flex;
		align-items: flex-start;
		.textarea {
			width: 80%;
			height: 150upx;
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
			color: $font-color-light;
			margin-right: 10upx;
		}
	
		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
	
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
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
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
