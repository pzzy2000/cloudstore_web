<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttrCate()" size="mini" v-show="isshow">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading"
                border>
       <!-- <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
        <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.propertyName}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.descs}}</template>
        </el-table-column>
        <el-table-column label="规格数量"  align="center">
          <template slot-scope="scope">{{scope.row.specificationsNumber==null?0:scope.row.specificationsNumber}}</template>
        </el-table-column>
        <el-table-column label="参数数量"  align="center">
          <template slot-scope="scope">{{scope.row.parametersNumber==null?0:scope.row.parametersNumber}}</template>
        </el-table-column>
        <el-table-column label="设置"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getAttrList(scope.$index, scope.row)">规格列表
            </el-button>
            <el-button
              size="mini"
              @click="getParamList(scope.$index, scope.row)">参数列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" v-if="isshow">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList,deleteProductAttrCate} from '@/api/productAttrCate'

  export default {
    name: 'productAttrCateList',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        dialogVisible: false,
        dialogTitle:'',
        isshow: true
      }
    },
    created() {
      this.getList();
      switch (localStorage.getItem('userType')){
        case 'platform': this.isshow = false;
          break;
        case 'supplier': this.isshow = true;
          break;
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = response.result.result.records.total;
        });
      },
      addProductAttrCate() {
        this.$router.push({path: "/sys/goods/property/add", query: {isAdd: 'add'}});
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductAttrCate({'ids':row.id}).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        // this.dialogVisible = true;
        // this.dialogTitle = "编辑类型";
        // this.productAttrCate.propertyName = row.propertyName;
        // this.productAttrCate.descs = row.descs;
        // this.productAttrCate.id = row.id;
        this.$router.push({path: "/sys/goods/property/update", query: {propertyName: row.propertyName, descs: row.descs, id: row.id, isAdd: 'update'}});
      },
      getAttrList(index, row) {
        this.$router.push({path: '/sys/goods/property/specs/list',query:{goodsPropertyId:row.id,propertyName:row.propertyName,type:0}})
      },
      getParamList(index, row) {
        this.$router.push({path: '/sys/goods/property/param/list',query:{goodsPropertyId:row.id,propertyName:row.propertyName,type:1}})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
