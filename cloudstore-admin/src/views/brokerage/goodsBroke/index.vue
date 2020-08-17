<template>
  <div>
    <div class="table-container" style="margin: 20px">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.goodsName}}</template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
              <!--              <div slot="placeholder" class="image-slot">-->
              <!--                加载中<span class="dot">...</span>-->
              <!--              </div>-->
            </el-image>
          </template>
        </el-table-column>
<!--        <el-table-column label="商品品牌" width="150" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.goodsBrand}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="商品货号" width="150" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.goodsNumber}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="商品规格类别" align="center">-->
<!--        </el-table-column>-->
<!--        <el-table-column label="产地" width="250" align="center" :formatter="showAddress">-->
<!--        </el-table-column>-->
        <el-table-column label="商品分类" align="center" :formatter="showMsg" prop="category">
        </el-table-column>
<!--        <el-table-column label="销售价格/市场价" align="left">-->
<!--          <template slot-scope="scope"> ￥{{scope.row.salePrice}} / ￥{{scope.row.martPrice}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="所属供应商" align="center" :formatter="showMsg" prop="supplierName">
<!--          <template slot-scope="scope">{{scope.row.supplierBean.name}}</template>-->
        </el-table-column>
        <el-table-column label="所属店铺" align="center" :formatter="showMsg" prop="supplierShop">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="settingBroke(scope.row)" size="mini">设置佣金</el-button>
<!--            <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看-->
<!--            </el-button>-->
<!--            <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)" v-show="isshow">编辑-->
<!--            </el-button>-->
<!--            <el-button size="mini" @click="addsku(scope.$index, scope.row)">SKU管理-->
<!--            </el-button>-->
<!--            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" v-show="isshow">删除-->
<!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {fetchList} from '@/api/brokerage'
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  export default {
    name: "index",
    data() {
      return {
        list: [],
        listLoading: true,
        listQuery: Object.assign({}, defaultList),
      }
    },
    created() {
      this.getList(1);
    },
    methods: {
      showMsg(row, col) {
        switch (col.property) {
          case "supplierName":{
            try{
              return row.supplierBean.name;
            }catch (e) {
              return "数据读取错误";
            }
          }
          case "supplierShop":{
            try{
              return row.supplierShopBean.shopName;
            }catch (e) {
              return "数据读取错误";
            }
          }
          case "category":{
            try{
              return row.categoryOneBean.name + '/' + row.categoryTwoBean.name;
            }catch (e) {
              return "数据读取错误";
            }
          }
        }
      },
      handleSelectionChange() {},
      settingBroke(row) {
        this.$router.push({path: '/broke/rage/settingBroke', query: {id: row.id}})
      },
      getList(idx) {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
          if (idx == 0) {
            if (response.result.result.records.length == 0) {
              this.$message({
                message: "暂无数据",
                type: 'warning',
                duration: 800
              })
            }else {
              this.$message({
                message: "查询成功",
                type: 'success',
                duration: 800
              })
            }
          }
          if (idx == 2) {
            this.$message({
              message: "重置成功",
              type: 'success',
              duration: 800
            })
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
