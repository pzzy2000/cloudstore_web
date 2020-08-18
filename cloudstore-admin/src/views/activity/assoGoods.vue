<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button style="float: right;margin-bottom: 10px;" @click="handleSearchList()" type="primary" size="small">
          查询
        </el-button>
        <el-button style="float: right;margin-right: 15px;margin-bottom: 10px;" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div>
        <i class="el-icon-search"></i>
        <span>活动申请</span>
        <el-form :inline="true" :model="listQuery" ref="activityFrom" size="small" label-width="120px" style="margin-top: 20px">
          <el-form-item label="活动：">
            <el-select v-model="listQuery.activityId" remote placeholder="活动" :loading="loading" v-on:change="seclectactivity($event, 1)">
<!--              v-on:change="seclectactivity($event, 1)"-->
              <el-option v-for="item in activityList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品信息：">
            <remoteCom v-model="listQuery.goodsIds_" ref="clearInput" url="/manage/search/goods/search" @tochild="tochild"></remoteCom>
          </el-form-item>
          <el-form-item label="供应商信息：">
            <dbremoteCom v-model="listQuery.supplierIds_" ref="clearInputone" url="/manage/search/supplier/search" @dbTochild="dbTochild"></dbremoteCom>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" border>
        <!--@selection-change="handleSelectionChange"-->
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="商品名称" align="center" :formatter="goodsinfo" column-key='goodsName' width="300">
        </el-table-column>
        <el-table-column label="商品分类" align="center" :formatter="goodsinfo" column-key="category">
        </el-table-column>
        <el-table-column label="销售价/市场价" align="center" :formatter="goodsinfo" column-key="pics" width="150">
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
        <el-table-column label="供应商" align="center" :formatter="goodsinfo" column-key="supplierBean">
        </el-table-column>
        <el-table-column label="供应商店铺" align="center" :formatter="goodsinfo" column-key="supplierShopBean">
        </el-table-column>
        <el-table-column prop="address" label="是否关联" align="center" width="100">
          <template slot-scope="scope" v-if="scope.row.joins == 1">
            <el-switch v-model="scope.row.link" :active-value="1" :inactive-value="0" active-color="#409eff"
              inactive-color="#dcdfe6" @change="changeSwitch($event, scope.row)" :disabled="disabled">
            </el-switch>
          </template>
          <template slot-scope="scope" v-else>
              {{scope.row.activityBean.name}}
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
    fetchListAll as fetchActivityList,
    addActivity,
    fetchAllgoods,
    inAssogoods,
    outAssogoods
  } from '@/api/activity'

  import {
    msg
  } from '@/api/iunits'
  import remoteCom from '@/components/remoteCom'
  import dbremoteCom from '@/components/remoteCom/dbIndex'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    optType: 'search'
  };

  export default {
    name: "asso-goods",
    components: {
      remoteCom,
      dbremoteCom
    },
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
      tochild(item, callback){
        callback(`商品名称：${item.goodsName}`);
      },
      dbTochild(item, callback){
        callback(`供应商名称：${item.name} / 供应商电话：${item.phone}`);
      },
      goodsinfo(row, column) {
        let goods = row.goodsPicesBean;
        switch (column.columnKey) {
          case 'goodsName': {
            return goods.goodsName;
          }
          case 'category': {
            try {
              if (goods.categoryThreeBean !== null) {
                return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
              } else {
                return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name;
              }
              // return goods.categoryOneBean.name + "/" + goods.categoryTwoBean.name + "/" + goods.categoryThreeBean.name;
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
          pageSize: 100
        }).then(res => {
          this.loading = false;
          this.activityList = res.result.result.records;
        });
      },
      seclectactivity(event) {
        let activityId = event;
        this.activityId = activityId;
        this.getList(this.activityId);
      },
      handleSearchList() {
        // let activityId = event;
        // this.activityId = activityId;
        if (this.listQuery.activityId == undefined) {
          this.$message({
            message: '请先选择活动！',
            type: 'warning',
            duration: 800
          })
        }else {
          this.listQuery.pageNum = 1;
          this.getList(this.listQuery);
        }
      },
      handleResetSearch() {
        let activityId = this.listQuery.activityId;
        this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery.activityId = activityId;
        this.$refs.clearInput.clearInput();
        this.$refs.clearInputone.clearInput();
        this.getList(this.listQuery);
        // this.$message({
        //   message: "重置成功",
        //   type: 'success',
        //   duration: 800
        // })
      },
      getList(activityId) {
        this.list = [];
        fetchAllgoods(this.listQuery).then(response => {
          console.log(response);
          this.list = response.result.result.records;
          this.total = parseInt(response.result.result.total);
          if (response.result.result.records.length !== 0) {
            this.$message({
              message: "查询成功",
              type: 'success',
              duration: 800
            })
          }else{
            this.$message({
              message: "暂无数据",
              type: 'success',
              duration: 800
            })
          }
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
