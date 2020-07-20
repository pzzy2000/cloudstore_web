<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="字典code：">
            <el-input style="width: 203px" v-model="listQuery.code" placeholder="字典code"></el-input>
          </el-form-item>
          <el-form-item label="字典名称：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型：">
            <el-select v-model="listQuery.dirctType" placeholder="字典类型">
              <el-option label="服务保证" value="fubz"></el-option>
              <el-option label="行政划分" value="area"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有子类：">
            <el-select v-model="listQuery.childs" placeholder="是否有子类">
              <el-option label="有子类" value="1"></el-option>
              <el-option label="无子类" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否删除：">
            <el-select v-model="listQuery.isDelete" placeholder="请选择是否删除">
              <el-option label="未删除" value="0"></el-option>
              <el-option label="已删除" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" size="mini" @click="backPage" v-show="isshow">返回</el-button>
      <el-button
        class="btn-add"
        @click="addDict"
        size="mini"
        style="margin-right: 20px">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>

        <el-table-column label="字典code"  align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="字典名称" align="center">
         <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>

        <el-table-column label="字典类型" align="center">
         <template slot-scope="scope">{{scope.row.dirctType.name}}</template>
        </el-table-column>

        <el-table-column label="是否有子类" align="center" :formatter="haveChild">

        </el-table-column>



        <el-table-column label="是否删除" align="center" :formatter="showStatus" >

        </el-table-column>

        <el-table-column label="描述" align="center">
           <template slot-scope="scope">{{scope.row.desc}}</template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">

          <template slot-scope="scope">
            <!--
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
               -->
              <el-button
                size="mini"
                :disabled="scope.row.childs | disableNextLevel"
                @click="tochild(scope.$index, scope.row)">查看子类
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
        :page-sizes="[10]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList,searchDictionaries} from '@/api/sysdict'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "productList",
    data() {
      return {
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        verifyList: {},
        isshow: false
      }
    },
    created() {
       this.resetParentId();
       this.getList();
       console.log(this.$route.query.parentId)
       if (this.$route.query.parentId !== undefined) {
         this.isshow = true;
       }else {
         this.isshow = false
       }
    },
    watch: {
     $route(route) {
       this.resetParentId();
       this.getList();
       if (this.$route.query.parentId !== undefined) {
         this.isshow = true;
       }else {
         this.isshow = false
       }
     }
   },
    filters: {
       disableNextLevel(value) {
         if (value === 0) {
           return true;
         } else {
           return false;
         }
       }
    },
    methods: {
      resetParentId(){
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          console.log(this.$route.query.parentId);
          this.listQuery.parentId = this.$route.query.parentId;
        } else {
          this.listQuery.parentId = 0;
        }
      },
      tochild(index, row){
        console.log(row)
        this.listQuery = Object.assign({}, defaultListQuery);
        this.$router.push({path: '/sys/manager/dict/list', query: {parentId: row.id}});
      },
      haveChild(row, column){
        let  childs  = row.childs;
        switch(childs){
          case 0: return '没子类';
          case 1: return  '有子类';
          default :
          return '没子类';
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭
      },
      showStatus(row, column){
        let  isDelete  = row.isDelete;
        switch(isDelete){
          case 0: return '未删除';
          case 1: return  '已删除';
          default :
          return '未删除';
        }
        // 状态;0:正常;1:违规关闭;2:永久关闭
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          if (response.result.code == 0) {
            this.listLoading = false;
            this.list = response.result.result.records;
            this.total = parseInt(response.result.result.total);
          }
        });
      },
      handleSearchList() {
        // this.listQuery.pageNum = 1;
        // this.getList();
        // let obj = {
        //   code: this.verifyList.dictcode,
        //   province: this.verifyList.dictname,
        //   codeType: this.verifyList.dicttype,
        //   childs: this.verifyList.ischildren,
        //   isDelete: this.verifyList.isdelete
        // }
        // if (this.listQuery.)
        searchDictionaries(this.listQuery).then(res => {
          if (res.result.code == 0) {
            this.$message({
              message: '查询成功',
              type: 'success'
            })
            console.log(res);
            this.list = res.result.result.records;
            this.total = parseInt(res.result.result.total);
          }
        })
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        // this.selectProductCateValue = [];
        // this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery = {};
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1,ids);
        });
      },
      addDict() {
        this.$router.push({path: '/sys/manager/dict/add', query: {opt: "0", parentId: this.$route.query.parentId}});
      },
      backPage() {
        this.$router.go(-1);
      }
    }
  }
</script>
<style></style>
