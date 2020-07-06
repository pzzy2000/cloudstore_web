<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px; overflow: hidden">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float: right">添加</el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column label="编号" align="center" fixed>
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="发货点名称" align="center">
          <template slot-scope="scope">{{scope.row.goods}}</template>
        </el-table-column>
        <el-table-column label="默认发货信息" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.value1" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="默认退货信息" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.value2" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="发货人姓名" align="center">
          <template slot-scope="scope">{{scope.row.goods}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="readOrder(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delOrder(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shipAddress",
    data() {
      return {
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
        listLoading: false,
        total: 1,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    methods: {
      handleSizeChange() {
        // this.getList();
      },
      handleCurrentChange() {
        // this.getList();
      },
    }
  }
</script>

<style scoped>

</style>
