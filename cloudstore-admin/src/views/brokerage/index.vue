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
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px" ref="searchList">
          <el-form-item label="活动名称：" prop="name">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="活动名称" clearable></el-input>
          </el-form-item>
<!--          <el-form-item label="开始时间：">-->
<!--            <el-date-picker v-model="listQuery.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择活动开始时间"></el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="创建时间：">-->
<!--            <el-date-picker v-model="listQuery.createTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择活动创建时间"></el-date-picker>-->
<!--          </el-form-item>-->
          <el-form-item label="活动状态：" prop="ordertype">
            <el-select v-model="listQuery.status" placeholder="请选择" clearable>
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
        <el-table-column label="活动类型" align="center">
          <template slot-scope="scope">{{scope.row.type | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">{{scope.row.startTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">{{scope.row.endTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status | changeStatus}}</template>
        </el-table-column>
<!--        <el-table-column label="关联商品数量" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)" :disabled="scope.row.type == 1 ? true : false" v-if="powershowing(power.broke_goods)">商品佣金</el-button>
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
  import {powershow} from "@/utils/power";
  // var token = getToken(); // 要保证取到
  export default {
    name: "brokerage",
    data() {
      return {
        options: [
          {label: "未启用", value: "0"},
          {label: "已启用", value: "1"}
        ],
        orderList: [],
        listLoading: false,
        listQuery: Object.assign({}, defaultList),
        total: 1,
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      // this.rwDispatcherState = "write";
      this.getList(1);
    },
    activated() {
      this.getList(1);
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
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
      },
      changeMsg(data) {
        switch (data) {
          case 0: return "线上活动";
            break;
          case 1: return '线下活动';
            break;
          default: return "数据读取出错";
        }
      }
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultList);
        this.getList(2)
      },
      readOrder(index, row) {
        this.$router.push({path: "/broke/rage/brokegoods", query: {id: row.id}})
      },
      getList(idx) {
        this.listLoading = true;
        this.listQuery.addProfit = 1;
        this.listQuery.type = 0;
        getActlist(this.listQuery).then(res => {
          this.listLoading = false
          this.orderList = res.result.result.records;
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
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(1);
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(1);
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
