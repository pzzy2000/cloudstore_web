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
          <el-form-item label="用户名称：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="用户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="登录名：">
            <el-input style="width: 214px" v-model="listQuery.access" placeholder="登录名" clearable></el-input>
          </el-form-item>
          <el-form-item label="注册电话：">
            <el-input style="width: 214px" v-model="listQuery.phone" placeholder="注册电话" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户类型：">
            <el-select v-model="listQuery.userType" placeholder="用户类型" clearable>
              <el-option
                v-for="item in userTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker v-model="listQuery.createTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable type="date" placeholder="请选择活动创建时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="审核状态" clearable>
              <el-option
                v-for="item in userStatuses"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center" fixed ></el-table-column>
        <el-table-column label="用户名称"  align="center">
           <template slot-scope="scope">{{scope.row.name}}</template>
         </el-table-column>
        <el-table-column label="登录名"  align="center">
          <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="注册电话" align="center">
         <template slot-scope="scope">{{scope.row.access}}</template>
        </el-table-column>
        <el-table-column label="用户类型" align="center">
          <template slot-scope="scope">{{scope.row.userType | changeUser}}</template>
        </el-table-column>

         <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createDate}}</template>
        </el-table-column>

        <el-table-column label="审核状态" align="center" :formatter="showStatus" >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateUserInfo(scope.$index, scope.row)">编辑
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
        :page-sizes="[10]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import { fetchList, updateDeleteStatus } from '@/api/sysuser'
   import {msg}  from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10
    // userType:'platform',
  };
  export default {
    name: "productList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        brandOptions: [],
        userStatuses:[{  //0:正常;1:违规关闭;2:永久关闭
          value: 0,
          label: '正常'
        },{
          value: 1,
          label: '违规关闭'
        },{
          value: 2,
          label: '永久关闭'
        }],
        userTypes:[
        //   {
        //   value: 'supplier',
        //   label: '供应商'
        // },
        {
          value: 'platform',
          label: '平台管理'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }]
      }
    },
    created() {
      this.getList(1);
    },
    watch: {
      selectProductCateValue: function (newValue) {
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
      },
      changeUser(data) {
        switch (data) {
          case "platform": return "平台管理员";
            break;
          case "supplier": return "供应商";
            break;
          case "agent": return "代理商";
            break;
          default: return "数据读取出错";
            break;
        }
      }
    },
    methods: {
      showStatus(row, column){
        let  status  = row.status;
        switch(status){
          case 1: return '违规关闭';
          case 2: return  '永久关闭';
          default :
          return '正常';
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭

      },

      getList(idx) {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt( response.result.result.total);
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
      handleUpdateUserInfo(index, row){
        let  pageNum = this.listQuery.pageNum;
        let  pageSize =this.listQuery.pageSize;
        let   userId = row.id;
       this.$router.push({path:'/sys/manager/user/edit',query: {type: 'update', rds: 'write', userId: userId, pageNum:pageNum, pageSize:pageSize}});
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(1);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.publishStatus, ids);
      },
      handleNewStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.newStatus, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.recommandStatus, ids);
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList(2);
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateDeleteStatus({ids: row.id}).then(res => {
            console.log(res);
            if (res.result.code == 0) {
              this.$message({
                message: '删除成功！',
                type: 'success',
                duration: 800
              })
              this.getList(1);
            }
          });
        });
      },
      handleShowProduct(index, row) {
        let  pageNum = this.listQuery.pageNum;
        let  pageSize =this.listQuery.pageSize;
        this.$router.push({path:'/sys/manager/user/edit',query: {type: 'read', rds: 'read', userId: row.id, pageNum:pageNum, pageSize:pageSize}});
      },
      handleAddProduct() {
        this.$router.push({path:'/sys/manager/user/edit',query: {type: 'add', rds: 'write'}})
      }
      // handleUpdateProduct(index,row){
      //   this.$router.push({path:'/pms/updateProduct',query:{id:row.id}});
      // },
      // handleShowProduct(index,row){
      //   console.log("handleShowProduct",row);
      // },
      // handleShowVerifyDetail(index,row){
      //   console.log("handleShowVerifyDetail",row);
      // },
      // handleShowLog(index,row){
      //   console.log("handleShowLog",row);
      // },
      // updatePublishStatus(publishStatus, ids) {
      //   let params = new URLSearchParams();
      //   params.append('ids', ids);
      //   params.append('publishStatus', publishStatus);
      //   updatePublishStatus(params).then(response => {
      //     this.$message({
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 1000
      //     });
      //   });
      // },
      // updateNewStatus(newStatus, ids) {
      //   let params = new URLSearchParams();
      //   params.append('ids', ids);
      //   params.append('newStatus', newStatus);
      //   updateNewStatus(params).then(response => {
      //     this.$message({
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 1000
      //     });
      //   });
      // },
      // updateRecommendStatus(recommendStatus, ids) {
      //   let params = new URLSearchParams();
      //   params.append('ids', ids);
      //   params.append('recommendStatus', recommendStatus);
      //   updateRecommendStatus(params).then(response => {
      //     this.$message({
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 1000
      //     });
      //   });
      // },
      // updateDeleteStatus(deleteStatus, ids) {
      //   let params = new URLSearchParams();
      //   params.append('ids', ids);
      //   params.append('deleteStatus', deleteStatus);
      //   updateDeleteStatus(params).then(response => {
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success',
      //       duration: 1000
      //     });
      //   });
      //   this.getList();
      // }
    }
  }
</script>
<style></style>
