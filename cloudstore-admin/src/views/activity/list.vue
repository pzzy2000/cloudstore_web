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
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="活动名称：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="用户名字"></el-input>
          </el-form-item>
          <el-form-item label="物流编码：">
            <el-input style="width: 214px" v-model="listQuery.access" placeholder="访问账号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float: right" @click="addactivity">添加活动</el-button>
      <!--
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
      -->
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width:100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="活动名称" width="400px" align="center" fixed>
           <template slot-scope="scope">{{scope.row.name}}</template>
         </el-table-column>
        <el-table-column label="是否显示在首页" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否参加佣金" width="400px" align="center" fixed>
          <template slot-scope="scope">{{scope.row.addProfit | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="associatedGood(scope.row)">关联商品</el-button>
            <el-button type="danger" size="mini" @click="handeldelGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
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

  </div>
</template>
<script>
   import { fetchList } from '@/api/tracking'
   import {msg}  from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "trackinglist",
    data() {
      return {
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    watch: {
      // selectProductCateValue: function (newValue) {
      //   if (newValue != null && newValue.length == 2) {
      //     this.listQuery.productCategoryId = newValue[1];
      //   } else {
      //     this.listQuery.productCategoryId = null;
      //   }

      // }
    },
    filters: {
      changeMsg(data) {
        console.log("++++++++")
        switch (data) {
          case 1: return "已参加";
            break;
          case 0: return "未参加";
            break;
        }
      }
      // verifyStatusFilter(value) {
      //   if (value === 1) {
      //     return '审核通过';
      //   } else {
      //     return '未审核';
      //   }
      // }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      changeSwitch(){

      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },

      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSizeChange(val) {
              this.listQuery.pageNum = 1;
              this.listQuery.pageSize = val;
              this.getList();
      },
      addactivity() {
        this.$router.push({
          path: "/sys/activity/addact"
          // query: {rds: "write"}
        })
      },
      associatedGood(row) {
        this.$router.push({
          path: "/sys/activity/assogoods",
          query: {name: row.name, id: row.id}
        })
      },
      handeldelGoods() {

      }
    }
  }
</script>
<style></style>
