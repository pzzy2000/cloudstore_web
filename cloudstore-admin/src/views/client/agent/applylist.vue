<template>
  <div>
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="名字：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="名字" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input style="width: 203px" v-model="listQuery.phone" placeholder="手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="商铺名称：">
            <el-input style="width: 203px" v-model="listQuery.shopName" placeholder="商铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="申请代理类型：">
            <el-select v-model="listQuery.agentType" placeholder="请选择申请代理类型" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="地址" width="300" align="center" :formatter="showAddress">
        </el-table-column>
        <el-table-column label="商铺名称" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="申请代理类型" align="center">
          <template slot-scope="scope">{{scope.row.agentType | changeType}}</template>
        </el-table-column>
        <el-table-column label="证件类型" align="center">
          <template slot-scope="scope">{{scope.row.cardType | changeCt}}</template>
        </el-table-column>
        <el-table-column label="证件号码" align="center" width="200">
          <template slot-scope="scope">{{scope.row.cardNo}}</template>
        </el-table-column>
        <el-table-column label="详细住址" align="center">
          <template slot-scope="scope">{{scope.row.detailAddress}}</template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">{{scope.row.status | changeStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center" v-if="powershowing(power.agent_apply_info)">
          <template slot-scope="scope">
            <el-button size="mini" @click="delLogis(scope.row)">{{scope.row.status | changeMsg}}</el-button>
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
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: "search"
  }
  import {fetchList} from '@/api/client'
  import {powershow} from "@/utils/power";
  export default {
    name: "userapply",
    data() {
      return {
        orderList: [],
        listQuery: Object.assign({}, defaultList),
        listLoading: false,
        brandOptions: [],
        publishStatusOptions: [],
        verifyStatusOptions: [{label: '待审核', value: '0'}, {label: '已通过', value: '1'}, {label: '已拒绝', value: '2'}],
        total: 0,
        statusList: [{label: "团长", value: 'leader'}, {label: "代理", value: 'agent'}],
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList(1);
    },
    activated() {
      this.getList(1);
    },
    filters: {
      changeCt(data) {
        switch (data) {
          case "IDCard": return "身份证";
            break;
        }
      },
      changeMsg(data) {
        switch (data) {
          case 0: return "去审核";
            break;
          case 1: return "查看";
            break;
          case 2: return "查看";
            break;
        }
      },
      changeStatus(data){
        switch (data) {
          case 0: return "待审核";
            break;
          case 1: return "已通过";
            break;
          case 2: return "已拒绝";
            break;
        }
      },
      changeType(data) {
        switch (data) {
          case "leader": return "团长";
            break;
          case "agent": return "代理";
            break;
          default: return "数据读取出错";
            break;
        }
      }
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      getList(idx) {
        fetchList(this.listQuery).then(res => {
          console.log(res);
          this.orderList = res.result.result.records;
          this.total = parseInt(res.result.result.total);
          if (idx == 0) {
            if (res.result.result.records.length == 0) {
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
        })
      },
      showAddress(row, column) {
        try {
          return row.provinceBean.name + row.cityBean.name + row.areaBean.name + row.townBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      delLogis(row) {
        this.$router.push({path: "/sys/client/agent/apply/info", query: {id: row.id}})
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
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultList);
        this.getList(2);
      },
    }
  }
</script>

<style scoped>

</style>
