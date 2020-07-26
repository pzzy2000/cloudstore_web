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
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px;margin-bottom: 10px;"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="pageList" size="small" label-width="130px">
          <el-form-item label="客户昵称：">
            <el-input style="width: 214px" v-model="pageList.name" placeholder="客户昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户电话：">
            <el-input style="width: 214px" v-model="pageList.phone" placeholder="客户电话" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker v-model="pageList.createTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择创建时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否删除：">
            <el-select v-model="pageList.isDelete" placeholder="请选择是否删除" clearable>
              <el-option v-for="item in delList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
<!--      <el-button size="mini" style="float: right; margin: 0 10px">赠送优惠券</el-button>-->
<!--      <el-button size="mini" style="float: right">APP推送</el-button>-->
<!--      <el-button size="mini" style="float: right">群发站内信</el-button>-->
<!--      <el-button size="mini" style="float: right; vertical-align: top">群发短信</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center" fixed ></el-table-column>
        <el-table-column label="客户昵称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="客户电话" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createDate}}</template>
        </el-table-column>
        <el-table-column label="是否删除" align="center">
          <template slot-scope="scope">{{scope.row.isDelete | changeMsg}}</template>
        </el-table-column>
<!--        <el-table-column label="账户启用状态" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">-->
<!--            </el-switch>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="readUser(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
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
  import {getUserlist} from '@/api/client'
  let defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };
  export default {
    data() {
      return {
        pageList: Object.assign({}, defaultList),
        listLoading: false,
        list: [],
        total: 0,
        delList: [{label: "已删除", value: '1'}, {label: "未删除", value: '0'}]
      }
    },
    created() {
      this.getList(1);
    },
    filters: {
      changeMsg(data) {
        switch (data) {
          case 0: return "未删除";
            break;
          case 0: return "已删除";
            break;
          default: return "数据读取错误";
            break;
        }
      }
    },
    methods: {
      getList(idx) {
        getUserlist(this.pageList).then(res => {
          console.log(res);
          this.list = res.result.result.records;
          this.total = parseInt(res.result.result.total);
          if (idx == 0) {
            if (res.result.result.records.length == 0) {
              this.$message({
                message: "暂无数据",
                type: 'warning',
                duration: 800
              })
            }else {
              this.$message({
                message: "查询成功",
                type: 'success',
                duration: 800
              })
            }
          }
          if (idx == 2) {
            this.$message({
              message: "重置成功",
              type: 'success',
              duration: 800
            })
          }
        })
      },
      // addUser() {
      //   this.$router.push({path: '/sys/client/add', query: {operaType: "add", rds: 'write'}})
      // },
      readUser(row) {
        this.$router.push({path: '/sys/client/info', query: {operaType: "read", rds: 'read', id: row.id}})
      },
      deleteUser() {
        alert("删除事件");
      },
      handleSizeChange(val) {
        this.pageList.pageNum = 1;
        this.pageList.pageSize = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.pageList.pageNum = val;
        this.getList(1);
      },
      handleSearchList() {
        this.pageList.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.pageList = Object.assign({}, defaultList);
        this.getList(2);
      }
    }
  }
</script>

<style>
</style>
