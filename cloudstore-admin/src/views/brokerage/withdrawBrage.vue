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
          <el-form-item label="用户信息：" prop="phone">
            <remoteCom v-model="listQuery.clientIds" ref="clearInput" url="/manage/search/client/search" @tochild="tochild"></remoteCom>
<!--            <el-input style="width: 214px" v-model="listQuery.phone" placeholder="用户账号" clearable></el-input>-->
          </el-form-item>
<!--          <el-form-item label="用户昵称：" prop="name">-->
<!--            <el-input style="width: 214px" v-model="listQuery.name" placeholder="用户昵称" clearable></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="佣金类型：" prop="phone">
            <el-select v-model="listQuery.userType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="用户账号" align="center" prop="userBean.phone" :formatter="showAcc">
<!--          <template slot-scope="scope">{{scope.row.userBean.access}}</template>-->
        </el-table-column>
        <el-table-column label="用户名称" align="center" prop="userBean.name" :formatter="showName">
<!--          <template slot-scope="scope">{{scope.row.}}</template>-->
        </el-table-column>
<!--        <el-table-column label="代理等级" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.endTime}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="已结算佣金" align="center">
          <template slot-scope="scope">{{scope.row.profited}}</template>
        </el-table-column>
        <el-table-column label="未结算佣金" align="center">
          <template slot-scope="scope">{{scope.row.profiting}}</template>
        </el-table-column>
        <el-table-column label="已结算积分" align="center">
          <template slot-scope="scope">{{scope.row.pointsed}}</template>
        </el-table-column>
        <el-table-column label="未结算积分" align="center">
          <template slot-scope="scope">{{scope.row.pointsing}}</template>
        </el-table-column>
<!--        <el-table-column label="未入账" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="申请提现金额" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="提现状态" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.payPrice}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="200px" align="center" v-if="powershowing(power.withdraw_info)">
          <template slot-scope="scope">
            <el-button size="mini" @click="readInfo(scope.$index, scope.row)">查看</el-button>
<!--            <el-button size="mini" @click="read(scope.row)" type="danger">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-right: 20px">
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
  </div>
</template>

<script>
  import {listUserBroke} from '@/api/brokerage'
  import { formatDate } from '@/assets/common/data.js'
  import remoteCom from '@/components/remoteCom'
  import {powershow} from "@/utils/power";
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "withdrawBrage",
    components: {
      remoteCom
    },
    data() {
      return {
        searchList: {},
        list: [],
        total: 0,
        listQuery: Object.assign({}, defaultList),
        listLoading: false,
        power: '',
        options: [{
          value: 'agent',
          label: '代理'
        }, {
          value: 'Client',
          label: '用户'
        }],
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
        callback(`用户账号：${item.phone} / 用户名称：${item.name}`);
      },
      getList(idx) {
        listUserBroke(this.listQuery).then(res => {
          if (res.result.code == 0) {
            this.list = res.result.result.records;
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
          }
        })
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList(0);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultList);
        this.$refs.clearInput.clearInput();
        this.getList(2);
      },
      readInfo(index, row) {
        this.$router.push({path: "/broke/rage/withdrawinfo", query: {id: row.userId}})
      },
      handleSizeChange() {
        this.getList(1);
      },
      handleCurrentChange() {
        this.getList(1);
      },
      showAcc(row) {
        try{
          return row.userBean.phone;
        }catch (e) {
          return "数据读取出错"
        }
      },
      showName(row) {
        try {
          return row.userBean.name;
        }catch (e) {
          return "数据读取出错"
        }
      }
    }
  }
</script>

<style scoped>
  .el-table >>> th.gutter{
    display: table-cell !important;
  }
</style>
