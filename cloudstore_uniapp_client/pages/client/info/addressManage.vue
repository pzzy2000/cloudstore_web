<template>
	<view class="content">
		<nav-bar backState="1000">{{title}}</nav-bar>
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="seletctAddress" class="input">
				{{addressData.addressName}}
			</text>
		</view>
		<view class="row b-b cu-form-group" @click="selectMap">
			<view class="title">选择社区</view>
			<input :value="addressData.mapText" placeholder="请选择社区" disabled='true' style="color:#000;"></input>
		</view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="详细地址" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.status" color="#fa436a" @change="detailChange" />
		</view>
		<button class="add-btn bg-blue" @click="confirm">提交</button>
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
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	import tuiCascadeSelection from '@/components/tui-cascade-selection/tui-cascade-selection.vue'
	import uniPopup from '@/components/uni-popup/uni-popup'
	export default {
		components: {
		 navBar, tuiCascadeSelection, uniPopup
		},
		data() {
			return {
				popup:false,
				title: '',
				itemList: [],
				receiveData: [],
				addressData: {
					id: '',
					name: '',
					phone: '',
					addressName: '选择省/市/区/区域',
					address: '',
					areas:{
						province: {
							id: '',
							name: ''
						},
						city: {
							id: '',
							name: ''
						},
						area: {
							id: '',
							name: ''
						},
						town: {
							id: '',
							name: ''
						}
					},
					mapText: '',
					area: '',
					longitude: '',
					latitude: '',
					default: false,
					status: 0,
				},
				optType: 'save'
			}
		},
		onLoad(option){
			this.getAddressData()
			if(option.type==='edit'){
				this.title = '编辑收货地址'
				this.optType = 'update'
				this.getAddressDetail(option.id)
				this.addressId = option.id
			}
		},
		methods: {
			async getAddressData () { //获取第一级地址数据
				let params ={
					pageNum:1,
					pageSize:100,
					parentId:0,
					dirctType:'areas',
				};
				let list = await Api.apiCall('post', Api.areas.province, params, true);
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
			close(){
				this.popup = false;
			},
			seletctAddress () { //打开选择地址的弹出框
				this.$refs.popup.open()
			},
			async addressChange (e) { //选择地址
				switch(e.layer) {
					case 0:
					this.addressData.areas.province.name = e.text;
					this.addressData.areas.province.id = e.value;
					break;
					case 1:
					this.addressData.areas.city.name = e.text;
					this.addressData.areas.city.id = e.value;
					break;
					case 2:
					this.addressData.areas.area.name = e.text;
					this.addressData.areas.area.id = e.value;
					break;
					case 3:
					this.addressData.areas.town.name = e.text;
					this.addressData.areas.town.id = e.value;
					break;
				}
				this.addressData.addressName = this.addressData.areas.province.name + '/' + this.addressData.areas.city.name + '/' + this.addressData.areas.area.name + '/' + this.addressData.areas.town.name
				this.receiveData.length = 0
				let params = {
					pageNum:1,
					pageSize:50,
					parentId:e.value,
					dirctType:'areas',
				};
				if (e.layer === 3 ) {
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
			complete () {
				
			},
			selectMap () { //调用地图选择地址
				var that = this;
				uni.chooseLocation({
				    success: function (res) {
						that.addressData.mapText = res.name
						that.addressData.longitude = res.longitude
						that.addressData.latitude = res.latitude
				    }
				});
			},
			switchChange(e){
				this.addressData.default = e.detail;
			},
			//地图选择地址
			chooseLocation(){
				this.popup= !this.popup;
			},
			confirm(){ //提交
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!this.addressData.areas.town.id){
					this.$api.msg('请选择完整省/市/区(县)/区域');
					return;
				}
				if (!data.mapText ) {
					this.$api.msg('请选择社区');
					return;
				}
				if(!data.area){
					this.$api.msg('请填写详细信息');
					return;
				}
				this.saveaddress(data);
			},
			async getAddressDetail (id) { //获取编辑时的地址详情
			  let params = {
			    id: id
			  }
			  let addressinfo = await Api.apiCall('post',Api.client.address.getClientAddressById,params, true) 
			  if (addressinfo) {
				this.addressData.id = addressinfo.result.id
			    this.addressData.name = addressinfo.result.name,
			    this.addressData.phone = addressinfo.result.phone
			    this.addressData.area = addressinfo.result.detailAddress
				this.addressData.addressName = addressinfo.result.provinceBean.name +'/'+ addressinfo.result.cityBean.name +'/'+ addressinfo.result.areaBean.name +'/'+ addressinfo.result.townBean.name
			    this.addressData.areas.province.id = addressinfo.result.provinceBean.id
			    this.addressData.areas.city.id = addressinfo.result.cityBean.id
			    this.addressData.areas.area.id = addressinfo.result.areaBean.id
				this.addressData.areas.town.id = addressinfo.result.townBean.id
				this.addressData.mapText = addressinfo.result.community
			    this.addressData.status = addressinfo.result.status
			  }
			},
			detailChange (e) { //点击是否默认按钮
			  if (e.detail.value == true) {
			    this.addressData.status = 1
			  }else{
			    this.addressData.status = 0
			  }
			  // console.log(this.addressData.status)
			  // this.changeDetail()
			},
			async changeDetail (){ //改变地址是否默认
				let params = {
					id: this.addressId,
					status: this.addressData.status
				}
				let addressinfo = await Api.apiCall('post',Api.agent.address.updateAddressStatus,params)
				if (addressinfo) {
				}
			},
			async saveaddress(data){ //保存地址
				let params ={
					name:data.name,
					phone:data.phone,
					provinceId:data.areas.province.id,
					cityId:data.areas.city.id,
					areaId:data.areas.area.id,
					townId: data.areas.town.id,
					detailAddress:data.area,
					community: data.mapText,
					longitude: data.longitude,
					latitude: data.latitude,
					optType: this.optType,
					status: data.status
				};
				if (this.optType === 'update') {
					params.id = data.id
					params.status = data.status
				}
	 			let result = await Api.apiCall('post', Api.client.address.save, params, true);
				if(result){
					if (result.code === 0) {
						uni.showModal({
							title: '提示',
							content: '设置地址成功',
							showCancel: false,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								this.$api.prePage().searchAddressList ();
								uni.navigateBack()
							},
						});
					} else {
						this.$api.msg(result.msg);
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 140upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		border-radius: 10upx;
	}
</style>
