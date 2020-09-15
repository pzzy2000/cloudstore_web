<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>角色模块列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center"></el-table-column>
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
      <div style="text-align: center; margin: 20px 0">
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
  import {fetchRoleModuleList, roleModueSaveRemove, saveChecked} from '@/api/role'
  import {
    msg
  } from '@/api/iunits'
  // const defaultList = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   optType:'search'
  // };
  export default {
    name: "module_list",
    data() {
      return {
        activeIndex: '1',
        searchList: {},
        list: [],
        listLoading: false,
        pageList: {},
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
        this.listLoading = true;
        this.pageList.roleId = this.$route.query.roleId
        fetchRoleModuleList(this.pageList).then(res => {
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
            this.listLoading = false;
          }
        })
      },
      roleModueSaveRole(params,idx){
        roleModueSaveRemove(params).then(res => {
          // this.disabled = false;
          if (res.result.code == 0) {
            if(idx==0){
              msg("删除关联模块成功");
            }else{
              msg("模块关联成功");
            }
          }
        })
      },

      changeSwitch(idx , row){
        // this.disabled = true;
        let params={
          roleId:this.$route.query.roleId,
          moduleId:row.id
        }
        if (idx == 0) {  //断开
           params.optType="update";
           this.roleModueSaveRole(params ,idx );
        } else { //关联
        params.optType="save";
        this.roleModueSaveRole(params ,idx );
        }

      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      // handleCurrentChange(val) {
      //   this.pageList.pageNum = val;
      //   this.getList();
      // },
      // handleSizeChange(val) {
      //   this.pageList.pageNum = 1;
      //   this.pageList.pageSize = val;
      //   this.getList();
      // },
      submit() {
        this.$confirm('是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveChecked({roleId: this.$route.query.roleId, optIds: this.checkList}).then(res => {
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
  .el-menu{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-menu.el-menu-demo{
    border: none;
  }
  .el-menu-item{
    width: 150px;
    height: 40px;
    margin-left: 20px;
    line-height: 40px;
    text-align: center;
  }
  .el-menu .el-menu-item:hover{
    color: #1abc9c;
  }
  .el-menu .el-menu-item span{
    color: red;
  }
  .el-menu--horizontal>.el-menu-item.is-active{
    border: none;
    background-color: #1abc9c !important;
    color: white;
  }
  .el-menu--horizontal>.el-menu-item.is-active span{
    color: white;
  }
  .el-menu-item{
    border-bottom-color: #e4e4e4 !important;
    border: 1px solid #e4e4e4;
  }
  .el-step.is-vertical >>> .el-step__icon{
    width: 12px !important;
    height: 12px !important;
  }
  .el-step.is-vertical >>> .el-step__line{
    display: none !important;
  }
  .el-step.is-vertical >>> .el-step__main{
    padding: 0;
  }
  .el-step.is-vertical >>> .el-step__head.is-finish {
    color: #c0c4cc !important;
    border-color: #c0c4cc !important;
  }
  .el-step.is-vertical >>> .el-step__title.is-finish {
    color: #c0c4cc;
  }
  .el-step.is-vertical >>> .el-step__description.is-finish {
    color: #c0c4cc;
  }
</style>
