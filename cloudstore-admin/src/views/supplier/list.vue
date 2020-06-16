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
          <el-form-item label="供应商名字：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="用户名字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center" fixed></el-table-column>
        <el-table-column label="供应商名称" width="120" align="center" fixed>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="供应商等级" width="140" align="center">
          <template slot-scope="scope">{{scope.row.sysSupplierRankId}}</template>
        </el-table-column>
        <el-table-column label="是否删除" width="140" align="center" :formatter="deleteStatus">

        </el-table-column>
        <el-table-column label="审核状态" width="140" align="center" :formatter="showStatus">
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="mini" @click="handleUpdateUserInfo(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {
    fetchList
  } from '@/api/supplier'
  import {
    msg
  } from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,

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
        userStatuses: [{ //0:正常;1:违规关闭;2:永久关闭
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '违规关闭'
        }, {
          value: 2,
          label: '永久关闭'
        }],
        userTypes: [
          //   {
          //   value: 'supplier',
          //   label: '供应商'
          // },
          {
            value: 'platform',
            label: '平台管理'
          }
        ],
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
      showStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 1:
            return '申请';
          case 2:
            return '拒绝';
          case 3:
            return '通过';
          default:
            return '正常';
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭
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
        // 状态;0:正常;1:违规关闭;2:永久关闭
        },

      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        });
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
          path: '/sys/manager/user/edit',
          query: {
            userId: userId,
            pageNum: pageNum,
            pageSize: pageSize
          }
        });
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
