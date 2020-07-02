<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right;margin-bottom: 10px;" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px;margin-bottom: 10px;" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="等级名称：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="用户名字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right" @click="add()" size="mini">添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center" fixed></el-table-column>
        <el-table-column label="等级名称"  align="center" fixed>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="等级编码"  align="center">
          <template slot-scope="scope">{{scope.row.levelCode}}</template>
        </el-table-column>

        <el-table-column label="上架数量"  align="center">
          <template slot-scope="scope">{{scope.row.putNumber}}</template>
        </el-table-column>

        <el-table-column label="是否删除"  align="center" :formatter="deleteStatus">

        </el-table-column>

        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="readLevel(scope.$index, scope.row)">查看
            </el-button>
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList,saveUpdateLevel} from '@/api/agent'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    name:null,
  };
  export default {
    name: "productList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        dialogTitle: '',
        multipleSelection: [],
        userTypes: [
          {
            value: 'platform',
            label: '平台管理'
          }
        ]
      }
    },
    created() {
      this.getList();
    },
    watch: {
      selectProductCateValue: function(newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }
      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
      showAccess(row,column){
           return ( row.sysManagerUserBean ==null )?'数据读取错误':row.sysManagerUserBean.name ;
      },
      deleteStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 0:
            return '未删除';
          case 1:
            return '已删除';
          default:
            return '正常';
        }
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = response.result.result.records.total;
        });
      },
      add() {
        this.$router.push({path: "/sys/agent/addlevel", query: {type: "add", rds: 'write'}})
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleUpdateUserInfo(index, row) {
        let pageNum = this.listQuery.pageNum;
        let pageSize = this.listQuery.pageSize;
        let userId = row.id;
        this.$router.push({
          path: '/sys/supplier/info',
          query: {
            supplierId: userId,
            pageNum: pageNum,
            pageSize: pageSize
          }
        });
      },
      handleUpdate(index, row) {
        // this.dialogVisible = true;
        // this.dialogTitle = "编辑类型";
        // this.levelModel.levelName = row.levelName;
        // this.levelModel.levelCode = row.levelCode
        // this.levelModel.putNumber = row.putNumber;
        // this.levelModel.id = row.id;
        this.$router.push({path: "/sys/agent/addlevel", query: {type: "update", id: row.id, rds: 'write'}})
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        this.$message({
          message: '重置成功',
          type: 'success',
          duration: 800
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1, ids);
        });
      },
      readLevel(index, row) {
        this.$router.push({path: "/sys/agent/addlevel", query: {type: "read", id: row.id, rds: 'read'}})
      }
    }
  }
</script>
<style></style>
