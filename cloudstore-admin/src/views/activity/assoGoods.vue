<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-input disabled v-model="name" style="margin-bottom: 20px; width: 350px"></el-input>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border>
        <!--@selection-change="handleSelectionChange"-->
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="商品名称">
          <template slot-scope="scope">{{ scope.row.goodsBean.goodsName }}</template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="商品品牌">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsBrand }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="商品货号">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsNumber }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="商品规格类别">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsName }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="产地">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsName }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="商品分类">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsName }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="销售价格/市场价">-->
          <!--<template slot-scope="scope">￥{{scope.row.salePrice}} / ￥{{scope.row.martPrice}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="所属店铺">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsName }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="address"-->
          <!--label="所属供应商">-->
          <!--<template slot-scope="scope">{{ scope.row.goodsName }}</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="address"
          label="是否关联">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="changeSwitch($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
    import { addActivity,fetchAllgoods,inAssogoods,outAssogoods } from '@/api/tracking'
    export default {
      name: "asso-goods",
      data() {
        return {
          tableData: [],
          name: ''
        }
      },
      created() {
        this.name = this.$route.query.name;
        this.getList();
      },
      methods: {
        getList() {
          // const obj = {
          //   keyword: null,
          //   pageNum: 1,
          //   pageSize: 20,
          //   publishStatus: null,
          //   verifyStatus: null,
          //   productSn: null,
          //   productCategoryId: null,
          //   brandId: null
          // };
          fetchAllgoods({activityId: this.$route.query.id}).then(res => {
            console.log(res)
            this.tableData = res.result.result;
          })
        },
        changeSwitch(idx, row) {
          // console.log(idx)
          if (idx == 0) {
            outAssogoods({ids: row.activityGoodsId}).then(res => {
              console.log(res);
              if(res.result.code == 0){
                this.getList();
              }
            })
          }else {
            inAssogoods({activityId: this.$route.query.id, goodsId: row.goodsId, optType: "save"}).then(res => {
              console.log(res);
              if(res.result.code == 0){
                this.getList();
              }
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
