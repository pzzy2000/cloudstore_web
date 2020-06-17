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
          <el-form-item label="用11户名字：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="访问账号：">
            <el-input style="width: 203px" v-model="listQuery.phone" placeholder="商品货号"></el-input>
          </el-form-item>
          
          
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addDict(-1,null)"
        size="mini">
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

        <el-table-column label="字典code" width="120" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="字典名称" align="center">
         <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>

        <el-table-column label="是否有子类" align="center" :formatter="haveChild">

        </el-table-column>



        <el-table-column label="是否删除" align="center" :formatter="showStatus" >

        </el-table-column>

        <el-table-column label="描述" align="center">
           <template slot-scope="scope">{{scope.row.desc}}</template>
        </el-table-column>

        <el-table-column label="操作" width="360" align="center">

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
        :page-sizes="[20]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList} from '@/api/sysdict'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 20,
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
      }
    },
    created() {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>  "+(this.$route.query.parentId))
       this.listQuery.parentId = typeof(this.$route.query.parentId)=="undefined"?0:this.$route.query.parentId;
       this.listQuery.pageNum = typeof(this.$route.query.pageNum)=="undefined"?1:this.$route.query.pageNum;
       this.listQuery.pageSize = typeof(this.$route.query.pageSize)=="undefined"?defaultListQuery.pageSize:this.$route.query.pageSize;
       this.getList();
    },
    watch: {
      // selectProductCateValue: function (newValue) {
      //   if (newValue != null && newValue.length == 2) {
      //     this.listQuery.productCategoryId = newValue[1];
      //   } else {
      //     this.listQuery.productCategoryId = null;
      //   }

      // }
    },
    filters: {
      // verifyStatusFilter(value) {
      //   if (value === 1) {
      //     return '审核通过';
      //   } else {
      //     return '未审核';
      //   }
      // }
    },
    methods: {

      tochild(index, row){
          // this.listQuery.parentId = row.id;
          // this.getList();
           this.$router.push({path:'/sys/manager/dict/list',
               query: {parentId: row.id,pparentId:row.parentId,ppageNum:this.listQuery.pageNum,ppageSize:this.listQuery.pageSize}});
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
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        });
      },

      addDict(index, row){
         let  pageNum = this.listQuery.pageNum;
         let  pageSize =this.listQuery.pageSize;
         let   parentId = index ==-1? -1: row.id;
        this.$router.push({path:'/sys/manager/dict/add',query: {opt:0,parentId: parentId,pageNum:pageNum,pageSize:pageSize}});
      },


      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
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
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
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
      }
    }
  }
</script>
<style></style>
