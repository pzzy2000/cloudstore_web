<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>活动申请</span>
        <el-form :inline="true" :model="listQuery" ref="activityFrom" size="small" label-width="80px" style="margin-top: 20px">
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
        <el-table-column label="商品名称" align="center" :formatter="goodsinfo" column-key='goodsName' fixed="">
        </el-table-column>
        <el-table-column label="商品分类" align="center" fixed :formatter="goodsinfo" column-key="category">
        </el-table-column>
        <el-table-column label="销售价/市场价" align="center" fixed :formatter="goodsinfo" column-key="pics">
        </el-table-column>
        <el-table-column label="商品图片" align="center"  column-key="goodsPhotos">
          <template slot-scope="scope">
            <el-image v-for=" (item,index) in scope.row.goodsPicesBean.goodsPhotos" :src="item.url" :key='index' style="width: 56px; height: 56px;margin-right: 20px;">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="center" fixed :formatter="goodsinfo" column-key="supplierBean">
        </el-table-column>
        <el-table-column label="供应商店铺" align="center" fixed :formatter="goodsinfo" column-key="supplierShopBean">
        </el-table-column>
        <el-table-column prop="address" label="是否关联" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.link" :active-value="1" :inactive-value="0" active-color="#409eff"
              inactive-color="#dcdfe6" @change="changeSwitch($event, scope.row)" :disabled="disabled">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize" :page-sizes="[10]" :current-page.sync="listQuery.pageNum" :total="total">
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
    pageSize: 10,
  };

  export default {
    name: "asso-goods",
    data() {
      return {
        loading: false,
        list: null,
        activity: {},
        listQuery: Object.assign({}, defaultListQuery),
        total: 0,
        activityId: '',
        disabled: false
      }
    },
    created() {
      this.activityList();
      // this.getList();
    },
    methods: {
      goodsinfo(row, column) {
        let goods = row.goodsPicesBean;
        switch (column.columnKey) {
          case 'goodsName': {
            return goods.goodsName;
          }
          case 'category': {
            try {
              return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
            } catch (e) {
              return '数据读取错误';
            }
          }
          case 'pics': {
            try {
              return '￥' + goods.salePrice + '/' + goods.martPrice;
            } catch (e) {
              return '数据读取错误';
            }
          }
          case 'supplierBean': {
            try {
              return goods.supplierBean.name;
            } catch (e) {
              return '数据读取错误';
            }
          }
          case 'supplierShopBean': {
            try {
              return goods.supplierShopBean.shopName;
            } catch (e) {
              return '数据读取错误';
            }
          }
        }
      },
      activityList() {
        this.loading = true;
        fetchActivityList({
          pageNum: 1,
          pageSize: 10
        }).then(res => {
          this.loading = false;
          this.activityList = res.result.result.records;
        });
      },
      seclectactivity(event) {
        let activityId = event;
        this.activityId = activityId;
        this.getList(activityId);
      },
      getList(activityId) {
        this.list = [];
        fetchAllgoods(this.listQuery).then(response => {
          console.log(response);
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
        })
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList(this.activityId);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList(this.activityId);
      },
      changeSwitch(idx, row) {
        let _this = this;
        this.disabled = true
        if (idx == 0) {  //断开
          outAssogoods({
            ids: row.activityGoodsId
          }).then(res => {
            if (res.result.code == 0) {
              msg('申请退出活动成功');
              this.disabled = false;
            }else{
              row.link = 1;
              setTimeout(function () {
                _this.disabled = false;
                _this.getList(_this.activityId);
              },500);
            }
          })
        } else { //关联
          inAssogoods({
            activityId: this.listQuery.activityId,
            goodsId: row.goodsId,
            optType: "save"
          }).then(res => {
            if (res.result.code == 0) {
              row.activityGoodsId = res.result.result.id;
              console.log(res);
              msg('申请加入活动成功');
              this.disabled = false;
            }else{
              row.link = 0;
              setTimeout(function(){
                _this.disabled = false;
                _this.getList(_this.activityId);
              },500);
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
