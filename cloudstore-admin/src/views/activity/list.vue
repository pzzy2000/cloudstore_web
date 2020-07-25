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
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select v-model="listQuery.activityStatus" placeholder="请选择活动状态" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否参加佣金：">
            <el-select v-model="listQuery.brokerage" placeholder="请选择是否参加佣金" clearable>
              <el-option v-for="item in brokerageList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float: right" @click="addactivity" v-show="isshow">添加活动</el-button>
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
        <el-table-column label="活动名称" align="center" fixed>
           <template slot-scope="scope">{{scope.row.name}}</template>
         </el-table-column>
        <el-table-column label="是否显示在首页" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.showIndex" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="onoffAct(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示在导航栏" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.navigateIndex" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="showInnavigate(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" align="center">
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
        <el-table-column label="是否参加佣金" align="center">
          <template slot-scope="scope">{{scope.row.addProfit | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="associatedGood(scope.row)">关联商品</el-button>
            <el-button type="danger" size="mini" @click="handeldelGoods(scope.row)" v-show="isshow">删除</el-button>
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
   import { fetchList, changeShowidx, delActivity, showInnavigate, onoffAct } from '@/api/activity'
   import {msg}  from '@/api/iunits'
   import { formatDate } from '@/assets/common/data.js'
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
        total: 0,
        listLoading: true,
        multipleSelection: [],
        isshow: false,
        statusList: [{label: "已开启", value: '0'}, {label: "未开启", value: '1'}],
        brokerageList: [{label: "已参加", value: '0'}, {label: "未参加", value: '1'}]
      }
    },
    created() {
      this.getList();
      switch (localStorage.getItem('userType')){
        case 'platform': this.isshow = true;
          break;
        case 'supplier': this.isshow = false;
          break;
      }
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
    activated() {
      this.getList();
    },
    filters: {
      changeMsg(data) {
        switch (data) {
          case 1: return "已参加";
            break;
          case 0: return "未参加";
            break;
        }
      },
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
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
      changeSwitch(row){
        console.log(row);
        let obj = {
          id: row.id,
          showIndex: row.showIndex,
          optType: 'update'
        }
        changeShowidx(obj).then(res => {
          console.log(res);
          if(res.result.code == 0){
            if(res.result.result.showIndex == 0) {
              this.$message({
                type: 'success',
                message: '首页不显示了！',
                duration: 800
              })
              this.getList();
            }else{
              this.$message({
                type: 'success',
                message: '显示在首页了！',
                duration: 800
              })
              this.getList();
            }
          }else{
            setTimeout(function(){
              row.status = 0;
            },500);
            this.getList();
          }
        })
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
      handeldelGoods(row) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delActivity({ids: row.id}).then(res => {
            console.log(res);
            if (res.result.code == 0) {
              this.$message({
                message: '删除活动成功!',
                type: 'success',
                duration: 800
              })
              this.getList();
            }
          })
        })
      },
      onoffAct(row) {
        let obj = {id: row.id};
        onoffAct(obj).then(res => {
          if(res.result.code == 0){
            if(res.result.result.status == 0) {
              this.$message({
                type: 'success',
                message: '活动没启用！',
                duration: 800
              })
              this.getList();
            }else{
              this.$message({
                type: 'success',
                message: '活动启用了！',
                duration: 800
              })
              this.getList();
            }
          }else{
            // this.$message({
            //   type: 'warning',
            //   message: '操作不成功，请联系管理员！',
            //   duration: 800
            // })
            setTimeout(function(){
              row.status =0;
            },500);
            this.getList();
          }
        })
      },
      showInnavigate(row) {
        // console.log(row)
        let obj = {
          id: row.id,
          // navigateIndex: row.navigateIndex,
          // optType: 'update'
        }
        showInnavigate(obj).then(res => {
          if(res.result.code == 0){
            if(res.result.result.navigateIndex == 0) {
              this.$message({
                type: 'success',
                message: '导航栏不显示了！',
                duration: 800
              })
              this.getList();
            }else{
              this.$message({
                type: 'success',
                message: '显示在导航栏了！',
                duration: 800
              })
              this.getList();
            }
          }else{
            // this.$message({
            //   type: 'warning',
            //   message: '操作不成功，请联系管理员！',
            //   duration: 800
            // })
            setTimeout(function(){
              row.navigateIndex =0;
            },500);
            this.getList();
          }
        })
      }
    }
  }
</script>
<style></style>
