<template>
	<view class="container">
		<!-- <nav-bar backState="1000" fontColor="#000" bgColor="#fff" class="nav-title">商品详情</nav-bar> -->
		<nav-bar fontColor="#000"  bgColor="#fff" title="商品详情" :titleCenter="true">
			<view class="icon_setUp" slot="left">
				<text class="cuIcon-home" @click.stop="toHome"></text>
			</view>
		</nav-bar>
		<text class="number-tip" v-if="!isBuyBtn">该商品已售空我们会尽快补货哦，明天再来吧~</text>
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in swiperImgList" :key="index">
					<view class="image-wrapper"><image :src="item" class="loaded" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
			<text class="title">{{ goods.goodsName }}</text>
			<view class="sub-title">{{ goods.goodsSubtitle }}</view>
			<view class="price-box">
				<text class="price price-symbol">{{ offlinePrice }}</text>/{{ goods.unit }}
				<text class="price-mart">销售价:{{ goodsSku.price }}</text>
			</view>
		</view>
		<view class="c-list">
			<view class="c-row" v-if="specSelected.length > 0">
				<text class="tit">产品规格</text>
				<view class="con">
					<text class="selected-text">{{ specSelected }}</text>
				</view>
				<!-- <text class="yticon icon-you"></text> -->
			</view>
			<view class="c-row">
				<text class="tit">活动内容</text>
				<view class="con-list">
					<text>{{activity.name}}</text>
				</view>
			</view>
			<view class="c-row" v-for="(item ,index) in propertyValue" :key='index' v-if='item[index]'>
				<text class="tit">{{item.goodsPropertyParamName}}</text>
				<view class="con-list">
					<text class="tit">{{item.propertyValue}}</text>
				</view>
			</view>
			<view class="c-row">
				<text class="tit">售后服务</text>
				<view class="con-list">
					<text>{{returnRule.title || '无'}}(详情见下文)</text>
				</view>
			</view>
		</view>
		<view class="detail-desc">
			<view class="detail-desc">
			    <view class="d-header"><text>图文详情</text></view>
			    <view class="ricetext">
					<rich-text :nodes="goodsHtml"></rich-text>
			    </view>
			</view>
		</view>
		<view class="detail-desc">
			<view class="detail-desc">
			    <view class="d-header"><text>售后说明</text></view>
			    <view class="ricetext returnRule">
					<rich-text :nodes="returnRule.desc"></rich-text>
			    </view>
			</view>
		</view>
		<view class="price-explain detail-desc ">
			<view class="d-header"><text class="text">价格说明</text></view>
			<view class="price-explain-main">
				<view class="explain-main-title">
					1.划线价格：
				</view>
				<text class="explain-main-text">
					指商品的专柜价、正品零售价、厂商指导价或该商品曾经展示过的销售价等，并非原件，仅供参考。
				</text>
				<view class="explain-main-title">
					2.未划线价格：
				</view>
				<text class="explain-main-text">
					指商品的实时标价，不因表述的差异改变性质。具体成交价根据商品参加活动，或会员使用优惠券、积分等发生变化，最终以订单结算页价格为准。
				</text>
				<view class="explain-main-end">
					3.商品详情页以图片或文字形式标注的一口价、促销价、优惠价等价格可能是在使用优惠券、满减或特定优惠活动、时段等情形下的价格，具体请以结算页面的标价、优惠条件或活动规则为准
				</view>
			</view>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<view class="action-btn-group">
				<button class="action-btn action-buy-btn" @click.stop="buy(buy)">立即购买</button>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<div class='sku-detail'>
					<view class="a-t">
						<image :src="sku.imgUrl"></image>
						<view class="right">
							<text class="price">¥ <text class="price-num">{{ sku.price }}</text></text>
							<text class="stock">库存：{{ sku.stock }}件</text>
							<view class="selected">
								已选：
								<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
							</view>
						</view>
					</view>
					<view v-for="(item, index) in specList" :key="index" class="attr-list">
						<text>{{ item.goodsPropertyParamName }}</text>
						<view class="item-list">
							<text
								v-for="(childItem, childIndex) in specChildList"
								v-if="childItem.pid === item.id"
								:key="childIndex"
								class="tit"
								:class="{ selected: childItem.selected }"
								@click="selectSpec(childIndex, childItem.pid)"
							>
								{{ childItem.name }}
							</text>
						</view>
					</view>
				</div>
				<view class="buyBtn">
					<button class="cu-btn" v-if="isBuyBtn" @click.stop="buy(buy)">确定</button>
					<button class="cu-btn zero" v-if="!isBuyBtn">暂时缺货</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Api from '@/common/api';
