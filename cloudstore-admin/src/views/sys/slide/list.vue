<template>
  <div style="margin: 0 20px">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right; margin-right: 20px" size="mini" @click="handleAddPic">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="图片"  align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.piceUrl" style="width: 50px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称"  align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="类型"  align="center">
          <template slot-scope="scope">{{scope.row.type | showMsg}}</template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleUpdatePic(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDeletePic(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getSlidelist, delSlide} from '@/api/indexSlid'
  export default {
    name: "list",
    data() {
      return {
        list: [],
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      showMsg(data) {
        switch (data) {
          case "active": return "活动";
            break;
          case "url": return "链接";
            break;
            default: "数据读取错误";
        }
      }
    },
    methods: {
      getList() {
        getSlidelist().then(res => {
          console.log(res);
          this.list = res.result.result.records;
        })
      },
      handleAddPic() {
        this.$router.push('/sys/manager/index/slideshow');
      },
      handleUpdatePic(row) {
        this.$router.push({path: '/sys/manager/index/slideshow', query: {id: row.id}});
      },
      handleDeletePic(row) {
        this.$confirm('是否删除该条数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSlide({ids: row.id}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 800
              })
              this.getList();
            }
          })
        }).catch(e => e);
      }
    }
  }
</script>

<style scoped>

</style>
