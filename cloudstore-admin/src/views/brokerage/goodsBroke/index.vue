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
          <el-form-item label="商品名称：" prop="name">
            <el-input style="width: 214px" v-model="listQuery.goodsName" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="供应商信息：">
            <remoteCom v-model="listQuery.supplierIds" ref="clearInput" url="/manage/search/supplier/search" @tochild="tochild"></remoteCom>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container" style="margin: 20px">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.goodsName}}</template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品分类" align="center" :formatter="showMsg" prop="category">
        </el-table-column>
        <el-table-column label="所属供应商" align="center" :formatter="showMsg" prop="supplierName">
        </el-table-column>
        <el-table-column label="所属店铺" align="center" :formatter="showMsg" prop="supplierShop">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" v-if="powershowing(power.broke_setting)">
          <template slot-scope="scope">
            <el-button type="primary" @click="settingBroke(scope.row)" size="mini">设置佣金</el-button>
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
  import {fetchList} from '@/api/brokerage'
  import remoteCom from '@/components/remoteCom'
  import {powershow} from "@/utils/power";
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "index",
    components: {
      remoteCom
    },
    data() {
      return {
        list: [],
        listLoading: true,
        listQuery: Object.assign({}, defaultList),
        total: 0,
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList(1);
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      tochild(item, callback){
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`供应商账号：${item.name} / 供应商电话：${item.phone}`);
      },
      showMsg(row, col) {
        switch (col.property) {
          case "supplierName":{
            try{
              return row.supplierBean.name;
            }catch (e) {
              return "数据读取错误";
            }
          }
          case "supplierShop":{
            try{
              return row.supplierShopBean.shopName;
            }catch (e) {
              return "数据读取错误";
            }
          }
          case "category":{
            try{
              return row.categoryOneBean.name + '/' + row.categoryTwoBean.name;
            }catch (e) {
              return "数据读取错误";
            }
          }
        }
      },
      handleSelectionChange() {},
      settingBroke(row) {
        this.$router.push({path: '/broke/rage/settingBroke', query: {id: row.id}})
      },
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
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultList);
        this.$refs.clearInput.clearInput();
        this.getList(2)
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(1);
      }
    }
  }
</script>

<style scoped>

</style>
