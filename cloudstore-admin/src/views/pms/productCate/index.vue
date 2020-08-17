<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button size="mini" style="float: right" @click="backPage" v-show="isshow">返回</el-button>
      <el-button type="primary" size="mini" style="float: right; margin-right: 20px" @click="addlevel" v-show="isview">添加</el-button>
    <!--  <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button> -->
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
       <el-table-column label="级别"  align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="排序"  align="center">
           <template slot-scope="scope">{{scope.row.sort}}</template>
         </el-table-column>
        <!-- <el-table-column label="导航栏" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否首页显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="设置" width="300" align="center">
          <template slot-scope="scope">
           <el-button
              size="mini"
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
            <el-button size="mini" @click="updateLevel(scope.row)" v-if="scope.row.level == 2 ? true : false">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeletethislevel(scope.$index, scope.row)"
              v-if="isview">删除
            </el-button>
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
        :page-sizes="[10,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus,deleteGoodlevel} from '@/api/productCate'

  export default {
    name: "productCateList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          parentId: 0,
        },
        isshow: true,
        isview: true
      }
    },
    created() {
      this.resetParentId();
      this.getList();
      if (this.$route.query.level == undefined){
        this.isshow = false;
      }else{
        this.isshow = true;
      }
      switch (localStorage.getItem('userType')){
        case 'platform': this.isview = true;
          break;
        case 'supplier': this.isview = false;
          break;
      }
    },
    activated() {
      this.getList();
    },
    // watch: {
    //   $route(route) {
    //     this.resetParentId();
    //     this.getList();
    //     if (this.$route.query.level == undefined){
    //       this.isshow = false;
    //     }else{
    //       this.isshow = true;
    //     }
    //   }
    // },
    methods: {
      updateLevel(row) {
        this.$router.push({
          path: "/sys/goods/category/add",
          query: {
            parentId: this.$route.query.parentId,
            level: 2,
            optType: 'update',
            id: row.id
          }
        })
      },
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.listQuery.parentId = this.$route.query.parentId;
        } else {
          this.listQuery.parentId = 0;
        }
      },
      handleAddProductCate() {
        // this.$router.push('/sys/goods/add');
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt( response.result.result.total);
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleNavStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('navStatus',row.navStatus);
        updateNavStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids=[];
        ids.push(row.id)
        data.append('ids',ids);
        data.append('showStatus',row.showStatus);
        updateShowStatus(data).then(response=>{
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      addlevel() {
        if (this.list.length != 0){
          this.$router.push({
            path: "/sys/goods/category/add",
            query: {
              parentId: this.$route.query.parentId,
              level: this.list[0].level
            }
          });
        }else if(this.$route.query.level == '1'){
          this.$router.push({
            path: "/sys/goods/category/add",
            query: {
              parentId: this.$route.query.parentId,
              level: 2
            }
          });
        }else if(this.$route.query.level == '2'){
          this.$router.push({
            path: "/sys/goods/category/add",
            query: {
              parentId: this.$route.query.parentId,
              level: 3
            }
          })
        }else{
          this.$router.push({
            path: "/sys/goods/category/add",
            query: {
              parentId: this.$route.query.parentId,
              level: 1
            }
          });
        }
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/sys/goods/category/list', query: {parentId: row.id, level: this.list[0].level}})
      },
      handleTransferProduct(index, row) {
        console.log('handleAddProductCate');
      },
      handleDeletethislevel(index, row) {
        this.$confirm('是否要删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoodlevel('/goods/category/delete', {'ids': row.id}).then(res => {
            console.log(res);
            if (res.result.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功！',
                duration: 800
              })
              this.getList();
            }
          })
        })
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductCate',query:{id:row.id}});
      },
      backPage() {
        this.$router.back();
      }
      // handleDelete(index, row) {
      //   this.$confirm('是否要删除该品牌', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     deleteProductCate(row.id).then(response => {
      //       this.$message({
      //         message: '删除成功',
      //         type: 'success',
      //         duration: 1000
      //       });
      //       this.getList();
      //     });
      //   });
      // }
    },
    filters: {
      levelFilter(value) {
        if (value === 1) {
          return '一级';
        } else if (value === 2) {
          return '二级';
        }else if (value === 3) {
          return '三级';
        }
      },
      disableNextLevel(value) {
        if (value === 3) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>
<style scoped>
</style>
