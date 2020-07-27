<template>
	<view class="container">
		<nav-bar backState="1000" fontColor="#FFF">商品详情</nav-bar>
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in goods.goodsDetailPhotos" :key="index">
					<view class="image-wrapper">
						<image :src="item.url" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="introduce-section">
			<text class="title">{{ goods.goodsName }}</text>
			<view class="price-box">
				<text class="price-tip">价格:¥</text>
				<text class="price">{{ goods.salePrice }}</text>
				<text class="m-price">¥{{ goods.martPrice }}</text>
			</view>
			<!--
			<view class="bot-row">
				
				<text>销量: {{ goods.sale }}</text>
				<text>库存: {{ goods.stock }}</text>
				<text>浏览量: {{ goods.hit }}</text>
			
			</view>
			-->
		</view>
		<!--  分享 -->
		<!-- <view class="share-section">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view> -->
		<view class="c-list">
			<view class="c-row b-b">
				<text class="tit">商品规格</text>
			</view>
			<view class="c-row b-b">
					<view class="con-list">
				<view class="table" v-if="goodsSku[0] != null">
				 <view class="tr bg-w">
				 <view class="th" v-for="  (item,index) in goodsSku[0].skuKeys " :key='index'>{{item}}</view>
				 <view class="th">价格</view>
				 </view>
				  <block v-for='itm  in  goodsSku' :key='itm.id'>
					   <view class="tr bg-g">
					  <view class="td" v-for="  (item,index) in itm.skuValues " :key='index'>{{item}}</view>
					  <view class="td">¥{{itm.price}}</view>
					  </view>
				  </block>
				</view>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">商品参数</text>
			</view>
			<view class="c-row b-b"   v-for='itm  in  goodsPropertyValue' :key='itm.id' v-if="itm.propertyType == 1 ">
				<text class="tit">{{itm.goodsPropertyParamName}}</text>
				<view class="con-list">
					<text >{{itm.propertyValue}}
					</text>
				</view>
			</view>
			
			<!--
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
             -->
			<view class="c-row b-b">
				<text class="tit">产地</text>
				<view class="con-list">
					<text v-text="addressBygoods(goods)">
					</text>
				</view>
			</view>

			<view class="c-row b-b">
				<text class="tit">活动内容</text>
				<view class="con-list">
					<text>
						<text>
							{{activity.name}}
						</text>
					</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>

		<!-- 评价 
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{ consultCount.all }})</text>
				<text class="tit">好评</text>
				<text>({{ consultCount.goods }})</text>

				<text class="tit">一般</text>
				<text>({{ consultCount.general }})</text>

				<text class="tit">差评</text>
				<text>({{ consultCount.bad }})</text>
				<text class="tip" v-if="consultCount.persent != 200">好评率 {{ consultCount.persent }}%</text>
				<text class="yticon icon-you"></text>
			</view>
		</view>
		-->


		<view class="detail-desc">
			<view class="d-header"><text>图文详情</text></view>
			<view class="ricetext">
				<rich-text :nodes="goodsMobileHtml"></rich-text>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/agent/goods/hotsale/hotsale"  class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view class="p-b-btn"  @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>期待</text>
			</view>
			<view class="p-b-btn"  @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="joinAgent">加入代理</button>
				<button type="primary" class=" action-btn no-border add-cart-btn">敬请期待</button>
				<!-- <button type="primary" class=" action-btn no-border add-cart-btn" @click="shareSave">立即分享</button> -->
				<!-- 这里的分享功能目前步骤为 先加入代理，再执行分享功能 -->
			</view>
		</view>


    <!-- 分享 -->
    <share ref="share" :contentHeight="380" :shareList="shareList"></share>
	</view>
</template>

