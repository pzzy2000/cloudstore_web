<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column label="编号" align="center" fixed>
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.goods}}</template>
        </el-table-column>
        <el-table-column label="首重" align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>
        <el-table-column label="首费（元）" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="续费（元）" align="center">
          <template slot-scope="scope">{{scope.row.ordertype}}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.value" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
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
  export default {
    name: "index",
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
        pageList: Object.assign({}, defaultList),
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
