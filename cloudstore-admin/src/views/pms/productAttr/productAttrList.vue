<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="backPage()" size="mini">
        返回
      </el-button>
      <el-button class="btn-add" @click="addProductAttr()" size="mini" style="margin-right: 20px" v-if="(powershowing(power.goods_specs_add)&&listQuery.type == 0) || (powershowing(power.goods_param_add) && listQuery.type == 1)">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="属性名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>

       <!-- <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.inputList}}</template>
        </el-table-column> -->
        <el-table-column label="属性类型"  align="center">
          <template slot-scope="scope">{{scope.row.type | attrType}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)" v-if="(powershowing(power.goods_specs_update)&&listQuery.type == 0) || (powershowing(power.goods_param_update) && listQuery.type == 1)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)" v-if="(powershowing(power.goods_specs_delete)&&listQuery.type == 0) || (powershowing(power.goods_param_delete) && listQuery.type == 1)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
   <!-- <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div> -->
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
    <!--<el-dialog-->
      <!--:title="dialogTitle"-->
      <!--:visible.sync="dialogVisible"-->
      <!--width="30%">-->
      <!--<el-table-column label="编号" width="100" align="center">-->
        <!--<template slot-scope="scope">{{scope.row.id}}</template>-->
      <!--</el-table-column>-->
    <!--</el-dialog>-->
  </div>
</template>
<script>
  import {fetchList, deleteProductAttr,createProductAttr,updateProductAttr} from '@/api/productAttr'
  import {powershow} from "@/utils/power";
  export default {
    name: 'productAttrList',
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          goodsPropertyId: this.$route.query.goodsPropertyId,
          type: this.$route.query.type,
        },
        operateType: null,
        multipleSelection: [],
        productAttrAdd:{
          name:'',
          id:null
        },
        operates: [
          {
            label: "删除",
            value: "deleteProductAttr"
          }
        ],
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        });
      },
      addProductAttr() {
        //this.$router.push({path:'/sys/goods/addProductAttr',query:{goodsPropertyId:this.$route.query.goodsPropertyId,type:this.$route.query.type}});
        // this.dialogVisible = true;
        // this.dialogTitle = "添加属性";
        if(this.$route.query.type ==0 ){
              this.$router.push({path: '/sys/goods/property/specs/add', query: {goodsPropertyId: this.$route.query.goodsPropertyId, type:this.$route.query.type, optTp: 'add', allMsg: this.$route.query.type + 'add'}});
        }else{
               this.$router.push({path: '/sys/goods/property/param/add', query: {goodsPropertyId: this.$route.query.goodsPropertyId, type:this.$route.query.type, optTp: 'add', allMsg: this.$route.query.type + 'add'}});
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType !== 'deleteProductAttr') {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.handleDeleteProductAttr(ids);
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
      handleUpdate(index, row) {
        if(this.$route.query.type ==0 ){
            this.$router.push({path:'/sys/goods/property/specs/update',query:{id:row.id, name: row.name, type:this.$route.query.type, optTp: "update", allMsg: this.$route.query.type + 'update'}});
          }else{
              this.$router.push({path:'/sys/goods/property/param/update',query:{id:row.id, name: row.name, type:this.$route.query.type, optTp: "update", allMsg: this.$route.query.type + 'update'}});
          }

        // this.dialogVisible = true;
        // this.dialogTitle = "编辑属性";
        // this.productAttrAdd.name = row.name;
        // this.productAttrAdd.id = row.id;
      },
      handleDeleteProductAttr(ids) {
        this.$confirm('是否要删除该属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductAttr(ids).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleDelete(index, row) {
        /* let ids = [];
        ids.push(row.id); */
        this.handleDeleteProductAttr({'ids':row.id});
      },
      backPage() {
        this.$router.back();
      }
    },
    filters: {
      inputTypeFilter(value) {
        if (value === 1) {
          return '从列表中选取';
        } else {
          return '手工录入'
        }
      },
      attrType(value) {
        if (value === 0) {
          return '规格';
        } else {
          return '参数'
        }
      },
      selectTypeFilter(value) {
        if (value === 1) {
          return '单选';
        } else if (value === 2) {
          return '多选';
        } else {
          return '唯一'
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
