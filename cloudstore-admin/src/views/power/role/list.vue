<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>角色列表</span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="list" style="width:100%" v-loading="listLoading" border>
        <!--@selection-change="handleSelectionChange": 多选操作可以用到-->
        <el-table-column type="selection" width="60px" align="center" fixed ></el-table-column>
        <el-table-column label="角色名" align="center" fixed>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="角色类型" align="center">
          <template slot-scope="scope">{{scope.row.userType}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"  @click="readOrder(scope.$index, scope.row)">管理模块</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container" style="margin-right: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="pageList.pageSize"
        :page-sizes="[10]"
        :current-page.sync="pageList.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <div style="height: 200px;">
        <el-steps direction="vertical" :active="1">
          <el-step title="步骤 1">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
          <el-step title="步骤 2">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
          <el-step title="步骤 3">
            <i class="el-icon-circle" slot="icon"></i>
          </el-step>
        </el-steps>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import {fetchList} from '@/api/role'
    import { formatDate } from '@/assets/common/data.js'
    const defaultList = {
      pageNum: 1,
      pageSize: 100,
      optType:'search'
    };
    let that;
    export default {
      name: "module_list",
      data() {
        return {
          activeIndex: '1',
          searchList: {},
          list: [],
          listLoading: false,
          pageList: Object.assign({}, defaultList),
          total: 1,
          dialogVisible: false,
          btnMsg: '',
          type: ''
        }
      },
      beforeCreate() {
        that = this;
      },
      created() {
        this.getList();
      },
      filters: {
        // 时间格式自定义 只需把字符串里面的改成自己所需的格式
        formatDate(time) {},
        changeStatus(data) {},
        changeMsg(data) {}
      },
      methods: {
        getList() {
          fetchList(this.pageList).then(res => {
            if (res.result.code == 0) {
              this.list = res.result.result.records;
              this.total = parseInt(res.result.result.total);
            }
          })
        },
        showDanger() {
          this.isshow = false;
        },
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        },
        handleSearchList() {
          alert("搜索事件！")
        },
        handleResetSearch(formName) {
          this.$refs[formName].resetFields();
        },
        handleSizeChange() {
          this.getList();
        },
        handleCurrentChange() {
          this.getList();
        },
        readOrder(index, row){
          this.$router.push({name: "role_module_list", query: {roleId: row.id}});
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(() => {
              done();
            })
            .catch(() => {});
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
