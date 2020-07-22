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
          <el-form-item label="活动名称：" prop="name">
            <el-input style="width: 214px" v-model="searchList.name" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：" prop="ordertype">
            <el-select v-model="searchList.status" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="活动名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">{{scope.row.startTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">{{scope.row.endTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status | changeStatus}}</template>
        </el-table-column>
        <el-table-column label="关联商品数量" align="center">
          <template slot-scope="scope">{{scope.row.payPrice}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)">商品佣金</el-button>
<!--            <el-button size="mini" @click="read(scope.row)">查看</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10]"
        :current-page.sync="listQuery.pageNum"
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
  import {getActlist} from '@/api/brokerage'
  import { formatDate } from '@/assets/common/data.js'
  // var token = getToken(); // 要保证取到
  export default {
    name: "brokerage",
    data() {
      return {
        searchList: {},
        options: [
          {label: "全部", value: "0"},
          {label: "进行中", value: "1"},
          {label: "已结束", value: "2"},
          {label: "未开始", value: "3"}
        ],
        orderList: [],
        listLoading: false,
        listQuery: Object.assign({}, defaultList),
        total: 1
      }
    },
    created() {
      // this.rwDispatcherState = "write";
      this.getList();
    },
    activated() {
      this.getList();
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      changeStatus(data) {
        switch (data) {
          case 0: return "未启用";
            break;
          case 1: return "已启用";
            break;
          default: return "数据读取出错";
            break;
        }
      }
    },
    methods: {
      handleSearchList() {
        alert("搜索")
      },
      readOrder(index, row) {
        this.$router.push({path: "/broke/rage/brokegoods", query: {id: row.id}})
      },
      getList() {
        this.listQuery.addProfit = 1;
        getActlist(this.listQuery).then(res => {
          this.orderList = res.result.result.records;
        })
      },
      handleSizeChange() {
        console.log("1");
      },
      handleCurrentChange() {
        console.log("1");
      },
      // read(row) {
      //   console.log(row)
      //   this.$router.push("");
      // }
    }
  }
</script>
<style scoped>

</style>
