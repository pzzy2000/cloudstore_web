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
      <el-button class="btn-add" @click="add()" size="mini">添加
      </el-button>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center" fixed></el-table-column>
        <el-table-column label="等级名称"  align="center" fixed>
          <template slot-scope="scope">{{scope.row.levelName}}</template>
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-table-column label="编号" width="100" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-form ref="levelForm":model="levelModel" :rules="rules" label-width="120px">
        <el-form-item label="等级名字" prop="levelName">
          <el-input v-model="levelModel.levelName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="等级编码" prop="levelCode">
          <el-input v-model="levelModel.levelCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上架数量" prop="putNumber">
          <el-input v-model="levelModel.putNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('levelForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,saveUpdateLevel
  } from '@/api/agent'
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
        levelModel: [],
        dialogVisible: false,
        userTypes: [
          {
            value: 'platform',
            label: '平台管理'
          }
        ],
        rules: {
          levelName: [
            { required: true, message: '请输入等级名称', trigger: 'blur' }
          ]
        }
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
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = response.result.result.records.total;
        });
      },
      add() {
        this.dialogVisible = true;
        this.dialogTitle = "添加类型";
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
        this.dialogVisible = true;
        this.dialogTitle = "编辑类型";
        this.levelModel.levelName = row.levelName;
        this.levelModel.levelCode = row.levelCode
        this.levelModel.putNumber = row.putNumber;
        this.levelModel.id = row.id;
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
      handleConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.dialogTitle==="添加类型"){
              let data = {
                'levelName':this.levelModel.levelName,
                'levelCode':this.levelModel.levelCode,
                'putNumber':this.levelModel.putNumber,
                'optType':'save',
                };
                saveUpdateLevel(data).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                this.dialogVisible = false;
                this.getList();
              });
            }else{
              let data = {
                'levelName':this.levelModel.levelName,
                'levelCode':this.levelModel.levelCode,
                'putNumber':this.levelModel.putNumber,
                'optType':'update',
                };
              saveUpdateLevel(data).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.dialogVisible = false;
                this.getList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style></style>
