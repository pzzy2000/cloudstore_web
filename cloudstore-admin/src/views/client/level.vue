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
          @click="handleResetSearch('levelForm')"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="levelForm" ref="levelForm" size="small" label-width="130px">
          <el-form-item label="客户名称：" prop="name">
            <el-input style="width: 214px" v-model="levelForm.name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item label="客户等级：" prop="level">
            <el-input style="width: 214px" v-model="levelForm.level" placeholder="客户等级"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" size="mini" @click="addUser">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center" fixed ></el-table-column>
        <el-table-column label="客户名称"  align="center" fixed>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="客户等级"  align="center" fixed>
          <template slot-scope="scope">{{scope.row.level}}</template>
        </el-table-column>
        <el-table-column label="操作" align="right">
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
        levelForm: {},
        listLoading: false,
        list: [
          {name: "123123", level: "123456"}
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
      addUser() {
        this.$router.push({path: '/sys/client/addlevel', query: {operaType: "add", rds: 'write'}})
      },
      readUser(row) {
        this.$router.push({path: '/sys/client/addlevel', query: {operaType: "read", rds: 'read'}})
      },
      editUser(row) {
        this.$router.push({path: '/sys/client/addlevel', query: {operaType: "edit", rds: 'write'}})
      },
      deleteUser() {
        alert("删除事件");
      },
      handleResetSearch(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: '重置成功',
          type: 'success',
          duration: 800
        });
      }
    }
  }
</script>

<style>
</style>
