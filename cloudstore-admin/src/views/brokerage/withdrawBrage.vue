<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px 20px 0 20px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-bottom: 10px;"
          @click="handleSearchList"
          type="primary"
          size="small">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px;margin-bottom: 10px;"
          @click="handleResetSearch('searchList')"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchList" size="small" label-width="130px" ref="searchList">
          <el-form-item label="用户账号：" prop="count">
            <el-input style="width: 214px" v-model="searchList.count" placeholder="用户账号"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称：" prop="name">
            <el-input style="width: 214px" v-model="searchList.name" placeholder="用户昵称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="用户账号" align="center" prop="userBean.access" :formatter="showAcc">
<!--          <template slot-scope="scope">{{scope.row.userBean.access}}</template>-->
        </el-table-column>
        <el-table-column label="用户昵称" align="center" prop="userBean.name" :formatter="showName">
<!--          <template slot-scope="scope">{{scope.row.}}</template>-->
        </el-table-column>
<!--        <el-table-column label="代理等级" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.endTime}}</template>-->
<!--        </el-table-column>-->
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
<!--        <el-table-column label="未入账" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="申请提现金额" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="提现状态" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="readInfo(scope.$index, scope.row)">查看</el-button>
<!--            <el-button size="mini" @click="read(scope.row)" type="danger">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
  import {listUserBroke} from '@/api/brokerage'
  import { formatDate } from '@/assets/common/data.js'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "withdrawBrage",
    data() {
      return {
        searchList: {},
        list:[],
        total:0,
        pageList: Object.assign({}, defaultList),
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        listUserBroke(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.list = res.result.result.records;
            this.total = parseInt(res.result.result.total);
          }
        })
      },
      handleSearchList() {
        alert("搜索")
      },
      handleResetSearch(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: "重置成功",
          type: "success",
          duration: 800
        })
      },
      readInfo(index, row) {
        this.$router.push({path: "/broke/rage/withdrawinfo", query: {id: row.userId}})
      },
      handleSizeChange() {
        this.getList();
      },
      handleCurrentChange() {
        this.getList();
      },
      showAcc(row) {
        try{
          return row.userBean.access;
        }catch (e) {
          return "数据读取出错"
        }
      },
      showName(row) {
        try {
          return row.userBean.name;
        }catch (e) {
          return "数据读取出错"
        }
      }
    }
  }
</script>

<style scoped>
  .el-table >>> th.gutter{
    display: table-cell !important;
  }
</style>
