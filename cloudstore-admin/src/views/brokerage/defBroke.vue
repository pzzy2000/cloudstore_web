<template>
    <div>
      <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
      </el-card>
      <div style="margin: 20px 20px 0 20px">
        <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
          <el-table-column label="团长佣金" align="center">
            <template slot-scope="scope">{{scope.row.leader | changeMsg}}</template>
          </el-table-column>
          <el-table-column label="代理佣金" align="center">
            <template slot-scope="scope">{{scope.row.agent}}</template>
          </el-table-column>
          <el-table-column label="客户佣金" align="center">
            <template slot-scope="scope">{{scope.row.client}}</template>
          </el-table-column>
          <el-table-column label="可获积分" align="center">
            <template slot-scope="scope">{{scope.row.clientPoints}}</template>
          </el-table-column>
          <el-table-column label="佣金比例" align="center">
            <template slot-scope="scope">1</template>
          </el-table-column>
<!--          <el-table-column label="操作" width="200px"  align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-button size="mini" @click="delLogis(scope.row)">修改</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </div>
    </div>
</template>

<script>
  import { getdefbroke } from '@/api/brokerage'
  export default {
    name: "index",
    data() {
      return {
        orderList: [],
        listLoading: true
      }
    },
    created() {
      this.getList();
    },
    filters: {
      changeMsg(data) {
        try{
          return data;
        }catch (e) {
          return "数据读取出错"
        }
      }
    },
    methods: {
      // delLogis() {
      //   console.log("1");
      // },
      getList() {
        getdefbroke({id: 1}).then(res => {
          console.log(res);
          this.listLoading = false;
          this.orderList.push(res.result.result);
        })
      }
    }
  }
</script>

<style scoped>

</style>
