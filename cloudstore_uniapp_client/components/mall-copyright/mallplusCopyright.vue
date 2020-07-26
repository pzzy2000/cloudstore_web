<template>
	<view class="cpr">
		<view class="color-9">
			<!-- {{sysInfo.company}} © {{sysInfo.subdomain}} 版权所有 -->
			丫咪购 © 深圳市国创基业产业运营管理有限公司 版权所有
		</view>
		<!-- <view class="color-9 beian">
			<view v-if="sysInfo.code"><a href="https://gitee.com/zscat/mallplus/wikis/pages" target="_blank">备案号：{{sysInfo.code}}</a></view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			sysInfo : this.$db.get('sysInfo')
		}
	}
}
</script>

<style>
.cpr{
	text-align: center;
	font-size: 24upx;
	margin: 20upx 0;
	position: absolute;
	left: 0;
	bottom: 100upx;
	width: 100%;
	text-align: center;
}
.beian a{
	text-decoration: none;
	color: #999 !important;
}
</style>
