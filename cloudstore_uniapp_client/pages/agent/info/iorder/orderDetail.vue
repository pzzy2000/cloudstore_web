<template>
	<view class="container">
		<nav-bar backState="1000">订单详情</nav-bar>
		<view class="orde-detail-status">
			<view class="orde-detail-title">订单
				<template>
					<text class="state" v-if="orderDetail.orderStatus === 'wait'">待支付</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'pay'">支付待确认</text>
					<text class="state" v-else-if="orderDetailorderDetail.orderStatus === 'payed'">已支付</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'peisong'">待配送</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'refunding'">退款中</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'refunded'">已退款</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'peisoged'">已配送</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'complete'">已完成</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'returnsing'">退货</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'returns'">已退货</text>
					<text class="state" v-else-if="orderDetail.orderStatus === 'close'">超时关闭</text>
				</template>
			</view>
			<text>感谢您对丫咪购的信任，期待再次光临</text>
		</view>
		<view class="goods-section">
			<!-- <view class="g-header b-b">
				<text class="name">{{agentShopName}}</text>
			</view> -->
			<view class="order-list-content" v-for="(item, index) in goodsDetail" :key='index'>
				<image :src="item.goodsSkuBean.photos[0].url || item.goodsPicesBean.goodsDetailPhotos[0].url" mode="aspectFill" class="image-wrapper"></image>
				<view class="goods-detail">
					<view class="detail-title">
						<text class="clamp">{{item.goodsPicesBean.goodsName}} </text>	
						<text class="detail-title-price price-symbol">{{item.price || ''}}</text>
					</view>
					<view class="detail-subtitle">
						<text class="clamp">{{item.goodsPicesBean.goodsSubtitle}}</text>
						<view class="deliveryType" v-if="item.deliveryType">
							配送方：
							<text v-if="item.deliveryType === 'agent'">代理</text>
							<text v-if="item.deliveryType === 'store'">仓库</text>
						</view>
					</view>
					<view class="detail-price">
						<view class="price-num price-symbol">{{item.payPrice}} <text class="price-sku">/{{item.goodsSkuBean.skuValue}}</text> </view>
						<text>× {{item.quantity}}</text>
					</view>
				</view>
			</view>
			<view class="order-payPrice">
				<view>
					实付金额
				</view>
				<text class="order-payPrice-num price-symbol">
					{{orderDetail.payPrice}}
				</text>
			</view>
			<view class="order-payPrice" v-if="orderDetail.orderStatus === 'complete'">
				<view>
					订单完成时间:
				</view>
				<text class="order-payPrice-num">
					{{orderDetail.endTime || '暂无订单完成时间'}}
				</text>
			</view>
			<view class="order-payPrice" v-if="orderDetail.orderStatus === 'wait'">
				<view>
					订单关闭时间:
				</view>
				<text class="order-payPrice-num">
					{{orderDetail.endTime || '暂无订单关闭时间'}} 
				</text>
			</view>
					
		</view>
		<view class="yt-list">
			<view class="yt-list-cell">
				<text class="cell-tit clamp">订单编号</text>
				<text class="cell-tip">{{orderDetail.number}}</text>
			</view>
			<view class="yt-list-cell">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{orderDetail.createTime}}</text>
			</view>
			<view class="yt-list-cell">
				<text class="cell-tit clamp">下单人姓名</text>
				<text class="cell-tip">{{clientInfo.name}}</text>
			</view>
			<view class="yt-list-cell">
				<text class="cell-tit clamp">下单人电话</text>
				<text class="cell-tip">{{clientInfo.phone}}</text>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell" v-if="transportType">
				<text class="cell-tit clamp">收货方式</text>
				<text class="cell-tip">{{transportType}}</text>
			</view>
			<view class="yt-list-cell" v-if="clientInfo.name">
				<text class="cell-tit clamp">收货人</text>
				<text class="cell-tip">{{addressData.name || '暂无收货人'}}</text>
			</view>
			<view class="yt-list-cell" v-if="clientInfo.name">
				<text class="cell-tit clamp">收货人电话</text>
				<text class="cell-tip">{{addressData.phone || '暂无电话'}}</text>
			</view>
			<view class="yt-list-cell pickAddress" v-if="addressData.address != '-1'">
				<text class="cell-tit clamp">收货地址</text>
				<textarea :value="addressData.address" class="textarea" disabled="true" style="line-height: 20upx;"></textarea>
			</view>
			<view class="yt-list-cell desc-cell pickAddress" v-if="isPickAddress">
				<text class="cell-tit">自提地址</text>
				<textarea :value="pickAddress" class="textarea" disabled="true" style="line-height: 20upx;"></textarea>
			</view>
			<view class="yt-list-cell" v-if="isPickAddress">
				<text class="cell-tit clamp">联系电话</text>
				<text class="cell-tip">{{PickPhone}}</text>
			</view>
		</view>
		<view class="yt-list">
			<view class="cu-item" v-if="!logisticsInfo.length">
				<text class="content" style="padding-left: 40upx;">暂无订单物流信息</text>
			</view>
			<view class="cu-timeline">
				<view class="cu-item text-blue" v-for="item in logisticsInfo" :key='item.id'>
					<view class="content text-black bg-white">
						<text class="">{{item.time}}</text> {{item.msg}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import navBar from '@/components/zhouWei-navBar';
    import Api from '@/common/api.js';
	export default {
		data() {
			return {
				goodsId: '',
				activity: '',
				goodsDetail: [
					{
						price: ''
					}
				],
				orderDetail: '',
				transportType: '',
				skuInfo: '',
				price: '',
				num: '1',
				totalPrice: '',
				buyInfo: '',
				buyType: '',
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
				addressData: { //收货人的信息
					id: '',
					name: '',
					phone: '',
					addressName: '',
					address: '',
					area: '',
					default: false,
				},
				agentShopName:'',
				isPickAddress: false,
				pickAddress: '',
				PickPhone: '',
				clientInfo: { //下单人的信息
					name: '',
					phone: '',
					address: ''
				},
				logisticsInfo: ''
			}
		},
		onLoad(option) {
			//这里的数据用来做测试
			// option.goodsId = "7604921082513985536"
			// option.price = '100'
			var that = this;
			this.price = option.price
			this.totalPrice = option.price
			this.getOrderData(option.orderId)
			
		},
		onShow () {
		},
		components: {
			navBar
		},
		methods: {
			async getOrderData (id) { //加载商品数据
				let params = { 
					orderId: id
				};
				let data = await Api.apiCall('post', Api.agent.order.getAgentClientOrderDetail, params, true);
				if (data) {
					var transportAgent = data.result.orderBean.transportAgentBean
					var clientAddress = data.result.orderBean.clientAddressBean //获取收货人信息
					this.goodsDetail = data.result.details
					this.orderDetail = data.result.orderBean
					this.logisticsInfo = data.result.infoDetails
					//获取下单用户信息
					try{
						this.clientInfo.name = data.result.orderBean.clientBean.name
						this.clientInfo.phone = data.result.orderBean.clientBean.phone
					}catch(e){
						this.clientInfo.name = ''
						this.clientInfo.phone = ''
					}
					//获取收货人信息
					if (data.result.orderBean.clientAddressId != -1) {
						this.addressData.name = clientAddress.name
						this.addressData.phone = clientAddress.phone
						this.addressData.address = clientAddress.provinceBean.name+clientAddress.cityBean.name+ clientAddress.areaBean.name + (clientAddress.community || '' ) +clientAddress.detailAddress
					} else {
						this.addressData.address = data.result.orderBean.clientAddressId
					}
					//获取自提点地址和配送方式
					if (data.result.orderBean.transportType === 20) { 
						this.isPickAddress = true
						this.PickPhone = transportAgent.phone
						this.pickAddress = transportAgent.provinceBean.name+transportAgent.cityBean.name+transportAgent.areaBean.name+transportAgent.townBean.name+transportAgent.community+transportAgent.detailAddress
					}
					console.log(data.result.orderBean.transportType)
					switch (data.result.orderBean.transportType) {
						case 10:
						this.transportType = '代理配送'
						break;
						case 20:
						this.transportType = '自提'
						break;
						case 30:
						this.transportType = '快递'
						break;
					}
				}
			},
			// async searchClientAddress () { //查询收货地址
			// 	let params = {
			// 		pageNum: '1',
			// 		pageSize: '10'
			// 	} 
			// 	let data = await Api.apiCall('post', Api.agent.address.searchClientAddress, params)
			// 	if (data) {
			// 		let tmpData = data.result
			// 		console.log(tmpData)
			// 		this.addressData.id = tmpData.id
			// 		this.addressData.name = tmpData.name
			// 		this.addressData.address = tmpData.provinceBean.name + tmpData.cityBean.name + tmpData.areaBean.name
			// 		this.addressData.phone = tmpData.phone
			// 		this.addressData.area = tmpData.detailAddress
			// 	}
			// },
			radioChange: function(evt) { //选择支付方式
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			computNumber (price) {
				return Number(this.price) * 100
			},
			subtractNum() { //商品数量的简单减少
				if (this.num >1) {
					this.num = parseInt(this.num) - 1
					this.totalPrice =  Number(parseInt(this.num) * this.computNumber(this.price))/100
				}
			},
			addNum() { //商品数量的简单增加
				this.num = parseInt(this.num) + 1
				this.totalPrice =  Number(parseInt(this.num) * this.computNumber(this.price))/100
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
			stopPrevent(){}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F5F5F5;
		padding-bottom: 100upx;
	}
	.container {
		padding-bottom: 50upx;
	}
	.orde-detail-status {
		margin: 50upx 20upx 0;
		font-size: 24upx;
		line-height: 60upx;
		color: #999999;
		.orde-detail-title {
			font-size: 40upx;
			color: #333333;
			font-weight: bold;
		}
	}
	.goods-section {
		background-color: #fff;
		border-radius: 15upx;
		margin: 0 20upx;
		.order-list-content {
			padding:15upx 30upx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 100%;
			.image-wrapper {
				width: 124upx;
				height: 124upx;
				border-radius: 10upx;
			}
			.goods-detail {
				margin-left: 40upx;
				width: 75%;
				line-height: 50upx;
				.detail-title {
					color: #333;
					font-size: 32upx;
					display: flex;
					justify-content: space-between;
					.detail-title-price {
						color:#FF1313;
						font-size: 26upx;
					}
				}
				.detail-subtitle {
					color: #999999;
					font-size: 24upx;
					letter-spacing: 2upx;
					display: flex;
					justify-content: space-between;
					.deliveryType {
						display: flex;
						color: #333;
						letter-spacing: 0;
					}
				}
				.detail-price {
					color: #333333;
					font-size: 32upx;
					display: flex;
					justify-content: flex-start;
					width: 100%;
					.price-num {
						color: #FF1313;
						font-size: 35upx;
						font-weight: blod;
						.price-sku {
							color: #999;
							font-size: 28upx;
							margin-left: 10upx;
							margin-right: 40upx;
							font-weight: normal;
						}
					}
				}
			}
		}
		.order-payPrice {
			color: #999;
			font-size: 26upx;
			margin: 0 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80upx;
			border-top: 1upx solid #EDEDED;
			.order-payPrice-num {
				color: #FF1313;
				font-size: 26upx;
			}
		}
	}
	.yt-list {
		background: #fff;
		margin: 30upx 20upx 0;
		border-radius: 15upx;
		padding-top: 30upx;
	}
	.yt-list-cell.pickAddress {
		display: flex;
		align-items: flex-start;
		.textarea {
			width: 80%;
			height: 100upx;
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
	.cu-timeline>.cu-item>.content {
		padding: 10upx;
		text{
			margin-right:20upx;
		}
	}
	.yt-list {
		.cu-timeline  {
			border-radius: 15upx;
			padding-bottom: 30upx;
		}
	}
</style>
