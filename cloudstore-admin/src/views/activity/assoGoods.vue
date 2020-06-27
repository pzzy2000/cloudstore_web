<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>活动申请</span>
        <el-form :inline="true" :model="listQuery" ref="activityFrom" size="small" label-width="130px">
          <el-form-item label="活动：">
            <el-select v-model="listQuery.activityId" remote placeholder="活动" :loading="loading" v-on:change="seclectactivity($event, 1)">
              <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </div>

      <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" border>
        <!--@selection-change="handleSelectionChange"-->
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="商品名称">
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
        <el-table-column prop="address" label="是否关联">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.link" :active-value="1" :inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949" @change="changeSwitch($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize" :page-sizes="[20]" :current-page.sync="listQuery.pageNum" :total="total">
        </el-pagination>
      </div>

    </el-card>
  </div>

</template>

<script>
  import {
    fetchList as fetchActivityList,
    addActivity,
    fetchAllgoods,
    inAssogoods,
    outAssogoods
  } from '@/api/activity'

  import {
    msg
  } from '@/api/iunits'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 20,
  };

  export default {
    name: "asso-goods",
    data() {
      return {
        loading: false,
        list: null,
        activity: {},
        listQuery: Object.assign({}, defaultListQuery)
      }
    },
    created() {
      this.activityList();
      // this.getList();
    },
    methods: {
      activityList() {
        this.loading = true;
        fetchActivityList({
          pageNum: 1,
          pageSize: 50
        }).then(res => {
          this.loading = false;
          this.activityList = res.result.result.records;
        });
      },
      seclectactivity(event) {
        let activityId = event;
        this.getList(activityId);
      },
      getList(activityId) {

        fetchAllgoods(this.listQuery).then(response => {
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        })
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },

      changeSwitch(idx, row) {
        // console.log(idx)
        let  goods =row.goodsBean;
        if (idx == 0) {  //断开
          outAssogoods({
            ids: row.activityGoodsId
          }).then(res => {
            if (res.result.code == 0) {
              msg('商品:['+goods.name+']申请退出活动成功');
            }
          })
        } else { //关联
          inAssogoods({
            activityId: this.listQuery.activityId,
            goodsId: row.goodsId,
            optType: "save"
          }).then(res => {
            if (res.result.code == 0) {
               msg('商品:['+goods.name+']申请加入出活动成功');
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
