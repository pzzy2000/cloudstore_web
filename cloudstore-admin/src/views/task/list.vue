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
          <el-form-item label="所属账号：">
            <remoteCom v-model="listQuery.supplierId" ref="clearInput" url="/manage/search/manager/search" @tochild="tochild"></remoteCom>
            <!--            <el-input style="width: 214px" v-model="listQuery.accont" placeholder="所属账号"></el-input>-->
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
        <el-table-column label="任务名称"  align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="任务类型"  align="center">
          <template slot-scope="scope">{{scope.row.type | changeMis}}</template>
        </el-table-column>
        <el-table-column label="计划开始时间" prop="startTime" align="center">
        </el-table-column>
        <el-table-column label="执行计划" align="center" prop="exePlan">
        </el-table-column>
        <el-table-column label="执行方法"  align="center" prop="className">
        </el-table-column>
        <el-table-column label="计划描述"  align="center" prop="desc">
        </el-table-column>
        <el-table-column label="状态"  align="center" prop="status" :formatter="showStatus">
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleStart(scope.$index, scope.row)">开始</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
                     :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {fetchList, planStart} from '@/api/task'
  import remoteCom from '@/components/remoteCom'
  import {msg} from '@/api/iunits'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
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
        statusList: [{label: "待审核", value: '0'}, {label: "已通过", value: '1'}, {label: "违规关闭", value: '2'}],
        delList: [{label: "已删除", value: '1'}, {label: "未删除", value: '0'}]
      }
    },
    created() {
      this.getList(1);
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
        if (data == 'timer') {
          return '定时';
        }else{
          return "数据读取错误"
        }
      }
    },
    methods: {
      tochild(item, callback){
        console.log(item)
        // return `用户名称：${item.name} / 用户账号：${item.access}`;
        callback(`所属账号：${item.name} / 联系人：${item.phone}`);
      },
      showStatus(row, col) {
        switch (row.status) {
          case 'start': return "启动";
            break;
          case 'stop': return  "暂停";
            break;
          case 'delete': return "删除";
            break;
          default: return "数据读取出错";
            break;
        }
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
      handleStart(index, row) {
        this.$confirm('是否开始?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          planStart({id: row.id}).then(res => {
            console.log(res);
          })
        }).catch(e => e);
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
        this.$refs.clearInput.clearInput();
        this.getList(2)
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("删除")
        }).catch(e => e);
      },
    }
  }
</script>

<style scoped>
</style>
