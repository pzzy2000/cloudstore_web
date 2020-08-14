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
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="listQuery.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择活动开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker v-model="listQuery.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择活动结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select v-model="listQuery.status" placeholder="请选择是否启用" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否参加佣金：">
            <el-select v-model="listQuery.addProfit" placeholder="请选择是否参加佣金" clearable>
              <el-option v-for="item in brokerageList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否删除：">
            <el-select v-model="listQuery.isDelete" placeholder="请选择是否删除" clearable>
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
        <el-table-column label="活动图片" align="center" fixed>
          <template slot-scope="scope"><el-image :src="scope.row.picturePice" style="width: 35px; height: 35px; border-radius: 50%"></el-image></template>
        </el-table-column>
        <el-table-column label="活动名称" align="center" fixed>
           <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.startTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.endTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="是否参加佣金" align="center">
          <template slot-scope="scope">{{scope.row.addProfit | changeMsg}}</template>
        </el-table-column>
        <el-table-column label="是否显示在首页" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.showIndex" :active-value="1" :inactive-value="0" active-color="#409eff" inactive-color="#dcdfe6" @change="changeSwitch(scope.row)">
            </el-switch>
<!--            <div v-else>{{scope.row.activityBean.name}}</div>-->
<!--            v-if="!scope.row.activityBean.name"-->
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#409eff" inactive-color="#dcdfe6" @change="onoffAct(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示在导航栏" align="center" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.navigateIndex" :active-value="1" :inactive-value="0" active-color="#409eff" inactive-color="#dcdfe6" @change="showInnavigate(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否删除" align="center" :formatter="changeStatus">
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="associatedGood(scope.row)">关联商品</el-button>
            <el-button size="mini" @click="updateAct(scope.row)">修改活动</el-button>
            <el-button type="danger" size="mini" @click="handeldelGoods(scope.row)" v-show="isshow" :disabled="scope.row.isDelete == 1 ? true : false || scope.row.status == 1 ? true : false">删除</el-button>
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
        list: [],
        total: 0,
        listLoading: true,
        multipleSelection: [],
        isshow: false,
        statusList: [{label: "已开启", value: '1'}, {label: "未开启", value: '0'}],
        brokerageList: [{label: "已参加", value: '1'}, {label: "未参加", value: '0'}],
        delList: [{label: "已删除", value: '1'}, {label: "正常", value: '0'}]
      }
    },
    created() {
      this.getList(1);
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
      // isDelete() {
      //   console.log(this.isDelete)
      // }
    },
    // computed: {
    //   isDelete() {
    //     return this.list[0].isDelete;
    //   }
    // },
    activated() {
      this.getList(1);
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
      getList(idx) {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
          if (idx == 0) {
            if (response.result.result.records.length == 0) {
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
        });
      },
      handleSearchList() {
        if (this.listQuery.isDelete == '') {
          delete this.listQuery.isDelete;
        }
        this.listQuery.pageNum = 1;
        this.getList(0);
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
              this.getList(1);
            }else{
              this.$message({
                type: 'success',
                message: '显示在首页了！',
                duration: 800
              })
              this.getList(1);
            }
          }else{
            setTimeout(function(){
              row.status = 0;
            },500);
            this.getList(1);
          }
        })
      },
      changeStatus(row) {
        switch (row.isDelete) {
          case 0: return "正常";
            break;
          case 1: return "已删除";
            break;
          default: return "数据读取错误";
            break;
        }
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
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
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList(2);
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
          query: {id: row.id, status: row.status}
        })
      },
      handeldelGoods(row) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delActivity({ids: row.id}).then(res => {
            if (res.result.code == 0) {
              if (this.total % this.listQuery.pageSize === 1) {    // 表格总数量 % 行数  余出的就是当前页有几个
                const lastPage = (this.total + this.listQuery.pageSize - 1) / this.listQuery.pageSize  // （表格总数量 +行数 -1) / 行数
                if (this.listQuery.pageNum === lastPage) { // 当前页 === （表格总数量 +行数 -1) / 行数
                  this.listQuery.pageNum = this.listQuery.pageNum - 1 // 减去一页就是前一页
                }
              }
              this.$message({
                message: '删除活动成功!',
                type: 'success',
                duration: 800
              })
              this.getList(1);
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
              this.getList(1);
            }else{
              this.$message({
                type: 'success',
                message: '活动启用了！',
                duration: 800
              })
              this.getList(1);
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
            this.getList(1);
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
              this.getList(1);
            }else{
              this.$message({
                type: 'success',
                message: '显示在导航栏了！',
                duration: 800
              })
              this.getList(1);
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
            this.getList(1);
          }
        })
      },
      updateAct(row) {
        this.$router.push({path: "/sys/activity/addact", query: {id: row.id}})
      }
    }
  }
</script>
<style></style>
