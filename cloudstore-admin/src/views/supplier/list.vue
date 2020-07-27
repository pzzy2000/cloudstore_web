<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right;margin-bottom: 10px;" @click="handleSearchList()" type="primary" size="small">
          查询
        </el-button>
        <el-button style="float: right;margin-right: 15px;margin-bottom: 10px;" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="padding-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="130px">
          <el-form-item label="供应商名称：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="供应商电话：">
            <el-input style="width: 214px" v-model="listQuery.phone" placeholder="供应商电话"></el-input>
          </el-form-item>
          <el-form-item label="所属账号：">
            <el-input style="width: 214px" v-model="listQuery.accont" placeholder="所属账号"></el-input>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="请选择审核状态" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否删除：">
            <el-select v-model="listQuery.isDelete" placeholder="请选择是否删除" clearable>
              <el-option v-for="item in delList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <remoteCom></remoteCom>
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
        <el-table-column label="供应商名称"  align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="供应商电话"  align="center">
          <template slot-scope="scope">{{scope.row.phone | changeMis}}</template>
        </el-table-column>
        <el-table-column label="所属账号"  align="center" :formatter="showAccess">
        </el-table-column>
        <el-table-column label="审核状态"  align="center" :formatter="showStatus">
        </el-table-column>
        <el-table-column label="是否删除"  align="center" :formatter="deleteStatus">
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleUpdateUserInfo(scope.$index, scope.row)">查看
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>
    -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {fetchList} from '@/api/supplier'
  import remoteCom from '@/components/remoteCom'
  import {msg} from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  export default {
    name: "productList",
    components: {
      remoteCom
    },
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
        }],
        statusList: [{label: "待审核", value: '1'}, {label: "已通过", value: '3'}, {label: "已拒绝", value: '2'}],
        delList: [{label: "已删除", value: '1'}, {label: "未删除", value: '0'}]
      }
    },
    created() {
      this.getList(1);
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
      },
      changeMis(data) {
        if (data !== null) {
          return data;
        }else{
          return "数据读取错误"
        }
      }
    },
    methods: {
      showAccess(row,column){
        return ( row.sysManagerUserBean ==null )?'数据读取错误':row.sysManagerUserBean.name ;
      },
      showStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 0:
            return '待审核';
          case 1:
            return '正常';
          case 2:
            return '违规关闭';
          default: return "数据读取错误";
            breal;
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭
      },

      deleteStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 0:
            return '已删除';
            break;
          case 1:
            return '未删除';
            break;
          default: return "正常";
            break;
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭
      },
      getList(idx) {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
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
        this.getList(2)
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
    }
  }
</script>

<style scoped>
  .el-table >>> td{
    padding: 0 !important;
  }
</style>
