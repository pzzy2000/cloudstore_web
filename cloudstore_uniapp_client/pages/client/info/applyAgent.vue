<template>
	<view class="container">
		<nav-bar backState="1000">申请代理</nav-bar>
		<form>
			<view class="cu-form-group text-red" v-if="isCheck">
				<view class="title">审核状态：</view>
				<input  name="input" :value="checkText" disabled="disabled"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">店铺姓名：</view>
				<input placeholder="请输入店铺姓名" name="input" :value="agentfrom.shopName" :disabled='isEdit' @input="editInput($event,'shopName')"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">姓名：</view>
				<input placeholder="请输入姓名" name="input" :value="agentfrom.name" :disabled='isEdit'  @input="editInput($event,'name')"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">电话号码：</view>
				<input placeholder="请输入电话号码" name="input" :value="agentfrom.phone" :disabled='isEdit' @input="editInput($event,'phone')"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">证件类型</view>
				<picker @change="typeChange" :value="index" :range="picker" :disabled='isEdit'>
					<view class="picker">
						{{index>-1?picker[index]:'请选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">证件ID：</view>
				<input placeholder="请输入证件ID" name="input" :value="agentfrom.cardId" :disabled='isEdit' @input="editInput($event,'cardId')"></input>
			</view>
			<view class="cu-form-group" @tap='seletctAddress' :disabled='isEdit'>
				<view class="title">省市区：</view>
				<view class="">{{agentfrom.provinceName}}</view>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">详细地址</view>
				<textarea :value="agentfrom.address" placeholder="请输入详细地址" :disabled='isEdit' @input="editInput($event,'address')" style="color:#000" ></textarea>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					上传身份证正反面
				</view>
			</view>
			<view class="cu-form-group">
				<easy-upload
				:dataList="imageList" :uploadUrl="upImgUrl" :types="category"
				deleteUrl='' :uploadCount="6"
				uploadIcon="https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1049033917,3033202092&fm=26&gp=0.jpg"
				@successImage="successImage" 
				@successVideo="successvideo"
				@delectIndex= 'delectIndex'
				></easy-upload>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @tap="applyAgent">上传</button>
			</view>
		</form>
		<ehPicker @conceal="conceal" v-if="popup" @close="close" />
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js'
	import easyUpload from '@/components/easy-upload/easy-upload'
	import ehPicker from '@/pages/tabbar/erha-picker.vue'; 
	export default {
		data() {
			return {
				popup:false,//控制省市区三级联动
				agentfrom: {
					id: '',
					shopName: '',
					name: '',
					phone: '',
					cardType: 'IDCard',
					cardId: '',
					cardPhoto: [],
					provinceName: '请选择省市区',
					provinceId: '',
					cityId: '',
					areaId: '',
					address: '',
					optType: 'save'
				},
				picker:['身份证'],
				index: 0,
				imageList: [],
				upImgUrl: Api.BASEURI +'sys/upload/entity/image/update',
				category: 'image',
				imglistId: [],
				checkText: '',
				isCheck: false,
				isEdit: false
			}
		},
		components:{
			navBar, easyUpload, ehPicker
		},
		onLoad() {
			this.getApplyAgentData()
		},
		methods: {
			async getApplyAgentData () {
				let params = {}
				let data = await Api.apiCall('post', Api.client.applyAgent.getClientAgent, params)
					if (data.code === 0 && data.result != null) {
						this.agentfrom.id = data.result.id,
						this.agentfrom.shopName = data.result.shopName
						this.agentfrom.name = data.result.name
						this.agentfrom.phone = data.result.phone
						this.agentfrom.cardType = data.result.cardType
						this.agentfrom.address = data.result.detailAddress
						this.agentfrom.cardId = data.result.cardNo
						this.agentfrom.provinceId = data.result.provinceBean.id
						this.agentfrom.cityId = data.result.cityBean.id
						this.agentfrom.areaId = data.result.areaBean.id
						this.agentfrom.provinceName = data.result.provinceBean.name+" / "+ data.result.cityBean.name+" / "+ data.result.areaBean.name
						for (let tmp in data.result.goodsPhotos) {
							this.imageList.push(data.result.goodsPhotos[tmp].url)
							this.imglistId.push(data.result.goodsPhotos[tmp].uid)
						}
						if (data.result.status === 0) {
							this.checkText = '正在审核'
							this.isCheck = true
							this.isEdit = true
						}else if(data.result.status === 2) {
							this.isCheck = true
							this.checkText = '审核不通过，请提交资料再次审核'
							this.agentfrom.optType = 'update'
							this.isEdit = false
						}
					}
			},
			typeChange (e) {
				this.index = e.detail.value
				if (e.detail.value === 1) {
					this.agentfrom.cardType = 'IDCard'
				}
			},
			close(){
				this.popup = false;
			},
			conceal(param) { 
				try{
					this.agentfrom.provinceName = param.province.name+" / "+param.city.name+" / "+param.area.name
					this.agentfrom.provinceId = param.province.id
					this.agentfrom.cityId = param.city.id
					this.agentfrom.areaId = param.area.id
				}catch(e){
					this.agentfrom.provinceName ="地址选择错误"
				}
				this.popup = false;
			},
			successImage(e){
				if (e) {
					this.imglistId = e
				}
			},
			successvideo(e){
				console.log(e)
			},
			delectIndex (e) {
				console.log(e)
			},
			editInput (e,data) { //修改input里面的值的时候
				switch(data)
				{
					case 'shopName':
						this.agentfrom.shopName = e.detail.value
						break;
					case 'name':
						this.agentfrom.name = e.detail.value
						break;
					case 'phone':
						this.agentfrom.phone = e.detail.value
						break;
					case 'cardId':
						this.agentfrom.cardId = e.detail.value
						break;
					case 'address':
						this.agentfrom.address = e.detail.value
						break;
				}
			},
			seletctAddress () {
				this.popup = !this.popup
			},
			async applyAgent () {
				let params = {
					shopName: this.agentfrom.shopName,
					name: this.agentfrom.name,
					phone: this.agentfrom.phone,
					cardType: this.agentfrom.cardType,
					cardNo: this.agentfrom.cardId,
					cardPhoto: this.imglistId.toString(),
					provinceId: this.agentfrom.provinceId,
					cityId: this.agentfrom.cityId,
					areaId: this.agentfrom.areaId,
					detailAddress: this.agentfrom.address,
					optType: this.agentfrom.optType
				}
				if (this.agentfrom.optType === 'update') {
					params.id = this.agentfrom.id
				}
				let data = await Api.apiCall('post', Api.client.applyAgent.save, params);
				if (data) {
					console.log(data)
					if (data.code === 0) {
						uni.showToast({
							title: '申请成功',
							icon: 'success'
						});
					}else {
						uni.showToast({
							title: 'data.msg',
							icon: 'none'
						});
					}
				}
			},
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx 0 50rpx 0;
	}
	.tui-line-cell {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		line-height: 32rpx;
		min-width: 120rpx;
		flex-shrink: 0;
	}

	.tui-input {
		font-size: 32rpx;
		color: #333;
		padding-left: 20rpx;
		flex: 1;
		overflow: visible;
	}
	.cu-form-group {
		justify-content: flex-start;
	}
</style>
