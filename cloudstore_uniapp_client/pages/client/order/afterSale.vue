<template>
	<view>
		<nav-bar backState="1000">{{afterSaleTitle}}</nav-bar>
		<form @submit="" @reset="">
			<view class="cu-form-group">
				<view class="title">订单号</view>
				<input placeholder="订单号内容" name="input" type="text" :value="orderId"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">订单信息</view>
				<input placeholder="订单信息" name="input" type="text" :value="orderInfo"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">售后方式</view>
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
					<view class="title">上传图片</view>
				</view>
			</view>
			<view class="cu-form-group">
				<tui-upload :serverUrl="serverUrl" @complete="uploadResult" @remove="uploadRemove" :value='imageList' :valueId= 'imgListId' :forbidDel='isEdit'></tui-upload>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @click="afterSaleSubmit">提交</button>
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
				picker: ['退货', '换货'],
				pickerIndex: 0,
				imgListId: [],
				imageList: [],
				serverUrl: Api.BASEURI +'sys/upload/entity/image/update' //上传地址
			}
		},
		components: {
			navBar
		},
		methods: {
			pickerChange (e) { //选择售后方式
				console.log(e)
			},
			textareaAInput (e) {
				this.afterSaleInfo = e.detail.value
			},
			uploadResult (e) { //页面上传成功后的回调
			},
			uploadRemove (e) { //删除图片的回调
			},
			afterSaleSubmit () {
				console.log(this.orderId)
				console.log(this.orderInfo)
				console.log(this.afterSaleInfo)
			}
		}
	}
</script>

<style>

</style>
