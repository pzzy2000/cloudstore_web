<template>
	<view class="container">
		<nav-bar backState="1000" fontColor="#000" bgColor="#fff" class="nav-title">商品详情</nav-bar>
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
				<text class="price price-symbol">{{ sku.price }}</text>/{{ goods.unit }}
			</view>
		</view>
		<view class="c-list">
			<view class="c-row" v-if="specList && specList.length > 0" @click="toggleSpec">
				<text class="tit">产品规格</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
				</view>
				<text class="yticon icon-you"></text>
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
			<view class="p-b-btn" @click.stop="toIndex">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</view>
			<view class="p-b-btn" @click.stop="toggleSpec('cart')">
				<text class="yticon icon-gouwuche "></text>
				<text>加入购物车</text>
			</view>
			<view class="action-btn-group">
				<button class="action-btn action-buy-btn" @click.stop="toggleSpec('buy')">立即购买</button>
				<!-- <button type="primary" class=" action-btn no-border add-cart-btn" v-if="!shareClientId" @click="toApply">申请团长</button> -->
				<button class="action-btn action-share-btn" @click.stop="shareSave">分享赚￥{{ goods.client }}</button>
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
					<button class="cu-btn" v-if="isBuyBtn" @click.stop="toBuy(buy)">确定</button>
					<button class="cu-btn zero" v-if="!isBuyBtn">暂时缺货</button>
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
		<hover-menu></hover-menu>
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
			isBuyBtn: true
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
		this.goodsId = ops.goodsId;
		this.agentGoodsId = ops.agentGoodsId //活动商品id
		// this.userType = ops.userType
		this.agentId = ops.agentId
		// uni.setStorageSync('agentId', this.agentId)
		this.activityId = ops.activityId
		this.getGoodsDetail(this.goodsId,this.agentGoodsId);
		if ( ops.shareClientId == undefined) {
			this.shareClientId = '-1'
		}else{
			this.shareClientId = ops.shareClientId
		}
	},
	methods: {
		shareAmount () { //处理分享出去的金额
			this.goods.client= Api.ishareAmount(this.goods);
			// console.log(this.goods)
		},
		async getGoodsDetail (goodsId,agentGoodsId) { //获取商品详情
			let params = {
				goodsId: goodsId ,
				agentGoodsId: agentGoodsId,
			}
			let data = await Api.apiCall('post', Api.agent.goods.agentGoodsDetail, params, true, false);
			if (data) {
				this.goods = data.result.goodsPicesBean;
				this.activity = data.result.activityBean;
				this.goodsName = data.result.goodsPicesBean.goodsName
				this.propertyValue = data.result.goodsPropertyValue //商品参数
				this.returnRule = data.result.goodsPicesBean.returnRuleBean
				this.imageUrl = data.result.goodsPicesBean.sharePicsUrl
				this.skuList = data.result.goodsSku
				//赋值默认商品价格，库存和图片
				this.sku.price = this.skuList[0].price
				this.sku.stock = this.skuList[0].stock
				this.isBuyBtn =  this.sku.stock ? true : false
				try{
					if (this.skuList[0].photos[0]) {
						this.sku.imgUrl = this.skuList[0].photos[0].url
					}
				}catch(e){
					console.log('sku图片出错')
				}
				this.goodsSkuId = this.skuList[0].id
				//遍历商品数据展示规格（可以选择的商品属性集合）
				for (let index in data.result.goodsPropertyValue) {
					if (data.result.goodsPropertyValue[index].propertyType == 0) {
						this.specList.push(data.result.goodsPropertyValue[index])
					}
				}
				//处理规格选择额数据（显示可看见的按钮）
				if (this.specList){
					this.specList.forEach(item => {
						let valuesA = item.propertyValue.split(',');
						if (valuesA) {
							for (let cItem of valuesA) {
								let att = {};
								att.pid = item.id;
								att.name = cItem;
								this.specChildList.push(att);
							}
						}
					})
				}
				//默认选中的规格数据
				var specs = ''
				this.specList.forEach(item => {
					for (let cItem of this.specChildList) {
						if (cItem.pid === item.id) {
							this.$set(cItem, 'selected', true);
							this.specSelected.push(cItem);
							specs = cItem.name + ',' + specs;
							break; //forEach不能使用break
						}
					}
				});
				//遍历数据获取图片
				if (data.result.goodsPicesBean.goodsDetailPhotos) {
					let goodsImg = data.result.goodsPicesBean.goodsDetailPhotos
					for (let data in goodsImg) {
						if (goodsImg[data].url != false) {
							this.swiperImgList.push(goodsImg[data].url)
						}
					}
				}
			}
			this.shareAmount()
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
		selectSpec(index, pid) { //选择规格
			//将选中的属性放入
			let list = this.specChildList;
			list.forEach(item => {
				if (item.pid === pid) {
					this.$set(item, 'selected', false);
				}
			});
			this.$set(list[index], 'selected', true);
			var specs = '';
			this.specSelected = [];
			if (list){
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
						specs = item.name + ',' + specs;
					}
				});
				let specArray  = [];
				for (let data in this.specSelected) {
					specArray.push(this.specSelected[data].name)
				}
				specArray.join(',')
				for (let data in this.skuList) {
					var skuValue =  this.skuList[data].skuValue.split(',').sort().toString()
					if (specArray.sort().toString() === skuValue) {
						this.goodsSkuId = this.skuList[data].id
						this.sku.stock = this.skuList[data].stock
						this.sku.price = this.skuList[data].price
						this.isBuyBtn =  this.sku.stock ? true : false
						try{
							this.sku.imgUrl = this.skuList[data].photos[0].url
							this.imageUrl = this.skuList[data].photos[0].url
						}catch(e){
							console.log('sku图片出错')
						}
						break;
					}
				}
			}
		},
		toPage(url){
			uni.navigateTo({
				url: url,
			});
		},
		openAgent () {
			this.$refs.popup.open()
		},
		closeAgentDialog () {
			this.$refs.popup.close()
		},
		confirmAgentDialog () {
			this.joinAgent()
			this.$refs.popup.close()
		},
		async joinAgent () { //将商品加入代理
			let params = {
				goodsId: this.goodsId,
				activeId: this.activityId || -1
			}
			let data = await Api.apiCall('post', Api.agent.goods.save, params, true);
			if (data) {
				if (data.code === 0) {
					uni.showToast({
						title: '加入代理成功',
						icon: 'none'
					});
					if (this.specClass == 'show') {
						this.specClass = 'hide'
					}
				}
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
		toggleSpec(type) { //规格弹窗开关
			this.selectType = type
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		share() { //分享显示弹窗
			this.$refs.share.toggleMask();
		},
		toApply () {
			uni.showModal({
				title: '申请团长',
				content: '请联系客服',
				showCancel: false,
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
				},
			});
		},
		async shareSave () { //分享调用接口
			var goodsInfo = {
				agentId: this.agentId,
				activityId: this.activityId,
				agentGoodsId: this.agentGoodsId,
				goodsId: this.goodsId,
				goodsSkuId: this.goodsSkuId,
				shareId: this.shareId,
				price: this.sku.price,
				shareClientId: this.shareClientId
			}
			uni.setStorageSync('goodsInfo',goodsInfo)
			if (Api.isToken()) {
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				let params = {
					// 'agentGoodsId': this.agentGoodsId,
					'agentId': this.agentId,
					'goodsId': this.goodsId,
					'activityId': this.activityId,
					'shareId': this.shareClientId || '-1',
					'type': ''
				} 
				let data = await Api.apiCall('post', Api.agent.share.save, params, true);
				if (data) {
					uni.hideLoading() 
					if (data.code === 0) {
						this.shareClientId = data.result.id
						if (this.shareClientId) {
							this.share()
						}
					}else{
						uni.showToast({
							title: data.msg
						});
					}
				}
			}
		},
		toAgent () { //跳转到我的小店界面
			uni.redirectTo({
				 url: '/pages/agent/home/index'
			});
		},
 		toBuy() { //点击立即购买
			if (this.sku.stock <= 0) {
				this.$api.msg('库存不足')
				return false;
			}
			if (this.selectType === 'buy') {
				var buyInfo = {
					agentId: this.agentId,
					activityId: this.activityId,
					agentGoodsId: this.agentGoodsId,
					goodsId: this.goodsId,
					goodsSkuId: this.goodsSkuId,
					shareId: this.shareId,
					price: this.sku.price,
					shareClientId: this.shareClientId
				}
				uni.setStorageSync('goodsInfo',buyInfo)
				if (Api.isToken()) { //先判断有没有登录
					uni.navigateTo({
						url: '/pages/client/goods/buy?goodsId='+buyInfo.goodsId+'&goodsSkuId='+buyInfo.goodsSkuId+'&activityId='+ buyInfo.activityId+'&agentGoodsId='+buyInfo.agentGoodsId+'&shareClientId='+buyInfo.shareClientId+'&agentId='+buyInfo.agentId
					});
				}
			} else if (this.selectType === 'cart'){
				this.addShopCar()
			} else {
				this.toggleSpec()
			}
		},
		async addShopCar () {
			let params = {
				agentId: this.agentId,
				goodsId: this.goodsId,
				goodsSkuId: this.goodsSkuId,
				activityId: this.activityId || '-1',
				shareId: this.shareClientId || '-1',
			}
			let data = await Api.apiCall('post', Api.client.cart.addShopCar, params, true);
			if (data) {
				if (data.code === 0) {
					this.$api.msg('加入购物车成功')
					this.toggleSpec()
				} else {
					this.$api.msg(data.msg)
				}
			}
		},
		stopPrevent() {}, //遮罩层的方法
		toIndex () {
			uni.switchTab({
				url:'/pages/agent/goods/hotsale/hotsale'
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
		display: inline-block;
		height: 64upx;
		line-height: 64upx;
		font-size: 26upx;
		color: #999999;
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
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 14upx 0 rgba(64,181,255, 0.2);
	.p-b-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #333333;
		font-size: 20upx;
		letter-spacing: 4upx;
		height: 80upx;
		.yticon {
			font-size: 40upx;
			line-height: 48upx;
			color: #333333;
		}
		&.active,
		&.active .yticon {
			color: $uni-color-primary;
		}
		.icon-fenxiang2 {
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang {
			font-size: 46upx;
		}
	}
	.action-btn-group {
		display: flex;
		.action-btn {
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
		.action-share-btn {
			background-image: linear-gradient(-90deg, #FE8A14, #FED041);
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
