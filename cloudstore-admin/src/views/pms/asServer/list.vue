<template>
  <div style="margin: 20px">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" style="float: right" @click="addrules" v-if="powershowing(power.goods_Asserver_add)">添加条款</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
<!--        @selection-change="handleSelectionChange"-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="条款简介" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="rulesInfo(scope.row)" v-if="powershowing(power.goods_Asserver_info)">查看详情</el-button>
            <el-button size="mini" @click="updateInfo(scope.row)" v-if="powershowing(power.goods_Asserver_update)">更新条款</el-button>
            <el-button type="danger" size="mini" @click="handeldelRules(scope.row)" v-if="powershowing(power.goods_Asserver_delete)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getAslist, deleteRule} from '@/api/goodsAsServer'
  import {powershow} from "@/utils/power";
  export default {
    name: "list",
    data() {
      return {
        list: [],
        listLoading: true,
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList();
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      getList() {
        getAslist().then(res => {
          this.list = res.result.result.records;
          this.listLoading = false;
        })
      },
      addrules() {
        this.$router.push({path: '/sys/goods/goodsAsserver/add', query: {optType: 'save'}});
      },
      rulesInfo(row) {
        this.$router.push({path: '/sys/goods/goodsAsserver/info', query: {id: row.id, optType: 'read'}})
      },
      handeldelRules(row) {
        this.$confirm('是否要删除该条款', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRule({ids: row.id}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 800
              })
              this.getList();
            }
          })
        }).catch(e => e)
      },
      updateInfo(row) {
        this.$router.push({path: '/sys/goods/goodsAsserver/update', query: {id: row.id, optType: 'update'}})
      }
    }
  }
</script>

<style scoped>

</style>
