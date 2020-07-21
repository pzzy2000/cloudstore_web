<template>
	<view class="container">
		<nav-bar>我的收益</nav-bar>
		<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="item.value" v-if="index<gridCol*2" @click="earninngType(item.value)">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}:{{item.num}}</text>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<p style='text-align: center;' v-if='financetDataList.length === 0'>暂无订单数据</p>
			<view class="cu-item" v-for='(item, index) in financetDataList' :key='index'>
				<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
				<view class="content">
					<view class="text-grey clamp">{{item.orderDetailBean.goodsBean.goodsName}}</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							收益:{{item.profit}}元
						</view>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-ls">{{item.orderBean.createTime}}</view>
					<view class="sm">订单Id：{{item.orderId}}</view>
				</view>
			</view>
		</view>
		<tabbar :role="'agent'" :ids="'awdsy'"></tabbar>	
	</view>
</template>

<script>
	import Api from '@/common/api';
	import navBar from '@/components/zhouWei-navBar';
	export default {
			data(){
				return {
					userType: '',
					cuIconList: [{
						cuIcon: 'recharge',
						color: 'red',
						badge: 0,
						name: '已收益',
						num: '计算中',
						value: 2
					}, {
						cuIcon: 'refund',
						color: 'orange',
						badge: 0,
						name: '待收益',
						num: '计算中',
						value: 1
					}, {
						cuIcon: 'goods',
						color: 'yellow',
						badge: 0,
						name: '积分',
						num: '计算中',
						value: 3
					}],
					gridCol: 3,
					gridBorder: false,
					tabEarning: 2,
					financeData: '',
					financetDataList: ''
				}
			},
			components:{
				navBar
			},
			onLoad () {
				this.userType = uni.getStorageSync('userInfo').agent
				this.getFinanceData()
				this.lisFinancetData()
			},
			methods:{
				async getFinanceData () {
					let parmas = {
						userType: this.userType
					}
					let data = await Api.apiCall('post', Api.finance.get, parmas)
					if (data) {
						if (data.code === 0 && data.result != null) {
							this.cuIconList[0].num =  data.result.profited
							this.cuIconList[1].num =  data.result.profiting
							this.cuIconList[2].num =  data.result.pointsed
						}else{
							this.$api.msg(data.msg)
						}
					}
				},
				async lisFinancetData (condition = '2', type = '1') {
					uni.showLoading({
						title: '正在加载',
						mask: false
					});
					let parmas = {
						userType: this.userType,
						status: condition,
						type: type,
						pageNum: '1',
						pageSize: '10'
					}
					let data = await Api.apiCall('post', Api.finance.list, parmas)
					if (data) {
						if (data.code === 0 && data.result != null) {
							const tmpData = data.result.records;
							for (let tmp in tmpData) {
								if (this.tabEarning === tmpData[tmp].profitStauts) {
									this.financetDataList.push(tmpData[tmp])
								}
							}
						}else{
							this.$api.msg(data.msg)
						}
						uni.hideLoading()
					}
				},
				earninngType (index) {
					this.financetDataList = []
					this.tabEarning = index
					if (index === 2) {
						this.lisFinancetData(2, 1)
					} else if (index === 1) {
						this.lisFinancetData(1, 1)
					} else if (index === 3) {
						this.lisFinancetData(2, 2)
					}
				}
			}
		}
</script>

<style scoped>
	.container {
		padding-bottom: 100upx;
	}
	.cu-list.menu-avatar>.cu-item .action {
		width: auto;
		text-align: right;
	}
	.menu-avatar .cu-item .content {
		flex: 1;
		width: 40%;
		overflow: hidden;  /*也可以用 width:0 代替*/
	}
	.menu-avatar .cu-item .content .clamp {
		display: block;
	}
</style>
