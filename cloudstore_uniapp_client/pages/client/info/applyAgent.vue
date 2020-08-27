<template>
	<view class="container">
		<nav-bar backState="1000">{{agentTitle}}</nav-bar>
		<form>
			<view class="cu-form-group text-red" v-if="isCheck">
				<view class="title">审核状态：</view>
				<input  name="input" :value="checkText" disabled="disabled"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">店铺名称：</view>
				<input placeholder="请输入店铺名称" name="input" :value="agentfrom.shopName" :disabled='isEdit' @input="editInput($event,'shopName')"></input>
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
				<view class="title">代理类型</view>
				<template>
					<picker @change="typePickerChange" :value="typePickerIndex" :range="typePicker" :disabled='isEdit' v-if="!isEdit">
						<view class="picker">
							{{typePickerIndex>-1?typePicker[typePickerIndex]:'请选择'}}
						</view>
					</picker>
					<input  name="input" :value="typePicker[typePickerIndex]" :disabled='isEdit' v-else>
				</template>
			</view>
			<view class="cu-form-group">
				<view class="title">证件类型：</view>
				<template>
					<picker @change="typeChange" :value="index" :range="picker" :disabled='isEdit' v-if="!isEdit">
						<view class="picker">
							{{index>-1?picker[index]:'请选择'}}
						</view>
					</picker>
					<input  name="input" :value="picker[index]" :disabled='isEdit' v-else>
				</template>
			</view>
			<view class="cu-form-group">
				<view class="title">证件号码：</view>
				<input placeholder="请输入证件号码" name="input" :value="agentfrom.cardId" :disabled='isEdit' @input="editInput($event,'cardId')"></input>
			</view>
			<view class="cu-form-group" @tap='seletctAddress' :disabled='isEdit'>
				<view class="title">省市区：</view>
				<view class="">{{agentfrom.provinceName}}</view>
			</view>
			<view class="cu-form-group" @click.stop="selectMap">
				<view class="title">选择社区：</view>
				<input :value="agentfrom.mapText" placeholder="请选择社区" disabled='true' style="color:#000;"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">详细地址：</view>
				<input :value="agentfrom.address" placeholder="请输入详细地址" :disabled='isEdit' @input="editInput($event,'address')" style="color:#000;"></input>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					请上传身份证正面和反面
				</view>
			</view>
			<view class="cu-form-group" v-if="isUpload" style="padding-bottom: 20upx;">
				<tui-upload :serverUrl="serverUrl" @complete="uploadResult" @remove="uploadRemove" :value='imageList' :valueId= 'imgListId' :forbidDel='isEdit'></tui-upload>
			</view>
			<view class="padding flex flex-direction" v-if="!isEdit">
				<button class="cu-btn bg-red margin-tb-sm lg" @tap="applyAgent">上传</button>
			</view>
		</form>
		<!-- <ehPicker @conceal="conceal" v-if="popup" @close="close" /> -->
		<uni-popup ref="popup" type="bottom" class="popup">
			<tui-cascade-selection
				height="280px"
				activeColor="#08affe"
				lineColor="#08affe"
				checkMarkColor="#08affe"
				:itemList="itemList"
				request
				@complete="complete"
				:receiveData="receiveData"
				@change="addressChange"
			></tui-cascade-selection>
		</uni-popup>
	</view>
</template>

