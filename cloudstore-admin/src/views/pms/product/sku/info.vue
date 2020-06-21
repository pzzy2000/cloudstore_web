<template>

  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-divider content-position="left"><i class="el-icon-search"></i>商品SKU信息</el-divider>
      <el-form :model="goodsku" ref="goodskuform" label-width="150px" size="small">
        <el-form-item label="商品名称：">
          <el-input-dispatcher v-model="goodsku.goods.goodsName" style="width: 650px;" readonly></el-input-dispatcher>
        </el-form-item>
        <el-form-item label="属性类型：">
          <el-select v-model="goodsku.propertyId" placeholder="请选择属性类型" @change="handleProductAttrChange">
            <el-option v-for="item in productAttributeCategoryOptions" :key="item.id" :label="item.propertyName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格：">
          <el-card shadow="never" class="cardBg">
            <div v-for="(productAttr,idx) in selectProductAttr">
              <div  v-if="productAttr.type===0">
                <p> {{productAttr.name}}：</p>
                <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
                <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
              </div>

              <!--
              <el-checkbox-group v-if="productAttr.type===0" v-model="selectProductAttr[idx].values">
                <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item" class="littleMarginLeft"></el-checkbox>
              </el-checkbox-group>

              <div v-else>

                <el-checkbox-group v-model="selectProductAttr[idx].values">
                  <div v-for="(item,index) in selectProductAttr[idx].options" style="display: inline-block" class="littleMarginLeft">
                    <el-checkbox :label="item" :key="item"></el-checkbox>
                    <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                    </el-button>
                  </div>
                </el-checkbox-group>
                <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
                <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>

              </div>
                -->

            </div>
            <div>
              <el-table style="width: 100%;margin-top: 20px"
                                :data="goodsku.skuStockList"
                                border>
                        <el-table-column
                                v-for="(item,index) in selectProductAttr"
                                :label="item.name"
                                :key="item.id"
                                align="center">
                          <template slot-scope="scope">
                            {{getProductSkuSp(scope.row,index)}}
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="销售价格"
                                width="80"
                                align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.price"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="商品库存"
                                width="80"
                                align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.stock"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="库存预警值"
                                width="100"
                                align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.lowStock"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="SKU编号"
                                width="100"
                                align="center">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.skuCode"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="属性图片：" align="left" width="200" >
                          <template slot-scope="scope">
                            <single-upload v-model="scope.row.pic"
                                           style="width: 200px;display: inline-block;margin-left: 10px"></single-upload>
                          </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="80"
                                align="center">
                          <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
            </div>
          </el-card>

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {
    getAttributetypes as getAttributetypes
  } from '@/api/productAttrCate';

  import {
    getProduct
  } from '@/api/product';

  import {
    fetchSelectList as fetchPropertisParamsSelectList
  } from '@/api/productAttr';



  export default {
    name: "productsku",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        loading: false,
        rwDispatcherState: 'write',
        goodsku: {
          goods: {},
          skuStockList:{

          }
        },
        productAttributeCategoryOptions: {

        },
        selectProductAttr:{

        }
      }
    },
    created() {
      this.rwDispatcherState = "write";
      this.getgoodsInfo();
      // this.getproductAttributeCategory();
    },
    methods: {
      getgoodsInfo() {
        let gooodsId = this.$route.query.goodsid;
        getProduct({
          id: gooodsId
        }).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.goodsku.goods = list;
          this.getproductAttributeCategory();
        });

      },
      handleProductAttrChange(productId) {
        this.loading = true;
        fetchPropertisParamsSelectList({goodsPropertyId:productId}).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.selectProductAttr = list.records;
        });
      },
      getproductAttributeCategory() {
        this.loading = true;
        getAttributetypes(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.productAttributeCategoryOptions = list.records;
        });
      }
    },

  }
</script>
