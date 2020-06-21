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
            <div v-for="(productAttr,idx) in goodsku.guige">

              <div>
                <p> {{productAttr.name}} ：
                  <el-input v-model="goodsku.addGuige[productAttr.id]" style="width: 160px;margin-left: 10px" clearable></el-input>
                  <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(productAttr.id,productAttr.name)">增加</el-button>
                </p>
                <el-checkbox-group v-model="goodsku.guigeSelectValue[productAttr.id]">
                  <el-checkbox v-for="item in goodsku.guigeValue[productAttr.id]" :label="item" :key="item" @change="checkboxChang">
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div>
              <el-table style="width: 100%;margin-top: 20px" :data="goodsku.skuStockList" border>
                <el-table-column fixed v-for="(item,index) in goodsku.guige" :label="item.name" :key="item.id" align="center">
                  <template slot-scope="scope">
                    {{getProductSkuSp(scope.row,index,item)}}
                  </template>
                </el-table-column>
                <el-table-column label="销售价格" width="80" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="商品库存" width="80" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.stock"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="库存预警值" width="100" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lowStock"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="SKU编号" width="100" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.skuCode"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="属性图片：" align="left" width="200">
                  <template slot-scope="scope">
                    <!--
                    <single-upload v-model="scope.row.pic" style="width: 200px;display: inline-block;margin-left: 10px"></single-upload>
                    -->

                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="80" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div>
                <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">刷新列表
                </el-button>
              </div>
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
          skuStockList: [], //table 显示的  规格头
          guige: [], //分类 的 规格
          attr: [], //分类 的 属性
          guigeValue: {}, //key : 规格ID id []
          guigeSelectValue: {},
          addGuige: { // 增加的规格值
          }
        },
        productAttributeCategoryOptions: {

        },


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
        this.goodsku.guige = [];
        this.goodsku.guigeValue = {};
        this.goodsku.guigeSelectValue = {},
        this.goodsku.attr = [];
        this.goodsku.addGuige = {};
        this.goodsku.skuStockList = [];
        fetchPropertisParamsSelectList({
          goodsPropertyId: productId
        }).then(response => {
          this.loading = false;
          let list = response.result.result.records;
          // this.selectProductAttr = list.records;
          for (let i = 0; i < list.length; i++) {
            if (list[i].type === 0) {
              this.goodsku.guige.push(list[i]);
              this.goodsku.guigeValue[list[i].id] = [];
              this.goodsku.guigeSelectValue[list[i].id] = [];
            } else {
              this.goodsku.attr.push(list[i]);
            }
          }


        });
      },
      getproductAttributeCategory() {
        this.loading = true;
        getAttributetypes(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.productAttributeCategoryOptions = list.records;
        });
      },
      handleAddProductAttrValue(Attrid, attrName) {
        let v = this.goodsku.addGuige[Attrid];
        if (v == null || v == '' || typeof(v) == 'undefined') {
          this.$message({
            message: '规格[' + attrName + ']不能为空',
            type: 'warning',
            duration: 2000
          });
        } else {
          // console.log(Attrid +"   "+this.goodsku.guigeValue[Attrid].length);
          this.goodsku.guigeValue[Attrid].push(v);
          this.goodsku.addGuige[Attrid] = '';
          this.$forceUpdate();
        }

      },
      checkboxChang() {
        this.$forceUpdate();
      },

      handleRefreshProductSkuList() {
        this.refreshProductSkuList();

      },
      refreshProductSkuList() {
        this.goodsku.skuStockList = [];
        let skuList = this.goodsku.skuStockList;
        let selectValue = this.goodsku.guigeSelectValue;
        let keys = Object.keys(selectValue);
        let array4 = [];
        for (let index in keys) {
          let keyValues = selectValue[keys[index]];
          if (keyValues.length === 0) continue;
          let x = [];
          for (let i = 0; i < keyValues.length; i++) {
            x.push("'" + keys[index] + "':'" + keyValues[i] + "'");
          }
          array4.push(x);
        }
        var result = array4.reduce((last, current) => {
          const array = [];
          last.forEach(par1 => {
            current.forEach(par2 => {
              array.push(par1 + "," + par2);
            });
          });
          return array;
        });
        for (let ix in result) {
          //   // console.log(result[ix]);
          let xx = "\"{" + result[ix] + "}\"";
          console.log(xx);
          this.goodsku.skuStockList.push({
            sgk: JSON.parse(xx)
          })
        }
      },

      getProductSkuSp(row, index, item) {
        // console.log("  row  " + row);
        let sgk = row.sgk;
        var obj = eval('(' + sgk + ')');
        // console.log("  row  " + (obj[item.id]));
        return (obj[item.id]);
      }

    },

  }
</script>
<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    #background: #F8F9FC;
  }
</style>