<script>
	import navBar from '@/components/zhouWei-navBar';
	import Api from '@/common/api.js'
	import ehPicker from '@/pages/tabbar/erha-picker.vue'; 
	import tuiCascadeSelection from '@/components/tui-cascade-selection/tui-cascade-selection.vue'
	import uniPopup from '@/components/uni-popup/uni-popup'
	import tuiUpload from '@/components/tui-upload/tui-upload.vue'
	export default {
		data() {
			return {
				agentTitle: '申请代理',
				popup:false,//控制省市区三级联动
				agentfrom: {
					id: '',
					shopName: '',
					name: '',
					phone: '',
					agentType: 'agent',
					cardType: 'IDCard',
					cardId: '',
					cardPhoto: [],
					provinceName: '请选择省、市、区、区域',
					provinceId: '',
					cityId: '',
					areaId: '',
					townId: '',
					villageId: '',
					address: '',
					mapText: '',
					longitude: '',
					latitude: '',
					optType: 'save'
				},
				addressName: {
					province:'',
					city: '',
					area: '',
					town: '',
					village: ''
				},
				picker:['身份证'],
				index: 0,
				typePicker: ['代理', '团长'],
				typePickerIndex: 0,
				upImgUrl: Api.BASEURI+Api.upImgUrl.imgUrl,
				category: 'image',
				imgListId: [],
				imageList: [],
				checkText: '',
				isCheck: false,
				isEdit: false,
				itemList: [],
				receiveData: [],
				isUpload: false,
				serverUrl: Api.BASEURI+Api.upImgUrl.imgUrl //上传地址
			}
		},
		components:{
			navBar, ehPicker, tuiCascadeSelection, uniPopup, tuiUpload
		},
		onLoad() {
			this.getApplyAgentData()
			this.getAddressData()
		},
		onPullDownRefresh() { //下拉刷新
			this.getApplyAgentData()
		},
		onUnload() {
			this.imageList = []
			this.imgListId = []
		},
		methods: {
			async getAddressData () { //获取第一级地址数据
				let params ={
					pageNum:1,
					pageSize:100,
					parentId:0,
					dirctType:'areas',
				};
				let list = await Api.apiCall('post', Api.areas.province, params);
				if (list) {
					if (list.code === 0 && list.result.total != 0) {
						for (let tmp in list.result.records) {
							this.itemList.push({
								text: list.result.records[tmp].name,
								value: list.result.records[tmp].id
							})
						}
					}else {
						this.$refs.popup.close()
						this.itemList = []
					}
				}
			},
			getApplyAgentData () { //获取代理商的数据
				let token = uni.getStorageSync('token'), params = {}, that = this;
				if (token) {
					uni.request({
						url: Api.BASEURI + Api.client.applyAgent.getClientAgent,
						method: 'post',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'auth': token
						},
						data: params,
						fail: function() {
							uni.hideLoading();
							uni.showToast({
								title: '获取信息失败',
								icon: 'none'
							});
						},
						success: function(res) {
							if (res) {
								var data = res.data.result
								if(data) {
									if (data.code === 0 && data.result != null) {
										that.agentfrom.id = data.result.id,
										that.agentfrom.shopName = data.result.shopName
										that.agentfrom.name = data.result.name
										that.agentfrom.phone = data.result.phone
										that.agentfrom.mapText = data.result.community
										if (data.result.agentType === 'agent') {
											that.typePickerIndex = 0
											that.agentfrom.agentType = data.result.agentType
										} else {
											that.typePickerIndex = 1
											that.agentfrom.agentType = data.result.agentType
										}
										for (let tmp in data.result.goodsPhotos) {
											that.imageList.push(data.result.goodsPhotos[tmp].url)
											that.imgListId.push(data.result.goodsPhotos[tmp].uid)
										}
										if(that.imgListId.length ||　that.imageList.length) {
											that.isUpload = true //控制上传图片组件的显示与隐藏
										}
										//赋值省、市、区、区域、社区内容
										that.agentfrom.cardType = data.result.cardType
										that.agentfrom.address = data.result.detailAddress
										that.agentfrom.cardId = data.result.cardNo
										that.agentfrom.longitude = data.result.longitude
										that.agentfrom.latitude = data.result.latitude
										try{
											that.agentfrom.provinceId = data.result.provinceId
											that.agentfrom.cityId = data.result.cityId
											that.agentfrom.areaId = data.result.areaId
											that.agentfrom.townId = data.result.townId
											// that.agentfrom.villageId = data.result.villageId
											that.agentfrom.provinceName = data.result.provinceBean.name+" / "+ data.result.cityBean.name+" / "+ data.result.areaBean.name +" / "+ data.result.townBean.name
											
										}catch(e){
											that.$api.msg('地址信息出错')
										}
										if (data.result.status === 0) {
											that.checkText = '正在审核中,资料不能修改'
											that.isCheck = true
											that.isEdit = true
										}else if(data.result.status === 2) {
											that.isCheck = true
											that.checkText = '审核不通过，请提交资料再次审核'
											that.agentfrom.optType = 'update'
											that.isEdit = false
										} else if (data.result.status === 1){
											that.agentTitle = '代理资料'
											that.isEdit = true
										} else {
											that.isUpload = true
										}
									} else {
										that.isUpload = true
										that.$api.msg(data.msg)
									} 
								}
								uni.hideLoading()
								uni.stopPullDownRefresh()
							}
						},
					})
				}
			},
			assignmentInfo (res) { //将代理资料进行赋值
				var data = res.data.result
				if(data) {
					if (data.code === 0 && data.result != null) {
						this.agentfrom.id = data.result.id,
						this.agentfrom.shopName = data.result.shopName
						this.agentfrom.name = data.result.name
						this.agentfrom.phone = data.result.phone
						if (data.result.agentType === 'agent') {
							this.typePickerIndex = 0
							this.agentfrom.agentType = data.result.agentType
						} else {
							this.typePickerIndex = 1
							this.agentfrom.agentType = data.result.agentType
						}
						this.agentfrom.cardType = data.result.cardType
						this.agentfrom.address = data.result.detailAddress
						this.agentfrom.cardId = data.result.cardNo
						this.agentfrom.provinceId = data.result.provinceId
						this.agentfrom.cityId = data.result.cityId
						this.agentfrom.areaId = data.result.areaId
						this.agentfrom.townId = data.result.townId
						this.agentfrom.villageId = data.result.villageId
						this.agentfrom.provinceName = data.result.provinceBean.name+" / "+ data.result.cityBean.name+" / "+ data.result.areaBean.name +" / "+ data.result.townBean.name +" / "+ data.result.villageBean.name
						for (let tmp in data.result.goodsPhotos) {
							this.imageList.push(data.result.goodsPhotos[tmp].url)
							this.imgListId.push(data.result.goodsPhotos[tmp].uid)
						}
						if (data.result.status === 0) {
							this.checkText = '正在审核中,资料不能修改'
							this.isCheck = true
							this.isEdit = true
						}else if(data.result.status === 2) {
							this.isCheck = true
							this.checkText = '审核不通过，请提交资料再次审核'
							this.agentfrom.optType = 'update'
							this.isEdit = false
						} else if (data.result.status === 1){
							this.agentTitle = '代理资料'
							this.isEdit = true
						}
					} else {
						this.$api.msg(data.msg)
					} 
				}
				uni.hideLoading()
				uni.stopPullDownRefresh()
			},
			typeChange (e) { //选择身份证
				this.index = e.detail.value
				if (e.detail.value === 1) {
					this.agentfrom.cardType = 'IDCard'
				}
			},
			typePickerChange (e) { //选择代理类型
				this.typePickerIndex = e.detail.value
				if (e.detail.value === 0) {
					this.agentfrom.agentType = 'agent'
				} else {
					this.agentfrom.agentType = 'leader'
				}
			},
			complete(e) { //点击了地址的上一级分类
			},
			selectMap () { //调用地图选择地址
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
						that.agentfrom.mapText = res.name
						that.agentfrom.longitude = res.longitude
						that.agentfrom.latitude = res.latitude
				    }
				});
			},
			async addressChange (e) { //选择地址
				switch(e.layer) {
					case 0:
					this.addressName.province = e.text;
					this.agentfrom.provinceId = e.value;
					break;
					case 1:
					this.addressName.city = e.text;
					this.agentfrom.cityId = e.value;
					break;
					case 2:
					this.addressName.area = e.text;
					this.agentfrom.areaId = e.value;
					break;
					case 3:
					this.addressName.town = e.text;
					this.agentfrom.townId = e.value;
					break;
					case 4:
					this.addressName.village = e.text;
					this.agentfrom.villageId = e.value;
					break;
				}
				this.agentfrom.provinceName = this.addressName.province + '/' +this.addressName.city + '/' +this.addressName.area + '/' +this.addressName.town
				uni.showLoading({
					title: '正在加载',
					mask: false
				});
				this.receiveData.length = 0
				let params = {
					pageNum:1,
					pageSize:50,
					parentId:e.value,
					dirctType:'areas',
				};
				if (e.layer === 3) {
					this.$refs.popup.close()
					uni.hideLoading()
					return false;
				} else {
					let list = await Api.apiCall('post', Api.areas.province, params);
					if (list) {
						if (list.code === 0 && list.result.total != 0) {
							for (let tmp in list.result.records) {
								this.receiveData.push({
									text: list.result.records[tmp].name,
									value: list.result.records[tmp].id
								})
							}
						}else {
							this.$refs.popup.close()
							this.receiveData = []
						}
						uni.hideLoading()
					}
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
			seletctAddress () { //打开选择地址的弹出框
				if(this.isEdit) {
					return false;
				}
				this.$refs.popup.open()
			},
			async applyAgent () { //提交代理资料
				if (this.isEdit === true) {
					this.$api.msg('资料正在审核，请勿重复提交')
					return;
				}
				if (!this.agentfrom.shopName) {
					this.$api.msg('请输入店铺名称')
					return;
				}
				if (!this.agentfrom.name) {
					this.$api.msg('请输入姓名')
					return;
				}
				if (!this.agentfrom.phone) {
					this.$api.msg('请输入电话')
					return;
				}
				if (!this.agentfrom.cardId) {
					this.$api.msg('请输入证件号码')
					return;
				}
				if (!this.agentfrom.townId) {
					this.$api.msg('请选择完省、市、区、街道、社区')
					return;
				}
				if (!this.agentfrom.address) {
					this.$api.msg('请输入详细地址')
					return;
				}
				if (!this.agentfrom.longitude) {
					this.$api.msg('请使用地图选择社区')
					return;
				}
				if (this.imgListId.length != 2) {
					this.$api.msg('请上传身份证正面和反面')
					return;
				}
				let params = {
					shopName: this.agentfrom.shopName,
					name: this.agentfrom.name,
					phone: this.agentfrom.phone,
					agentType: this.agentfrom.agentType,
					cardType: this.agentfrom.cardType,
					cardNo: this.agentfrom.cardId,
					cardPhoto: this.imgListId,
					provinceId: this.agentfrom.provinceId,
					cityId: this.agentfrom.cityId,
					areaId: this.agentfrom.areaId,
					townId: this.agentfrom.townId,
					villageId: '-1',
					detailAddress: this.agentfrom.address,
					community: this.agentfrom.mapText,
					longitude: this.agentfrom.longitude,
					latitude: this.agentfrom.latitude,
					optType: this.agentfrom.optType
				}
				console.log()
				if (this.agentfrom.optType === 'update') {
					params.id = this.agentfrom.id
				}
				let data = await Api.apiCall('post', Api.client.applyAgent.save, params);
				if (data) {
					if (data.code === 0) {
						uni.showModal({
						    title: '提示',
						    content: '申请成功',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						           uni.switchTab({
						           	url: '/pages/client/info/index',
						           });
						        } else if (res.cancel) {
						            uni.switchTab({
						            	url: '/pages/client/info/index',
						            });
						        }
						    }
						});
					}else {
						uni.showToast({
							title: data.msg,
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
		padding-bottom: 50upx;
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
	.cu-form-group .title {
		width: 27%;
	}
	.popup {
		z-index: 999;
		position: relative;
	}
</style>
