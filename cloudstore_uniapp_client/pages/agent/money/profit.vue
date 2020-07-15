<template>
	<view>
		<nav-bar>我的收益</nav-bar>
		<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*2">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}:{{item.num}}</text>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<p style='text-align: center;' v-if='financetDataList'>暂无订单数据</p>
			<view class="cu-item" v-for='(item, index) in financetDataList' :key='index'>
				<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
				<view class="content">
					<view class="text-grey">{{item.orderDetailBean.goodsBean.goodsName}}</view>
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
					cuIconList: [{
						cuIcon: 'recharge',
						color: 'red',
						badge: 0,
						name: '已收益',
						num: '计算中'
					}, {
						cuIcon: 'refund',
						color: 'orange',
						badge: 0,
						name: '待收益',
						num: '计算中'
					}, {
						cuIcon: 'goods',
						color: 'yellow',
						badge: 0,
						name: '积分',
						num: '计算中'
					}],
					gridCol: 3,
					gridBorder: false,
					financeData: '',
					financetDataList: ''
				}
			},
			components:{
				navBar
			},
			onLoad () {
				this.getFinanceData()
				this.lisFinancetData()
			},
			methods:{
				async getFinanceData () {
					let parmas = {
						userType: 'agent'
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
				async lisFinancetData () {
					let parmas = {
						userType: 'agent',
						pageNum: '1',
						pageSize: '10'
					}
					let data = await Api.apiCall('post', Api.finance.list, parmas)
					if (data) {
						if (data.code === 0 && data.result != null) {
							this.financetDataList = data.result.records
						}else{
							this.$api.msg(data.msg)
						}
					}
				}
			}
		}
</script>

<style scoped>
	.cu-list.menu-avatar>.cu-item .action {
		width: auto;
		text-align: right;
	}
</style>
