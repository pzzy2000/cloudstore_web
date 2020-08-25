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
        <el-table-column label="功能" align="center">
          <template slot-scope="scope">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in scope.row.opts" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="submit" size="small">提交</el-button>
        <el-button @click="backPage" size="small" style="margin-left: 20px">返回</el-button>
      </div>
    </div>
<!--    <div class="pagination-container" style="margin-right: 20px">-->
<!--      <el-pagination-->
<!--        background-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        layout="total, sizes,prev, pager, next,jumper"-->
<!--        :page-size="pageList.pageSize"-->
<!--        :page-sizes="[10]"-->
<!--        :current-page.sync="pageList.pageNum"-->
<!--        :total="total">-->
<!--      </el-pagination>-->
<!--    </div>-->
  </div>
</template>

<script>
  import {powerList, isLink, isUnlink, saveChecked} from '@/api/sysManager'
  // const defaultList = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   optType:'search'
  // };
  export default {
    name: "power",
    data() {
      return {
        activeIndex: '1',
        searchList: {},
        list: [],
        listLoading: false,
        // pageList: Object.assign({}, defaultList),
        // total: 1,
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
            // this.total = parseInt(res.result.result.total);
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
      // handleCurrentChange(val) {
      //   this.pageList.pageNum = val;
      //   this.getList();
      // },
      // handleSizeChange(val) {
      //   this.pageList.pageNum = 1;
      //   this.pageList.pageSize = val;
      //   this.getList();
      // },
      // changeSwitch(e, row) {
      //   if (e == 1) {//保存
      //     isLink({comManagerUserId: this.$route.query.id, sysModuleId: row.id, optType: 'save'}).then(res => {
      //       if (res.result.code == 0) {
      //         this.$message({
      //           message: "关联成功",
      //           type: 'success',
      //           duration: 800
      //         })
      //       } else {
      //         setTimeout(function () {
      //           row.link = 0;
      //         }, 800)
      //       }
      //     })
      //   } else {
      //     isUnlink({comManagerUserId: this.$route.query.id, sysModuleId: row.id, optType: 'remove'}).then(res => {
      //       if (res.result.code == 0) {
      //         this.$message({
      //           message: "取消关联成功",
      //           type: 'success',
      //           duration: 800
      //         })
      //       } else {
      //         setTimeout(function () {
      //           row.link = 1;
      //         }, 800)
      //       }
      //     })
      //   }
      // }
    }
  }
</script>

<style scoped>

</style>
