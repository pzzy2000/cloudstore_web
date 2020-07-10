<template>
  <div>
<!--    <el-card class="filter-container" shadow="never">-->
<!--      <div>-->
<!--        <i class="el-icon-search"></i>-->
<!--        <span>筛选搜索</span>-->
<!--        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">-->
<!--          查询结果-->
<!--        </el-button>-->
<!--        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">-->
<!--          重置-->
<!--        </el-button>-->
<!--      </div>-->
<!--      <div style="margin-top: 15px">-->
<!--        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">-->
<!--          <el-form-item label="输入搜索：">-->
<!--            <el-input style="width: 203px" v-model="listQuery.goodsName" placeholder="商品名称"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="商品货号：">-->
<!--            <el-input style="width: 203px" v-model="listQuery.goodsNumber" placeholder="商品货号"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="商品分类：">-->
<!--            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions">-->
<!--            </el-cascader>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="商品品牌：">-->
<!--            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>-->
<!--              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="上架状态：">-->
<!--            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>-->
<!--              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="审核状态：">-->
<!--            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>-->
<!--              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </el-card>-->
    <div style="margin: 20px 20px 0 20px">
      <el-table ref="productTable" :data="orderList" style="width:100%" v-loading="listLoading" border>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center" :formatter="showAddress">
        </el-table-column>
        <el-table-column label="商铺名称" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="证件类型" align="center">
          <template slot-scope="scope">{{scope.row.cardType}}</template>
        </el-table-column>
        <el-table-column label="证件号码" align="center">
          <template slot-scope="scope">{{scope.row.cardNo}}</template>
        </el-table-column>
        <el-table-column label="详细住址" align="center">
          <template slot-scope="scope">{{scope.row.detailAddress}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px"  align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="delLogis(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType: "search"
  }
  import {fetchList} from '@/api/client'
  export default {
    name: "userapply",
    data() {
      return {
        orderList: [],
        listQuery: Object.assign({}, defaultList),
        listLoading: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        fetchList(this.listQuery).then(res => {
          console.log(res);
          this.orderList = res.result.result.records;
        })
      },
      showAddress(row, column) {
        try {
          return row.provinceBean.name + " " + row.cityBean.name + " " + row.areaBean.name;
        } catch (e) {
          return '数据读取错误';
        }
      },
      delLogis(row) { 
        this.$router.push({path: "/sys/client/agent/apply/info", query: {id: row.id}})
      }
    }
  }
</script>

<style scoped>

</style>
