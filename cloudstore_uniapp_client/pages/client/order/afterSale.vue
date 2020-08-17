<template>
	<view class="container">
		<nav-bar backState="1000">{{afterSaleTitle}}</nav-bar>
		<form>
			<view class="cu-form-group">
				<view class="title">订单号：</view>
				<input placeholder="订单号内容" name="input" type="text" :value="orderId" disabled="true"></input>
			</view>
			<view class="goods-section">
				<!-- <view class="g-header b-b">
					<text class="name">店铺名：{{agentShopName}}</text>
				</view> -->
				<view class="g-item" v-for="(item, index) in goodsDetail" :key='index'>
					<image :src="item.goodsSkuBean.photos[0].url || item.goodsPicesBean.goodsDetailPhotos[0].url"></image>
					<view class="right">
						<text class="title clamp">{{item.goodsPicesBean.goodsName}}</text>
						<text class="spec">{{item.goodsSkuBean.skuValue}}</text>
						<view class="price-box">
							<view class="">
								<text class="price">￥{{item.payPrice}}</text>
							</view>
							<view class="">
								<text class="number">数量： {{item.quantity}}</text>
							</view>
						</view>
					</view>
					<template>
						<checkbox-group @change="chageCheck($event,item.id)" class="flex align-center justify-end wid20" v-if="item.status === 'peisoged'">
						    <checkbox class="flex align-center round cyan" value="select" style="transform:scale(0.7)"></checkbox>
						</checkbox-group>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'WaitDeliver'">待发货</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'returnsing'">退货中</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'refunding'">退款中</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'refunded'">已退款</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'returns'">退货成功</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'returnsfail'">退货拒绝</view>
						<view class="flex align-center justify-end wid20" v-else-if="item.status === 'delivered'">已收货</view>
					</template>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">售后方式：</view>
				<picker @change="pickerChange" :value="pickerIndex" :range="picker">
					<view class="picker">
						{{pickerIndex>-1?picker[pickerIndex]:'请选择售后方式'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" @input="textareaAInput" placeholder="请填写售后原因" :value='afterSaleInfo'></textarea>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<view class="title">上传图片：</view>
				</view>
			</view>
			<view class="cu-form-group upload">
				<tui-upload :serverUrl="serverUrl" @complete="uploadResult" @remove="uploadRemove" :value='imageList' :valueId= 'imgListId' :forbidDel='isEdit' :limit='10'></tui-upload>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="afterSaleSubmit">提交售后申请</button>
			</view>
		</form>
	</view>
</template>

<script>
	import Api from '@/common/api.js'
	import navBar from '@/components/zhouWei-navBar';
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: '',
				afterSaleInfo: '',
				afterSaleTitle: '申请售后',
				picker: ['退货'],
				pickerIndex: 0,
				pickerValue: 'returns',
				imgListId: [],
				imageList: [],
				serverUrl: Api.BASEURI +'sys/upload/entity/image/update', //上传地址
				goodsDetail: '',
				agentShopName: '',
				orderDetailIds: [],
				checkbox: [],
			}
		},
		components: {
			navBar
		},
		onLoad(ops) {
			this.orderId = ops.id
			this.getOrderData(ops.id)
		},
		onUnload() {
			this.imageList = []
			this.imgListId = []
		},
		methods: {
			async getOrderData (id) { //加载商品数据
				let params = {
					orderId: id
				};
				let data = await Api.apiCall('post', Api.client.order.getClientOrderDetail, params, true);
				if (data) {
					this.goodsDetail = data.result.details
					for (let tmp in this.goodsDetail) {
						this.checkbox.push({
							'checked': true,
							'value': this.goodsDetail
						})
					}
				}
			},
			pickerChange (e) { //选择售后方式
				if (e.detail.value === '1') {
					this.pickerValue = 'return'
				}
			},
			chageCheck (e,id) {
				if (e.detail.value.length) {
					this.orderDetailIds.push(id)
				} else {
					var index = this.orderDetailIds.indexOf(id);
					if (index > -1) {
						this.orderDetailIds.splice(index, 1);
					}
				}
			},
			textareaAInput (e) {
				this.afterSaleInfo = e.detail.value
			},
			uploadResult (e) { //页面上传成功后的回调
				this.imgListId = e.imgListId
			},
			uploadRemove (e) { //删除图片的回调
				let index = e.index
				if (this.imgListId.length != 0) {
					this.imageList.splice(index, 1)
					this.imgListId.splice(index, 1)
				}
			},
			async afterSaleSubmit () {
				if (!this.orderDetailIds.length) {
					this.$api.msg('请至少选择一条售后的商品')
					return false;
				}
				if (this.afterSaleInfo === '') {
					this.$api.msg('请填写需要售后的原因')
					return false;
				}
				if (this.imgListId.length === 0) {
					this.$api.msg('请至少上传一张证明图片')
					return false;
				}
				let params = {
					orderId: this.orderId,
					type: this.pickerValue,
					orderDetailIds: this.orderDetailIds.toString(), //售后的列表
					pictures: this.imgListId.toString(), //上传的图片
					remarks: this.afterSaleInfo
				}
				let data = await Api.apiCall('post', Api.client.order.submit, params);
				if (data) {
					if (data.code === 0) {
						uni.showModal({
							title: '提示',
							content: '申请售后成功',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								uni.navigateTo({
									url: '/pages/client/order/order',
								});
							},
						});
					} else {
						this.$api.msg(data.msg)
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-bottom: 30upx;
	}
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		border-top: 1upx solid #eee;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
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
			padding: 20upx;
			border-bottom: 1upx solid #eee;
			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}
	
			.right {
				flex: 1;
				padding: 0 25upx;
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
	.wid20 {
		width: 20%;
	}
	.cu-form-group {
		picker {
			padding-right: 20upx;
		}
	}
	.upload {
		padding-bottom: 30upx;
	}
</style>
