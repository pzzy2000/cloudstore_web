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
          <el-form-item label="代理商名字：">
            <el-input style="width: 214px" v-model="listQuery.name" placeholder="代理商名字" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input style="width: 214px" v-model="listQuery.phone" placeholder="联系电话" clearable></el-input>
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
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
<!--      <el-button size="mini" style="float: right" @click="addagency">添加</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center" fixed></el-table-column>
        <el-table-column label="代理商名字" align="center" fixed>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center" width="300" :formatter="showAddress">
        </el-table-column>
        <el-table-column label="详细地址" align="center" width="300">
          <template slot-scope="scope">{{scope.row.detailAddress}}</template>
        </el-table-column>
<!--        <el-table-column label="代理商等级" width="150" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.sysSupplierRankId}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="审核状态" align="center" :formatter="showStatus">
        </el-table-column>
        <el-table-column label="是否删除" align="center" :formatter="deleteStatus">
        </el-table-column>

        <el-table-column label="操作" align="center" v-if="powershowing(power.agent_info)">
          <template slot-scope="scope">
            <el-button size="mini" @click="showinfo(scope.$index, scope.row)">查看
            </el-button>
<!--            <el-button size="mini" @click="editinfo(scope.$index, scope.row)">编辑-->
<!--            </el-button>-->
<!--            <el-button type="danger" size="mini" @click="deleteinfo(scope.$index, scope.row)">删除-->
<!--            </el-button>-->
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
  import { fetchList, delAgent } from '@/api/agent'
  import { msg } from '@/api/iunits'
  import {powershow} from "@/utils/power";
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  export default {
    name: "agentlist",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        brandOptions: [],
        statusList: [{
          value: 0,
          label: '待审核'
        }, {
          value: 1,
          label: '已通过'
        }, {
          value: 2,
          label: '已拒绝'
        }],
        delList: [{label: "已删除", value: '1'}, {label: "未删除", value: '0'}],
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
      showAccess(row, column) {
        return (row.sysManagerUserBean == null) ? '数据读取错误' : row.sysManagerUserBean.name;
      },
      showAddress(row, column) {
        try {
          return row.provinceBean.name + " " + row.cityBean.name + " " + row.areaBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      addagency() {
        this.$router.push({path: '/sys/agent/info', query: {type: 'add', rds: 'write'}})
      },
      showStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 0:
            return '待审核';
          case 1:
            return '已通过';
          case 2:
            return '已拒绝';
          default:
            return '正常';
        }
      },
      deleteStatus(row, column) {
        let status = row.status;
        switch (status) {
          case 0:
            return '已删除';
          case 1:
            return '未删除';
          default:
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
      showinfo(index, row) {
        let pageNum = this.listQuery.pageNum;
        let pageSize = this.listQuery.pageSize;
        let id = row.id;
        this.$router.push({
          path: '/sys/agent/info',
          query: {
            agentId: id,
            action:0,
            type: 'read',
            rds: 'read'
          }
        });
      },
      editinfo(index, row) {
        this.$router.push({path: '/sys/agent/info', query: {agentId: row.id, type: 'update', rds: 'write'}})
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
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList(2);
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
      deleteinfo(index, row) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgent({ids: row.id}).then(res => {
            console.log(res);
          })
        }).catch(() => {alert("不删除")})
      }
    }
  }
</script>
<style></style>