import navBar from '@/components/zhouWei-navBar';
import share from '@/components/share';
import uniPopup from '@/components/uni-popup/uni-popup'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
import hoverMenu from '@/components/hover-menu/hover-menu.vue'
let userInfo = uni.getStorageSync('userInfo');
var that = this;
export default {
	components: {
		share, uniPopup, uniPopupMessage, uniPopupDialog, navBar, hoverMenu
	},
	data() {
		return {
			fab: {
				show: true,
				left: 0,
				right: 80,
				bottom: 200,
				bgColor: "#5677fc",
				btnList: [],
				list: [{
					bgColor: "#16C2C2",
					//图标/图片地址
					imgUrl: "/static/images/fab/fab_about.png",
					//图片高度 rpx
					imgHeight: 64,
					//图片宽度 rpx
					imgWidth: 64,
					//名称
					text: "关于",
					//字体大小
					fontSize: 34,
					//字体颜色
					color: "#fff"
				}, {
					bgColor: "#64B532",
					//图标/图片地址
					imgUrl: "/static/images/fab/fab_share.png",
					//图片高度 rpx
					imgHeight: 64,
					//图片宽度 rpx
					imgWidth: 64,
					//名称
					text: "分享",
					//字体大小
					fontSize: 34,
					//字体颜色
					color: "#fff"
				}, {
					bgColor: "#FFA000",
					//图标/图片地址
					imgUrl: "/static/images/fab/fab_reward.png",
					//图片高度 rpx
					imgHeight: 64,
					//图片宽度 rpx
					imgWidth: 64,
					//名称
					text: "赞赏",
					//字体大小
					fontSize: 34,
					//字体颜色
					color: "#fff"
				}]
			},
			specClass: 'none',
			specSelected: [],
			small: [],
			sku: {
				price: '',
				stock: '',
			},
			propertyValue: '', //商品参数
			returnRule: '', //退货规则
			detailData: [],
			goods: {
				goodsName: '',
				goodsSubtitle: '',
				client: '',
				unit: ''
			},
			goodsSku: {
				price: ''
			},
			shareList: [
				{
				  icon: "/static/share_wechat.png",
				  text: "微信好友",
				  type: 1
				}
		    ],
			desc: ``,
			swiperImgList: [],
			skuList: [],
			agentId: '',
			imageUrl: '',//分享出去的图片
			goodsId:'',
			goodsName: '',
			goodsSkuId: '',  //具体商品的skuId
			agentGoodsId: '', //活动商品id
			activityId: '', //此商品的活动id
			activity:{
				name: '无活动'
			},
			shareId: '',
			shareClientId: '',
			goodsHtml: '',
			specList: [],
			specChildList: [],
			userType: 'Client',
			selectType: '',
			isBuyBtn: true,
			activityGoodsId: '',
			offlinePrice: ''
		};
	},
	onShareAppMessage(res) {
		var shareObj = {
			title: this.goodsName,
			imageUrl: this.imageUrl,
			params: {
				agentId: this.agentId,
				goodsId: this.goodsId,
				activityId: this.activityId,
				agentGoodsId: this.agentGoodsId,
				shareClientId: this.shareClientId || '-1',
				userType: 'Client'
			},
			path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&activityId='+this.activityId+'&agentId='+this.agentId,
		}
		return shareObj
	},
	onShow() {
	},
	onLoad(ops) {
		console.log(ops)
		this.activityGoodsId = ops.activityGoodsId
		this.agentId = ops.agentId
		this.getActivityGoodsById()
	},
	methods: {
		async getActivityGoodsById () {
			let params = {
				id: this.activityGoodsId
			}
			let data = await Api.apiCall('post', Api.client.belowTheLine.getActivityGoodsById, params, true);
			if (data) {
				var tmp = data.result
				this.goodsId = tmp.goodsId;
				// this.agentId = '-1'
				this.goodsSkuId = tmp.goodsSkuId;
				this.goodsSku = tmp.goodsSkuBean
				this.activityId = tmp.activityId
				this.getGoodsDetail(this.goodsId,this.activityGoodsId);
				this.shareClientId = '-1'
				this.offlinePrice = tmp.offlinePrice
				//赋值默认商品价格，库存和图片
				this.skuList = tmp.goodsSkuBean
				this.sku.price = tmp.price
				this.sku.stock = tmp.stock
				this.specSelected = tmp.goodsSkuBean.skuValue
			}
		},
		shareAmount () { //处理分享出去的金额
			this.goods.client= Api.ishareAmount(this.goods);
		},
		async getGoodsDetail (goodsId,agentGoodsId) { //获取商品详情
			let params = {
				goodsId: goodsId ,
				agentGoodsId: agentGoodsId,
			}
			let data = await Api.apiCall('post', Api.agent.goods.agentGoodsDetail, params, true, false);
			if (data) {
				this.goods = data.result.goodsPicesBean;
				this.propertyValue = data.result.goodsPropertyValue //商品参数
				this.returnRule = data.result.goodsPicesBean.returnRuleBean
			}
			//遍历数据获取图片
			if (data.result.goodsPicesBean.goodsDetailPhotos) {
				let goodsImg = data.result.goodsPicesBean.goodsDetailPhotos
				for (let data in goodsImg) {
					if (goodsImg[data].url != false) {
						this.swiperImgList.push(goodsImg[data].url)
					}
				}
			}
			try{
				this.loadMobileHtml()
			}catch(e){
				this.$api.msg('获取商品图文信息失败')
			}
			try{
				if(this.activityId){
					if(this.activityId<=0)return;
					let params = {
						activityId:this.activityId
					};
					let data = await Api.apiCall('post', Api.agent.activity.searchInfo, params, true, false);
					if (data) {
						this.activity = data.result
					}
				}
			}catch(e){
				this.$api.msg('获取活动信息失败')
			}
		},
		async loadMobileHtml () {//获取商品的图文详情
			let params = {
				goodsId: this.goodsId
			}
			let data = await Api.apiCall('post', Api.agent.goods.loadHtml, params,true,0);
			if (data) {
				this.goodsHtml = data.result.mobileHtml
			}
		},
		buy () { //点击支付按钮
			Api.debounce(this.toBuy, 3000, true);
		},
 		toBuy() { //点击立即购买
			if (this.sku.stock <= 0) {
				this.$api.msg('库存不足')
				return false;
			}
			var buyInfo = {
				agentId: this.agentId,
				activityId: this.activityId,
				agentGoodsId: this.activityGoodsId,
				goodsId: this.goodsId,
				goodsSkuId: this.goodsSkuId,
				shareId: '-1',
				price: this.offlinePrice,
				shareClientId: '-1',
				actionType: 'belowTheLine'
			}
			uni.setStorageSync('goodsInfo',buyInfo)
			var params = {
				transportAgentId: '-1',
				transportType: 40,
				clientAddressId: -1,
				payType: 'weixin',
				detail: [{
					activityId: this.activityId,
					agentGoodsId: this.agentId,
					goodsId: this.goodsId,
					goodsSkuId: this.goodsSkuId,
					number: 1,
					payPrice: this.offlinePrice,
					price: this.offlinePrice,
					shareId: '-1'
				}]
			}
			var that = this
			if (Api.isToken()) { //先判断有没有登录
				uni.login({
					provider: 'weixin',
					success: function (loginRes) {
						let  vxCode = loginRes.code;
						Api.apiCallbackCall("POST", Api.client.belowTheLine.createOffLineOrder, params, true, false, function(data){
							if (data.code === 0) {
								let re =data.result;
								let params = {
									'code': vxCode,
									'orderId': re.id
								}
								that.orderId = re.id
								Api.apiCallbackCall("POST", Api.client.buy.prePay, params, true, true, function(da_ta){
									if (da_ta) {
										that.payMent(da_ta)
									} else {
										uni.showToast({
											title: '支付失败',
											duration: 1500,
											icon: 'none'
										});
									}
								});
								// that.payMent(data)
							} else {
								uni.showToast({
									title: data.msg,
									duration: 1500,
									icon: 'none'
								});
							}
						})
					}
				})
			}
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
									url: '/pages/client/goods/buySuccess?orderId='+that.orderId+'&price='+that.offlinePrice,
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
						}
					})  
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		async paySuccess (id) {
			let parmas = {
				orderId: id
			}
			let data = Api.apiCall('post', Api.client.buy.paySuccess,parmas, true)
			if (data) {
				console.log(data)
			}
		},
		toHome () {
			uni.switchTab({
				url:"/pages/agent/goods/hotsale/hotsale"
			})
		}
	}
};
</script>

