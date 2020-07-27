<template>
	<view class="content">
		<nav-bar backState="1000">我的订单</nav-bar>
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

		<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
				> -->
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view v-for="(item,index) in orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">订单号: {{item.id}}</text>
							<template>
								<text class="state" v-if="item.orderBean.orderStatus === 'wait'">待支付</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'pay'">支付待确认</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'payed'">已支付</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'close'">超时关闭</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'peisong'">待配送</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'peisoged'">已配送</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'complete'">已完成</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'returns'">退货</text>
								<text class="state" v-else-if="item.orderBean.orderStatus === 'retud'">已退货</text>
							</template>
						</view>
						<view class="goods-box-single" :key="index" @click="toOrder(item)">
							<image class="goods-img" :src="item.detailPicBean[0].goodsPicesBean.goodsPhotos[0].url" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{item.detailPicBean[0].goodsPicesBean.goodsName}}</text>
								<text class="attr-box">{{item.detailPicBean[0].activityBean.name}}</text>
								<view class="price">
									<text>总价: ￥{{item.payPrice}}</text>
									<text>订单时间: {{item.createTime}}</text>
								</view>
							</view>
						</view>
					</view>
				<!-- </scroll-view>
			</swiper-item>
		</swiper> -->
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
						text: '已支付',
						type: 'payed',
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
						text: '已完成',
						type: 'complete',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '其他',
						type: 'more',
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
					this.orderStatus = 'payed'
					break;
					case 2:
					this.orderStatus = 'peisong'
					break;
					case 3:
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
		created() {
		},
		methods: {
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
									if (tmpData[tmp].orderStatus === 'payed') {
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
									if (tmpData[tmp].orderStatus === 'complete') {
										this.orderList.push(tmpData[tmp])
									}
								}
							break;
							case 4:
								this.$api.msg('敬请期待')
							break;
						}
					}
					uni.stopPullDownRefresh();
					uni.hideLoading()
				}
				console.log(this.orderList)
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				// this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(item){
				if (item.state === 4) {
					this.$api.msg('敬请期待')
					return false;
				}
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
					url: '/pages/client/goods/buy?goodsId='+item[0].goodsId+'&agentGoodsId='+item[0].agentGoodsId+'&goodsSkuId='+item[0].goodsSkuId+'&orderType=buyOrder'+'&orderId='+item[0].orderId
				});
			},
		},
	}
</script>

<style lang="scss">
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
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding:0 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
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
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10rpx 30rpx;
					height: 45%;
				}
				.price{
					font-size: 24upx;
					color: $font-color-dark;
					display: flex;
					justify-content: space-between;
				// 	&:before{
				// 		content: '￥';
				// 		font-size: $font-sm;
				// 		margin: 0 2upx 0 8upx;
				// 	}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
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
</style>
