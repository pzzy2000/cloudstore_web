<template>
	<view class="container">
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
				 <view class="th">{{goodsSku[0]==null ?   '规格' : goodsSku[0].skuKey }}</view>
				 <view class="th">价格</view>
				 </view>
				  <block v-for='itm  in  goodsSku' :key='itm.id'>
					   <view class="tr bg-g">
					  <view class="td" style="text-align: left;">{{itm.skuValue}}</view>
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
					<text >¥{{itm.propertyValue}}
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
						这里展示活动内容
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
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="joinAgent">加入代理</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="share">我的小店</button>
			</view>
		</view>

	</view>
</template>

<script>
	import Api from '@/common/api';
	import share from '@/components/share';
	import {
		mapState
	} from 'vuex';
	let userInfo = uni.getStorageSync('userInfo');
	export default {
		components: {
			share
		},
		data() {
			return {

				goods: {},
				goodsSku: [],
				goodsPropertyValue:[],
				goodsMobileHtml:'',
				favorite: true,
			};
		},
		onShow() {
			console.log(this.goodsId);
			this.loadGoodHtml(this.goodsId);
		},
		   
		// onShareAppMessage(res) {
		// 	console.log(res)
		// 	if (res.from === 'button') { // 来自页面内分享按钮
		// 	}
		// 	return {
		// 		title: '商品',
		// 		path: '/pages/goods/goodsDetail/goodsDetail?id=1'
		// 	}
		// },
		async onLoad(ops) {
			this.goodsId = ops.id;
			if (this.goodsId) {
				let params = {
					goodsId: this.goodsId
				};
				let data = await Api.apiCall('post', Api.goods.detail, params, false, false);
				if (data) {
					this.goods = data.result.goodsPicesBean;
					this.goodsSku = data.result.goodsSku;
					this.goodsPropertyValue =data.result.goodsPropertyValue;
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
				console.log(this.goods.id);
				let params = {
					goodsId: goodsId
				};
				let mobileHtml=this.setmobileHtml;
				Api.apiCallbackCall('post', Api.goods.loadHtml, params, false,false, function(data){
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
			async joinAgent() {
				let params = {
					goodsId: this.goodsId,
					activeId: 1
				}
				let data = await Api.apiCall('post', Api.goods.save, params);
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
					// console.log(data)
				}
			},
			//收藏
			toFavorite(item) {
				if (userInfo && userInfo.id) {
					this.favorite = !this.favorite;
					let params = {
						objId: item.id,
						type: 1,
						name: item.name,
						meno1: item.pic,
						meno2: item.price,
						meno3: item.sale
					};
					Api.apiCall('post', Api.goods.favoriteSave, params);

				} else {
					let url = '/pages/public/login';
					uni.navigateTo({
						url
					});
				}
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
			padding: 20upx 30upx;
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
    justify-content: center;
    height: 40px;
    align-items: center;
   }
   .td {
    width:100%;
    justify-content: center;
    text-align: center;
   }
   .bg-w{
    // background-color: #cff8fe;
   }
   .bg-g{
    background: #E6F3F9;
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
