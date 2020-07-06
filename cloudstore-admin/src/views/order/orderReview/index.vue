<template>
  <div>
    <el-card class="filter-container" shadow="never" style="margin: 20px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right;margin-bottom: 10px;" @click="handleSearchList" type="primary" size="small">
          查询
        </el-button>
        <el-button style="float: right;margin-right: 15px;margin-bottom: 10px;" @click="handleResetSearch('searchList')" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="searchList" size="small" label-width="130px" ref="searchList">
          <el-form-item label="评论编号：" prop="code">
            <el-input style="width: 214px" v-model="searchList.code" placeholder="订单编号"></el-input>
          </el-form-item>
          <!--<el-form-item label="下单时间：" prop="ordertime">-->
            <!--<el-date-picker v-model="searchList.ordertime" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="订单编号：" prop="count">
            <el-input style="width: 214px" v-model="searchList.count" placeholder="用户账号"></el-input>
          </el-form-item>
          <!--<el-form-item label="订单类型：" prop="ordertype">-->
            <!--<el-select v-model="searchList.ordertype" placeholder="请选择">-->
              <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
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
        <el-table-column label="编号" align="center" fixed>
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="会员编号" align="center">
          <template slot-scope="scope">{{scope.row.goods}}</template>
        </el-table-column>
        <el-table-column label="评论人" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="订单ID" align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>
        <el-table-column label="评论内容" align="center">
          <template slot-scope="scope">{{scope.row.payPrice}}</template>
        </el-table-column>
        <el-table-column label="处理时间" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
      name: "index",
      data() {
        return {
          searchList: {
            code: '',
            ordertime: '',
            count: ''
          },
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          orderList: [{
            number: '1111',
            goods: '12313',
            ordertime: '12313',
            count: '123132',
            cost: '11123',
            apply: '321321',
            ordertype: '45678',
            status: '32164'
          }],
          listLoading: false
        }
      },
      methods: {
        handleSearchList() {
          alert("点击事件")
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

<style scoped>

</style>
