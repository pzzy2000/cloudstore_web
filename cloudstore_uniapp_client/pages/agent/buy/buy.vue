<template>
	<view>
		<nav-bar backState="1000">支付</nav-bar>
		<view class="goods-list">
			<view class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="goodsDetail.goodsPhotos[0].url" mode="aspectFill"></image>
				</view>
				<view class="goods-detail">
					<text class="title clamp">{{ goodsDetail.goodsName}}</text>
					<text class="title clamp subhead ">{{goodsDetail.goodsSubtitle}}</text>
					<view class="price-box">
						<view class="price">
							<text class="priceSale">{{price}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="num">
			<text>数量</text>
			<button @click="subtractNum">-</button>
			<text>{{num}}</text>
			<button @click="addNum()">+</button>
		</view>
		<view>
			<text>共计：</text>
			{{totalPrice}}
		</view>
		<view class="uni-form-item uni-column">
			<view class="title">支付方式</view>
			<view class="uni-list">
				<radio-group @change="radioChange" class="buy-type">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		<button type="primary" @click="buy">支付</button>
		<p></p>
		
	</view>
</template>
	</view>
<script>
	import navBar from '@/components/zhouWei-navBar';
    import Api from '@/common/api.js';
	export default {
		data() {
			return {
				goodsId: '',
				goodsDetail: '',
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
				vxCode: ''
			}
		},
		onLoad(option) {
			//这里的数据用来做测试
			// option.goodsId = "7604921082513985536"
			// option.price = '100'
			var that = this;
			this.price = option.price
			this.totalPrice = option.price
			this.getGoodsData(option.goodsId)
		},
		components: {
			navBar
		},
		methods: {
			async getGoodsData (goodsId) { //加载商品数据
				let params = { 
					goodsId: goodsId ,
				};
				let data = await Api.apiCall('post', Api.agent.goods.detail, params, false, false);
				if (data) {
					this.goodsDetail = data.result.goodsPicesBean
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
			buy () { //点击支付按钮
				var that = this;
				this.buyInfo = uni.getStorageSync('buyInfo')
				console.log(this.buyInfo)
				uni.login({
				    provider: 'weixin',
				    success: function (loginRes) {
					   let  vxCode = loginRes.code
					   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  "+vxCode);
					   uni.getProvider({ //获取支付的方式
					       service: 'payment',
					       success: function (res) {
					   		that.buyType = res.provider
					   		let params = {
					   			'bean.activityId': that.buyInfo.activityId,
					   			'bean.agentGoodsId': that.buyInfo.agentGoodsId,
					   			'bean.goodsId': that.buyInfo.goodsId,
					   			'bean.goodsSkuId': that.buyInfo.goodsSkuId,
					   			'bean.number': that.num,
					   			'bean.payPrice': that.totalPrice,
					   			'bean.price': that.price,
					   			'bean.payType': 'weixin'
					   		}
					   		uni.request({
					   			url: Api.BASEURI + Api.agent.buy.createOrder,
					   			method: 'post',
					   			header: {
					   				'content-type': 'application/x-www-form-urlencoded',
					   				'auth': uni.getStorageSync('token')
					   			},
					   			data: params,
					   			success: res => {
					   				var orderId = res.data.result.result.id
					   				if (res.data.result.code === 0) {
					   					let params = {
					   						'bean.code': vxCode,
					   						'bean.orderId': orderId
					   					}
					   					console.log(params)
					   					//预支付
					   					uni.request({
					   						url: Api.BASEURI + Api.agent.buy.prePay,
					   						method: 'post',
					   						header: {
					   							'content-type': 'application/x-www-form-urlencoded',
					   							'auth': uni.getStorageSync('token')
					   						},
					   						data: params,
					   						success: res => {
					   							console.log(res)
												if (res) {
													that.payMent(res)
												}
					   						},
					   						fail: (e) => {
					   							uni.showToast({
					   								title: '调用微信预支付失败',
					   								icon: 'none'
					   							});
					   						}
					   					});
					   				}
					   			},
					   			fail: (e) => {
					   				uni.showToast({
					   					title: '创建订单失败',
					   					icon: 'none'
					   				});
					   			}
					   		});
					       }
					   });
					   
					   
				    }
				});
			},
			payMent(res) {
				let vxBuyInfo = res.data.result.result
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
						console.log(res)
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						uni.showToast({
							icon: 'none',
							title: '支付失败'
						});
					},
					complete: function(res) {
						
					}
				});
			}
		}
	}
</script>

<style lang="scss">
/* 商品列表 */
.goods-list {
	display: flex;
	flex-wrap: wrap;
	padding: 10upx 30upx;
	background: #fff;
	.goods-item {
		display: flex;
		flex-direction: column;
		flex-flow: nowrap;
		width: 100%;
		padding-bottom: 40upx;
		// &:nth-child(2n + 1) {
		// 	margin-right: 4%;
		// }
	}
	.image-wrapper {
		width: 200upx;
		height: 200upx;
		border-radius: 3px;
		overflow: visible;
		image {
			width: 200upx;
			height: 200upx;
			opacity: 1;
			overflow: visible;
		}
	}
	.goods-detail {
		display: inline-block;
		width: 100%;
		padding: 0 30rpx;
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 70upx;
			width: 80%;
			display: inline-block;
		}
		.subhead {
			color: #333;
			font-size: 30upx;
		}
		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
			.price {
				.priceSale {
					font-size: 40upx;
					color: $uni-color-primary;
					line-height: 1;
					&:before {
						content: '￥';
						font-size: 26upx;
					}	
				}
				.pricemart {
					font-size: 25upx;
					color: #000;
					text-decoration:line-through;
					line-height: 1;
					&:before {
						content: '￥';
						font-size: 26upx;
					}	
				}
			}
			.goodsBtn {
				font-size: 30upx;
				color: #fff;
				background: red;
				height: 70upx;
				line-height: 70upx;
				width: 150upx;
				padding: 0;
				margin: 0;
			}
		}
	}
}
.num {
	display: flex;
}
.buy-type {
	display: flex;
	justify-content: flex-start;
	label {
		width: 50%;
		text-align: center;
	}
}
</style>
