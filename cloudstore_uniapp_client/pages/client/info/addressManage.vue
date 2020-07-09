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
			<text @click="chooseLocation" class="input">
				{{addressData.addressName}}
			</text>
		</view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="详细地址" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row" v-if="isDetail">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.status" color="#fa436a" @change="detailChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<ehPicker @conceal="conceal" v-if="popup" @close="close" />
	</view>
</template>

<script>
	import ehPicker from '@/pages/tabbar/erha-picker.vue'; 
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
		components: {
		 ehPicker, navBar
		},
		data() {
			return {
				popup:false,
				title: '',
				addressData: {
					id: '',
					name: '孙翔宇',
					phone: '15773281581',
					addressName: '选择省/市/区县',
					address: '',
					areas:{
						province: {
							id: ''
						},
						city: {
							id: ''
						},
						area: {
							id: ''
						}
					},
					area: '区区区',
					default: false,
					status: '',
				},
				isDetail: false,
				optType: 'save'
			}
		},
		onLoad(option){
			if(option.type==='edit'){
				this.title = '编辑收货地址'
				this.isDetail = true
				this.optType = 'update'
				this.getAddressDetail(option.id)
				this.addressId = option.id
				console.log(option)
			}
		},
		methods: {
			close(){
				this.popup = false;
			},
			conceal(param) { 
				// 获取到传过来的 省 市 区 县数据
				console.log(param);
				this.addressData.areas = param;
				try{
					this.addressData.addressName = param.province.name+" / "+param.city.name+" / "+param.area.name
				}catch(e){
					this.addressData.addressName ="地址选择错误"
				}
				this.popup = false;
			},
			switchChange(e){
				this.addressData.default = e.detail;
			},
			//地图选择地址
			chooseLocation(){
				this.popup=true;
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
				if(!data.addressName || data.addressName=='选择省/市/区县'){
					this.$api.msg('请选择省/市/区县');
					return;
				}
				if(!data.area){
					this.$api.msg('请填写门牌号信息');
					return;
				}
				this.saveaddress(data);
			},
			async getAddressDetail (id) { //获取编辑时的地址详情
			  let params = {
			    id: id
			  }
			  let addressinfo = await Api.apiCall('post',Api.client.address.getClientAddressById,params) 
			  if (addressinfo) {
				this.addressData.id = addressinfo.result.id
			    this.addressData.name = addressinfo.result.name,
			    this.addressData.phone = addressinfo.result.phone
			    this.addressData.area = addressinfo.result.detailAddress
				this.addressData.addressName = addressinfo.result.provinceBean.name +'/'+ addressinfo.result.cityBean.name +'/'+ addressinfo.result.areaBean.name
			    this.addressData.areas.province.id = addressinfo.result.provinceBean.id
			    this.addressData.areas.city.id = addressinfo.result.cityBean.id
			    this.addressData.areas.area.id = addressinfo.result.areaBean.id
			    this.addressData.status = addressinfo.result.status
				console.log(this.addressData)
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
					console.log(addressinfo)
				}
			},
			async saveaddress(data){ //保存地址
	 			console.log(data)
				let params ={
					name:data.name,
					phone:data.phone,
					provinceId:data.areas.province.id,
					cityId:data.areas.city.id,
					areaId:data.areas.area.id,
					detailAddress:data.area,
					optType: this.optType
				};
				if (this.optType === 'update') {
					params.id = data.id
					params.status = data.status
				}
	 			let resullt = await Api.apiCall('post', Api.client.address.save, params, true);
				if(resullt){
					//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
					// this.$api.prePage().refreshList(data, this.manageType);
					// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
					// setTimeout(()=>{
					// 	uni.navigateBack()
					// }, 800)
					this.$api.msg("添加新地址成功");
					this.$api.prePage();
					this.$api.prePage().searchAddressList ();
					setTimeout(()=>{
						uni.navigateBack()
					}, 1000);
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
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
