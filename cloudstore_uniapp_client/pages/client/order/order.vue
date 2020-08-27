<template>
	<view class="content">
		<nav-bar backState="3000" @backClick='toInfo'>我的订单</nav-bar>
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(item)"
			>
				{{item.text}}
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view v-for="(item,index) in orderList" :key="index" class="order-item" v-if="orderList.length != 0">
			<view class="i-top">
				<text class="time">订单号: {{item.number}}</text>
				<template>
					<text class="state" v-if="item.orderStatus === 'wait'">关闭时间：{{item.endTime}}</text>
					<text class="state" v-else-if="item.orderStatus === 'pay'">支付待确认</text>
					<text class="state" v-else-if="item.orderStatus === 'payed'">已支付</text>
					<text class="state" v-else-if="item.orderStatus === 'peisong'">待配送</text>
					<text class="state" v-else-if="item.orderStatus === 'refunding'">退款中</text>
					<text class="state" v-else-if="item.orderStatus === 'refunded'">已退款</text>
					<text class="state" v-else-if="item.orderStatus === 'peisoged'">已配送</text>
					<text class="state" v-else-if="item.orderStatus === 'complete'">已完成</text>
					<text class="state" v-else-if="item.orderStatus === 'returnsing'">退货中</text>
					<text class="state" v-else-if="item.orderStatus === 'returns'">已退货</text>
					<text class="state" v-else-if="item.orderStatus === 'close'">超时关闭</text>
				</template>
			</view>
			<view class="goods-box-single" v-for="(order, index1) in item.detailPicBean" :key="index1" @click="toOrder(item)">
				<image class="goods-img" :src="order.goodsSkuBean.photos[0].url || order.goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image>
				<view class="right">
					<text class="title clamp">{{order.goodsPicesBean.goodsName}}</text>
					<text class="subtitle clamp">{{order.goodsPicesBean.goodsSubtitle}}</text>
					<view class="detail-price">
						<view class="price-num price-symbol">{{order.goodsSkuBean.price}} <text class="price-sku">/{{order.goodsSkuBean.skuValue}}</text> </view>
						<text>× {{order.quantity}}</text>
					</view>
					<!-- <view class="attr-box">
						{{order.price}} 
						<view> /{{order.goodsSkuBean.skuValue}}</text>
						<text>订单时间: {{order.createTime}}</text>
					</view> -->
				</view>
				<view class="flex align-center">
					<view class="status" v-if="order.status === 'WaitDeliver'">待发货</view>
					<view class="status" v-else-if="order.status === 'peisoged'">已配送</view>
					<view class="status" v-else-if="order.status === 'returnsing'">退货中</view>
					<view class="status" v-else-if="order.status === 'refunding'">退款中</view>
					<view class="status" v-else-if="order.status === 'refunded'">已退款</view>
					<view class="status" v-else-if="order.status === 'returns'">退货成功</view>
					<view class="status" v-else-if="order.status === 'returnsfail'">退货拒绝</view>
					<view class="status" v-else-if="order.status === 'delivered'">已收货</view>
				</view>
			</view>
			<view class="i-top">
				<text>订单时间: {{item.createTime}}</text>
				<view class="price-box">
					<text class="num">总价:</text>
					<text class="price">{{item.payPrice}}</text>
				</view>
			</view>
			<template>
				<!-- 待支付 -->
				<view class="padd-tb-sm text-right state-btn" v-if="item.orderStatus === 'wait'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
					<button class="cu-btn round" @click.stop="toBuy(item)">立即支付</button>
				</view>
				<!-- 支付待确认 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'pay'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 已支付 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'payed'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 待配送 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'peisong'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
					<button class="cu-btn round" @click="refund(item)">申请退款</button>
				</view>
				<!-- 已配送 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'peisoged'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
					<button class="cu-btn round" @click.stop="confirmOrder(item)">确认收货</button>
					<button class="cu-btn round" @click.stop="toAfterSale('/pages/client/order/afterSale',item)">申请售后</button>
				</view>
				<!-- 退款中 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'refunding'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 已退款 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'refunded'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 已完成 -->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'complete'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 退货-->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'returnsing'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 已退货-->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'returns'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
				<!-- 超时关闭-->
				<view class="margin-tb-sm text-right state-btn" v-if="item.orderStatus === 'close'">
					<button class="cu-btn round" @click.stop="toOrder(item)">查看订单</button>
				</view>
			</template>
		</view>
		
		<view class="earning-empty" v-if="!orderList.length">
			<image src="../../../static/client/earning-logo.png" mode="" class="earning-logo"></image>
			<view class="earning-empty-text">暂无订单哦</view>
		</view>
	</view>
