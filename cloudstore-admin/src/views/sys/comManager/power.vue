<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>权限列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="模块" align="center" width="400">
          <template slot-scope="scope">{{scope.row.module}}</template>
        </el-table-column>
        <el-table-column label="功能" align="left">
          <template slot-scope="scope">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in scope.row.opts" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="submit" size="small">提交</el-button>
        <el-button @click="backPage" size="small" style="margin-left: 20px; margin-bottom: 50px">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {powerList, isLink, isUnlink, saveChecked} from '@/api/sysManager'
  export default {
    name: "power",
    data() {
      return {
        activeIndex: '1',
        searchList: {},
        list: [],
        listLoading: false,
        disabled: false,
        checkList: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        powerList({comManagerUserId: this.$route.query.id}).then(res => {
          if (res.result.code == 0) {
            this.list = res.result.result.records;
            for (let i=0; i<this.list.length; i++) {
              for (let j=0; j<this.list[i].opts.length; j++) {
                if (this.list[i].opts[j].select == 1) {
                  this.checkList.push(this.list[i].opts[j].id);
                }
              }
            }
          }
        })
      },
      submit() {
        console.log(this.checkList);
        this.$confirm('是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveChecked({roleId: this.$route.query.id, optIds: this.checkList}).then(res => {
            if (res.result.code == 0) {
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 800
              })
            }
          })
        }).catch(e => e);
      },
      backPage() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>