<script>
	import Api from '@/common/api';
	import share from '@/components/share';
	import navBar from '@/components/zhouWei-navBar';
	

	import {
		mapState
	} from 'vuex';
	let userInfo = uni.getStorageSync('userInfo');
	export default {
		components: {
			share, navBar
		},
		data() {
			return {
				goodsId: '',
				goods: {},
				goodsSku: [],
				goodsPropertyValue:[],
				goodsMobileHtml:'',
				favorite: true,
				activity:{
					name: '' || '暂无' 
				},
				activityId: '',
				agentGoodsId: '',
				goodsName: '',
				shareClientId: '',
				shareList: [
					{
					  icon: "/static/temp/share_wechat.png",
					  text: "微信好友",
					  type: 1
					}
				],
				userType: 'agent'
			};
		},
		onShow() {
			this.loadGoodHtml(this.goodsId);
		},
		async onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
				var shareObj = {
					title: this.goodsName,
					params: {
						goodsId: this.goodsId,
						agentGoodsId: this.agentGoodsId,
						shareClientId: this.shareClientId || '-1',
						userType: 'Client'
					},
					path: '/pages/welcome?goodsId='+this.goodsId+'&agentGoodsId='+this.agentGoodsId+'&shareClientId='+this.shareClientId+'&userType=Client',
				}
				return shareObj
			}
		},
		async onLoad(ops) {
			console.log(ops)
			this.goodsId = ops.goodsId;
			this.activityId = ops.activityId;
			this.agentGoodsId = ops.agentGoodsId;
			if (this.goodsId) {
				let params = {
					goodsId: this.goodsId,
					activityId:this.activityId
				};
				let data = await Api.apiCall('post', Api.agent.goods.detail, params, false, false);
				if (data) {
					this.goods = data.result.goodsPicesBean;
					this.goodsName = data.result.goodsPicesBean.goodsName
					this.goodsSku = data.result.goodsSku;
					this.goodsPropertyValue =data.result.goodsPropertyValue;
				}
			}
			
			if(this.activityId){
				if(this.activityId<=0)return;
				let params = {
					activityId:this.activityId
				};
				let data = await Api.apiCall('post', Api.agent.activity.searchInfo, params, false, false);
				if (data) {
					this.activity = data.result
					console.log(this.activity)
				}
			}
		},
		filters: {
		}, 
		methods: {
			setmobileHtml(mobileHtml){
				this.goodsMobileHtml = mobileHtml;
			},
			loadGoodHtml(goodsId){
				let params = {
					goodsId: goodsId
				};
				let mobileHtml=this.setmobileHtml;
				Api.apiCallbackCall('post', Api.agent.goods.loadHtml, params, false,false, function(data){
					  mobileHtml(data.result.mobileHtml);
				});
			},
			addressBygoods(goods) {
				try {
					return goods.provinceBean.name + " " + goods.cityBean.name + " " + goods.areaBean.name;
				} catch (e) {
					return "获取产地信息出错";
				}
			},
			joinAgentAction(){
				let params = {
					goodsId: this.goodsId,
					// activeId: typeof(this.activityId)=="undefined"?'':this.activityId,
					// salesTypeGoodsId: typeof(this.agoodsid)=="undefined"?'':this.agoodsid
					activeId: this.activityId || '',
					salesTypeGoodsId: this.agentGoodsId || ''
				}
				let data =  Api.apiCall('post', Api.agent.goods.save, params,true);
				return data;
			},
			async joinAgent() {
				let data = await this.joinAgentAction();
				if(data){
					 if(data.code ==0){
						this.$api.msg("成功加入代理商品"); 
					 }
				}
			},
			share () { //分享
				this.$refs.share.toggleMask();
			},
			async shareSave () {
				let params = {
					'agentGoodsId': this.agentGoodsId,
					'shareId': this.shareClientId || '-1',
					'type': this.userType
				} 
				let data = await Api.apiCall('post', Api.agent.share.save, params);
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
			},
			toAgent () {
				uni.switchTab({
				    url: '/pages/agent/home/index'
				});
			},
			//收藏
			toFavorite(item) {
				this.$api.msg("敬请期待");
			},

		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
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

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
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


	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 15upx;
			position: relative;
		}

		.tit {
			width: 140upx;
			float: right;
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
			font-size: $font-base;
			color: $font-color-base;
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
			width: 90%;
			margin: 5px auto 20px;
			text-align: justify;
			font-size: 17px;
		}
	}






	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
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
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

   .table {
    border: 0px solid darkgray;
   }
   .tr {
    display: flex;
    width: 100%;
    height: 40px;
   }
   .td {
    width:100%;
    text-align: center;
   }
   .bg-w{
    // background-color: #cff8fe;
   }
   .bg-g{
    //background: #FFFFFF;
	//border-bottom: 1px solid darkgray;
   }
   .th {
    width: 100%;
    justify-content: center;
    background: #E6E6FA;
    color: #000000;
    display: flex;
    align-items: center;
   }

</style>
