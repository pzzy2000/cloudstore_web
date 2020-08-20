<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct" size="mini">
        添加
      </el-button>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="密码" align="center">
          <template slot-scope="scope">{{scope.row.password}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="udpLogis(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delLogis(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getUserlist, deluser} from '@/api/sysManager'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  }
  export default {
    name: "manageController",
    data() {
      return {
        pageList: Object.assign({}, defaultList),
        list: [],
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        getUserlist(this.pageList).then(res => {
          if (res.result.code == 0) {
            this.list = res.result.result.records;
          }
        })
      },
      handleAddProduct() {
        this.$router.push("/sys/manager/adduser");
      },
      udpLogis(row) {
        this.$router.push({path: "/sys/manager/adduser", query: {id: row.id}});
      },
      delLogis(row) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deluser({ids: row.id}).then(res => {
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
      }
    }
  }
</script>

<style scoped>

</style>
