<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>客户信息</span>
      <el-button style="float: right; margin-right: 20px" type="mini" @click="backPage">返 回</el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="userList" style="width:100%" v-loading="listLoading" border>
<!--        <el-table-column label="客户名称" align="center" prop="userBean.name">-->
<!--        </el-table-column>-->
<!--        <el-table-column label="用户账号" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.startTime}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="客户类型" align="center">
          <template slot-scope="scope">{{scope.row.userType | changeType}}</template>
        </el-table-column>
        <el-table-column label="已结算佣金" align="center">
          <template slot-scope="scope">{{scope.row.profited}}</template>
        </el-table-column>
        <el-table-column label="未结算佣金" align="center">
          <template slot-scope="scope">{{scope.row.profiting}}</template>
        </el-table-column>
        <el-table-column label="已结算积分" align="center">
          <template slot-scope="scope">{{scope.row.pointsed}}</template>
        </el-table-column>
        <el-table-column label="未结算积分" align="center">
          <template slot-scope="scope">{{scope.row.pointsing}}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>佣金详情</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="brokeList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed></el-table-column>
        <el-table-column label="商品名称" align="center" prop="orderDetailBean.goodsBean.goodsName">
<!--          <template slot-scope="scope">{{scope.row.}}</template>-->
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderId">
<!--          <template slot-scope="scope">{{scope.row.name}}</template>-->
        </el-table-column>
        <el-table-column label="支付金额" align="center" prop="orderDetailBean.payPrice">
<!--          <template slot-scope="scope">{{scope.row.endTime}}</template>-->
        </el-table-column>
        <el-table-column label="商品佣金" align="center" prop="profit">
<!--          <template slot-scope="scope">{{scope.row.showIndex}}</template>-->
        </el-table-column>
        <el-table-column label="购买积分" align="center" prop="points">
        <!--          <template slot-scope="scope">{{scope.row.showIndex}}</template>-->
        </el-table-column>
<!--        <el-table-column label="一级佣金" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="二级佣金" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="下单时间" align="center" prop="orderBean.createTime">
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
        </el-table-column>
        <el-table-column label="支付时间" align="center" prop="orderBean">
          <template slot-scope="scope">{{scope.row.orderBean.payTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="佣金状态" align="center" prop="profitStauts" :formatter="changeMsg">
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container" style="margin-right: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageList.pageSize"
        :page-sizes="[10]"
        :current-page.sync="pageList.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  import {getUserinfo, getBrokeinfo} from '@/api/brokerage'
  import { formatDate } from '@/assets/common/data.js'
  export default {
    name: "withdrawInfo",
    data() {
      return {
        userList: [],
        brokeList: [],
        listLoading: false,
        pageList: Object.assign({}, defaultList),
        total: 0
      }
    },
    created() {
      // this.userList = [{user: {name: "123"}}];
      this.getList();
    },
    filters: {
      changeType(data) {
        switch(data) {
          case 'Client': return "客户";
            break;
          case 'agent': return "代理";
            break;
          default: return "数据出错";
            break;
        }
      },
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
    },
    methods: {
      getList() {
        defaultList.userId = this.$route.query.id;
        getUserinfo(defaultList).then(res => {
          if (res.result.code == 0) {
            this.userList = res.result.result.records;
            // this.total = parseInt(res.result.result.total);
          }
        })
        getBrokeinfo(defaultList).then(res => {
          this.brokeList = res.result.result.records;
          this.total = parseInt(res.result.result.total);
        })
      },
      changeMsg(row) {
        switch (row.profitStauts) {
          case 1: return "未结算";
            break;
          case 2: return "已结算";
            break;
          default: return "数据出错";
            break;
        }
      },
      handleSizeChange() {
        this.getList();
      },
      handleCurrentChange() {
        this.getList();
      },
      backPage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .el-table >>> th.gutter{
    display: table-cell !important;
  }
</style>
