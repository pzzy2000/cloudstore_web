<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-bottom: 10px;"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px;margin-bottom: 10px;"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="userForm" size="small" label-width="130px">
          <el-form-item label="客户账号：">
            <el-input style="width: 214px" v-model="userForm.name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item label="客户昵称：">
            <el-input style="width: 214px" v-model="userForm.phone" placeholder="客户电话"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float: right; margin: 0 10px">赠送优惠券</el-button>
      <el-button size="mini" style="float: right">APP推送</el-button>
      <el-button size="mini" style="float: right">群发站内信</el-button>
      <el-button size="mini" style="float: right; vertical-align: top">群发短信</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center" fixed ></el-table-column>
        <el-table-column label="客户ID"  align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="客户账号" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="客户昵称" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="代理等级" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="消费金额" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="订单数量" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="账户余额" align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="账户启用状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.value" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="readUser(scope.row)">查看</el-button>
            <el-button size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getUserlist} from '@/api/client'
  let defaultList = {
    pageNum: 1,
    pageSize: 20
  };
  export default {
    data() {
      return {
        userForm: {},
        listLoading: false,
        list: [
          {name: "123123", access: "123456"}
        ]
      }
    },
    created() {
      // this.getList();
    },
    methods: {
      getList() {
        getUserlist(defaultList).then(res => {
          console.log(res);
        })
      },
      // addUser() {
      //   this.$router.push({path: '/sys/client/add', query: {operaType: "add", rds: 'write'}})
      // },
      readUser(row) {
        this.$router.push({path: '/sys/client/add', query: {operaType: "read", rds: 'read'}})
      },
      editUser(row) {
        this.$router.push({path: '/sys/client/add', query: {operaType: "edit", rds: 'write'}})
      },
      deleteUser() {
        alert("删除事件");
      }
    }
  }
</script>

<style>
</style>