</template> 

<script>
	import Api from '@/common/api.js'
	import navBar from '@/components/zhouWei-navBar';
	import empty from "@/components/empty";
	// import Json from '@/Json';
	export default {
		components: {
			empty,
			navBar
		},
		data() {
			return {
				tabCurrentIndex: 0,
				orderStatus: '',
				orderList: [],
				pageNum: 1,
				navList: [{
						state: 0,
						text: '全部',
						type: '',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待支付',
						type: 'wait',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待配送',
						type: 'peisong',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已配送',
						type: 'peisoged',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '已完成',
						type: 'complete',
						loadingType: 'more',
						orderList: []
					}
				],
				goodsDetail: ''
			};
		},
		onLoad(options){
			if (options.status) {
				this.tabCurrentIndex = Number(options.status)
				switch (this.tabCurrentIndex) {
					case 0:
					this.orderStatus = ''
					break;
					case 1:
					this.orderStatus = 'wait'
					break;
					case 2:
					this.orderStatus = 'peisong'
					break;
					case 3:
					this.orderStatus = 'peisoged'
					break;
					case 4:
					this.orderStatus = 'complete'
					break;
				}
			}
			this.getOrderData(this.tabCurrentIndex)
		},
		onPullDownRefresh() { //下拉刷新
			this.pageNum = 1
			this.orderList = []
			this.getOrderData(this.tabCurrentIndex);
		},
		onReachBottom() { //上拉加载
		 	this.pageNum = this.pageNum + 1;
			this.getOrderData(this.tabCurrentIndex)
		},
		methods: {
			toInfo () {
				uni.switchTab({
					url:"/pages/client/info/index"
				})
			},
			async getOrderData (tabIndex = 0) {
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let parmas = {
					orderStatus: this.orderStatus,
					pageNum: this.pageNum,
					pageSize: 10
				}
				let data = await Api.apiCall('post',Api.client.order.getClientOrder,parmas)
				if (data) {
					const tmpData = data.result.records
					if(tmpData.length === 0) {
						this.$api.msg('暂无更多数据了')
					}else{
						switch (tabIndex) {
							case 0:
								for (let tmp in tmpData) {
									this.orderList.push(tmpData[tmp])
								}
							break;
							case 1:
								for (let tmp in tmpData) {
									if (tmpData[tmp].orderStatus === 'wait') {
										this.orderList.push(tmpData[tmp])
									}
								}
							break;
							case 2:
								for (let tmp in tmpData) {
									if (tmpData[tmp].orderStatus === 'peisong') {
										this.orderList.push(tmpData[tmp])
									}
								}
							break;
							case 3:
								for (let tmp in tmpData) {
									if (tmpData[tmp].orderStatus === 'peisoged') {
										this.orderList.push(tmpData[tmp])
									}
								}
							break;
							case 4:
								for (let tmp in tmpData) {
									if (tmpData[tmp].orderStatus === 'complete') {
										this.orderList.push(tmpData[tmp])
									}
								}
							break;
						}
					}
					uni.stopPullDownRefresh();
					uni.hideLoading()
				}
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				// this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(item){
				this.orderStatus = item.type
				this.pageNum = 1
				this.orderList =[]
				this.tabCurrentIndex = item.state;
				this.getOrderData(this.tabCurrentIndex)
			},
			//删除订单
			deleteOrder(index){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			toOrder (item) {
				uni.navigateTo({
					url: '/pages/client/order/orderDetail?orderId='+item.id+'&price='+item.payPrice,
				});
			},
			toBuy (item) {
				uni.navigateTo({
					url: '/pages/client/goods/buy?orderId='+item.id
				});
			},
			toAfterSale (url,order) { 
				uni.navigateTo({
					url: url+'?id=' + order.id,
				});
			},
			initData () {
				this.pageNum = 1
				this.orderList = []
				this.getOrderData(this.tabCurrentIndex)
			},
			refund (item) { //点击退款按钮
				uni.showModal({
					title: '退款确认',
					content: '您确定申请退款？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.setRefund(item)
						} else if (res.cancel) {
						}
					},
				});
			},
			async setRefund (item) { //调用退款接口
				let parmas = {
					id: item.id
				}
				let data = await Api.apiCall('post',Api.client.buy.refundOrder,parmas,true)
				if (data) {
					if (data.code ===0) {
						this.initData()
						this.$api.msg('申请退款成功')
					} else {
						this.$api.msg(code.msg)
					}
				}
			},
			async confirmOrder (item) { //点击确认收货按钮
				uni.showModal({
					title: '收货确认',
					content: '您确定已收到货物？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.setConfirmOrder(item)
						} else if (res.cancel) {
						}
					},
				});
			},
			async setConfirmOrder (item) { //调用确认收货接口
				let parmas = {
					id: item.id
				}
				let data = await Api.apiCall('post',Api.client.order.confirmOrder,parmas,true)
				if (data) {
					if (data.code ===0) {
						this.initData()
						this.$api.msg('确认收货成功')
					} else {
						this.$api.msg(code.msg)
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: #41b0ff;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #41b0ff;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.earning-empty {
		padding-top: 100upx;
		.earning-logo {
			width: 300upx;
			height: 180upx;
			margin: 0 auto;
			display: block;
		}
		.earning-empty-text {
			color: #999999;
			font-size: 30upx;
			white-space: 5upx;
			line-height: 150upx;
			width: 100%;
			text-align: center;
			display: block;
		}
		.earning-empty-btn {
			color: #F1F1F1;
			background-color: #39A9FF;
			white-space: 5upx;
			width: 500upx;
			height: 72upx;
			text-align: center;
			border: none;
			border-radius: 36upx;
			&:after {
				border: none
			}
		}
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding:0 30upx;
		background: #fff;
		margin-top: 16upx;
		box-shadow: 0 0 4upx rgba(0, 0, 0, 0.1);
		.i-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80upx;
			font-size: 22upx;
			color: #999999;
			.time {
				color: #333333;
				font-size: 24upx;
			}
			.state {
				color: #49B1FD;
				font-size: 24upx;
			}
			.price-box {
				color: #999;
				font-size: 22upx;
				.num {
					color: #656565;
					font-size: 24upx;
				}
				.price {
					color: #FF1313;
					font-size: 32upx;
					font-weight: bold;
				}
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 172upx;
				height: 172upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: 32upx;
					color: #333333;
					line-height: 1;
					letter-spacing: 4upx;
					line-height: 50upx;
				}
				.subtitle {
					color: #999999;
					line-height: 50upx;
					font-size: 24upx;
				}
				.detail-price {
					color: #333333;
					font-size: 32upx;
					display: flex;
					justify-content: flex-start;
					width: 100%;
					line-height: 50upx;
					.price-num {
						color: #FF1313;
						font-size: 32upx;
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
			.flex {
				.status {
					font-size: 20upx;
					color: #666;
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 0;
			font-size: 32upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
	.cu-btn {
		margin-left: 10upx;
	}
	.state-btn {
		padding: 20upx 0;
		margin: 0;
		border-top: 1upx solid #eee;
		.cu-btn {
			background-image: linear-gradient(#39A9FF, #2D9BEF);
			color: #fff;
		}
	}
</style>