<style lang="scss">
.container {
	background: $page-color-base;
	padding-bottom: 160upx;
	.nav-title {
		box-shadow: 5upx 5upx 4upx rgb(241,241,241);
	}
}
.icon_setUp {
	margin-left: 20upx;
	.cuIcon-home {
		font-size: 40upx;
	}
}
.icon-you {
	font-size: $font-base + 2upx;
	color: #888;
}
.number-tip {
	position: fixed;
	bottom: 128upx;
	z-index: 2;
	width: 100%;
	height: 70upx;
	line-height: 70upx;
	text-align: center;
	background-color: #3BA9FF;
	color: #fff;
	font-size: 28upx;
	letter-spacing: 2upx;
}
.carousel {
	height: 722upx;
	position: relative;
	swiper {
		height: 100%;
	}
	.image-wrapper {
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		height: 750upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 标题简介 */
.introduce-section {
	background: #fff;
	padding: 20upx 30upx;
	margin-top: 10upx;
	.title {
		font-size: 34upx;
		color: #333333;
		height: 50upx;
		line-height: 50upx;
		white-space: 10upx;
	}
	.sub-title {
		color: #999999;
		font-size: 26upx;
		line-height: 50upx;
	}
	.price-box {
		display: flex;
		height: 64upx;
		line-height: 64upx;
		font-size: 26upx;
		color: #999999;
		.price-mart {
			text-decoration: line-through;
			display: inline-block;
			margin-left: 20upx;
		}
	}
	.price {
		color: #FF1313;
		font-size: 34upx;
		white-space: 5upx;
		margin-left: 5upx;
	}
	.m-price {
		margin: 0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
	}
	.coupon-tip {
		align-items: center;
		padding: 4upx 10upx;
		background: $uni-color-primary;
		font-size: $font-sm;
		color: #fff;
		border-radius: 6upx;
		line-height: 1;
		transform: translateY(-4upx);
	}
	.bot-row {
		display: flex;
		align-items: center;
		height: 50upx;
		font-size: $font-sm;
		color: $font-color-light;
		text {
			flex: 1;
		}
	}
}
/* 分享 */
.share-section {
	display: flex;
	align-items: center;
	color: $font-color-base;
	background: linear-gradient(left, #fdf5f6, #fbebf6);
	padding: 12upx 30upx;
	.share-icon {
		display: flex;
		align-items: center;
		width: 70upx;
		height: 30upx;
		line-height: 1;
		border: 1px solid $uni-color-primary;
		border-radius: 4upx;
		position: relative;
		overflow: hidden;
		font-size: 22upx;
		color: $uni-color-primary;
		&:after {
			content: '';
			width: 50upx;
			height: 50upx;
			border-radius: 50%;
			left: -20upx;
			top: -12upx;
			position: absolute;
			background: $uni-color-primary;
		}
	}
	.icon-xingxing {
		position: relative;
		z-index: 1;
		font-size: 24upx;
		margin-left: 2upx;
		margin-right: 10upx;
		color: #fff;
		line-height: 1;
	}
	.tit {
		font-size: $font-base;
		margin-left: 10upx;
	}
	.icon-bangzhu1 {
		padding: 10upx;
		font-size: 30upx;
		line-height: 1;
	}
	.share-btn {
		flex: 1;
		text-align: right;
		font-size: $font-sm;
		color: $uni-color-primary;
	}
	.icon-you {
		font-size: $font-sm;
		margin-left: 4upx;
		color: $uni-color-primary;
	}
}

.c-list {
	color: #333333;
	font-size: 26upx;
	.c-row {
		display: flex;
		align-items: center;
		padding: 0 30upx;
		line-height: 80upx;
		position: relative;
		margin-bottom: 5upx;
		background: #F5F5F5;
	}
	.tit {
		width: 140upx;
		color: #656565;
	}
	.con {
		flex: 1;
		color: $font-color-dark;
		.selected-text {
			margin-right: 10upx;
		}
	}
	.bz-list {
		height: 40upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		text {
			display: inline-block;
			margin-right: 30upx;
		}
	}
	.con-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		color: $font-color-dark;
		line-height: 40upx;
	}
	.red {
		color: $uni-color-primary;
	}
}

/* 评价 */
.eva-section {
	display: flex;
	flex-direction: column;
	padding: 20upx 30upx;
	background: #fff;
	margin-top: 16upx;
	.e-header {
		display: flex;
		align-items: center;
		height: 70upx;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		.tit {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 4upx;
		}
		.tip {
			flex: 1;
			text-align: right;
		}
		.icon-you {
			margin-left: 10upx;
		}
	}
}
.eva-box {
	display: flex;
	padding: 20upx 0;
	.portrait {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		border-radius: 100px;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 34upx;
		letter-spacing: 4upx;
		color: #FF1313;
		padding-left: 26upx;
		.con {
			font-size: $font-base;
			color: $font-color-dark;
			padding: 20upx 0;
		}
		.bot {
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
}

/* 规格选择弹窗 */
.attr-content {
	position: relative;
	.sku-detail {
	  padding: 0 40rpx 50rpx 40rpx;
	}
	.a-t {
		display: flex;
		image {
			width: 180upx;
			height: 180upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
			box-shadow: 0 0 4upx rgba(0, 0, 0, 0.5);
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			font-size: 26upx;
			color: #999;
			line-height: 42upx;
			.price {
				color: #FF1313;
				margin: 20upx 0 10upx 0;
				.price-num {
					font-size: 34upx;
					margin-left: 10upx;
				}
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.attr-list {
		display: flex;
		flex-direction: column;
		font-size: 32upx;
		color: #333333;
		letter-spacing: 4upx;
		padding-top: 30upx;
		padding-left: 10upx;
	}
	.item-list {
		padding: 20upx 0 0;
		display: flex;
		flex-wrap: wrap;
		text {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #F1F1F1;
			margin-right: 20upx;
			margin-bottom: 20upx;
			border-radius: 30upx;
			min-width: 60upx;
			font-size: 26upx;
			min-width: 160upx;
			padding: 0 25upx;
			height: 60upx;
			color: #999999;
		}
		.selected {
			background: linear-gradient(-90deg, #39A9FF, #6BBFFF);
			color: #FFFFFF;
		}
	}
	.buyBtn {
		width: 100%;
		padding: 0 40upx;
		margin-bottom: 36upx;
		.cu-btn {
			width: 100%;
			height: 60upx;
			line-height: 60upx;
			background: linear-gradient(-90deg, #39A9FF, #6BBFFF);
			font-size: 34upx;
			font-weight: blod;
			letter-spacing: 4upx;
			border-radius: 30upx;
			color: #fff;
		}
		.zero {
			color: #666;
			background: #f5f5f5;
		}
	}
}

/*  弹出层 */
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask {
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}

/* 底部操作菜单 */
.page-bottom {
	position: fixed;
	left: 0;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	justify-content: space-around;
	align-items: center;
	width:100%;
	height: 100upx;
	.action-btn-group {
		display: flex;
		width:100%;
		padding: 0 40upx;
		.action-btn {
			width:100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			height: 72upx;
			border-radius: 36upx;
			font-size: 30upx;
			letter-spacing: 4upx;
			margin-right: 10upx;
			&:after {
				border: none;
			}
		}
		.action-buy-btn {
			background-image: linear-gradient(-90deg, #39A9FF, #6BBFFF);
		}
	}
}
/* 分类推荐楼层 */
.hot-floor {
	width: 100%;
	overflow: hidden;
	margin-bottom: 20upx;
	.floor-img-box {
		width: 100%;
		height: 220upx;
		position: relative;
		display: flex;
		&:after {
			padding: 10 30upx;
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
		}
	}
	.name {
		font-size: 30upx;
		color: $font-color-base;
		margin-left: 24upx;
	}
	.floor-img {
		width: 100%;
		height: 100%;
	}
	.floor-list {
		white-space: nowrap;
		padding: 20upx;
		padding-right: 50upx;
		border-radius: 6upx;
		margin-top: -140upx;
		margin-left: 30upx;
		background: #fff;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}
	.scoll-wrapper {
		display: flex;
		align-items: flex-start;
	}
	.floor-item {
		width: 180upx;
		margin-right: 20upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		line-height: 1.8;
		image {
			width: 100upx;
			height: 180upx;
			border-radius: 6upx;
		}
		.price {
			color: $uni-color-primary;
		}
	}
	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-shrink: 0;
		width: 180upx;
		height: 180upx;
		border-radius: 6upx;
		background: #f3f3f3;
		font-size: $font-base;
		color: $font-color-light;
		text:first-child {
			margin-bottom: 4upx;
		}
	}
}
/*  详情 */
.detail-desc {
 background: #fff;
 //margin-top: 16upx;
 width: 100%;
 //margin:5px auto 20px;
 text-align: justify;
 font-size: 16px;
 .d-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80upx;
  font-size: $font-base + 2upx;
  color: $font-color-dark;
  position: relative;

  text {
   padding: 0 20upx;
   background: #fff;
   position: relative;
   z-index: 1;
  }
  &:after {
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translateX(-50%);
   width: 300upx;
   height: 0;
   content: '';
   border-bottom: 1px solid #ccc;
  }
 }
 .ricetext {
  margin: 0 auto;
  text-align: justify;
  font-size: 17upx;
 }
 .returnRule {
	width: 100%;
	overflow: hidden;
 }
}
.price-explain {
	width: 100%;
	background: #fff;
	.price-explain-main {
		width: 90%;
		margin: 0 auto;
		font-size: 26upx;
		color: #999;
		.explain-main-title {
			line-height: 60upx;
		}
		.explain-main-text {
			text-indent: 20upx;
			display: inline-block;
		}
		.explain-main-end {
			display: inline-block;
			margin-top: 20upx;
		}
	}
}
</style>
