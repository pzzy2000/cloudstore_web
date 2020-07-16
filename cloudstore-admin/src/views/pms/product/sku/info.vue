<template>

  <div class="app-container">
    <!--
    <el-card  shadow="never" style="height: 1500px;">
    -->
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
              <el-form :rules="rules" :model="goodsku" ref="format">
              <el-table style="width: 100%;margin-top: 20px" :data="goodsku.skuStockList" border>
                <el-table-column fixed v-for="(item,index) in goodsku.guige" :label="item.name" :key="item.id" align="center">
                  <template slot-scope="scope">
                    {{getProductSkuSp(scope.row,index,item)}}
                  </template>
                </el-table-column>
                <el-table-column label="销售价格" align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'skuStockList.' + scope.$index + '.price'" :rules='rules.price'>
                      <el-input v-model="scope.row.price"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="商品库存" align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'skuStockList.' + scope.$index + '.stock'" :rules='rules.stock'>
                      <el-input v-model="scope.row.stock"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="库存预警值" align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'skuStockList.' + scope.$index + '.warnQuantity'" :rules='rules.warnQuantity'>
                      <el-input v-model="scope.row.warnQuantity"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="SKU编号" align="center">
                  <template slot-scope="scope">
                    <el-form-item :prop="'skuStockList.' + scope.$index + '.skuCode'" :rules='rules.skuCode'>
                      <el-input v-model="scope.row.skuCode" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="属性图片：" align="left" width="400">
                  <template slot-scope="scope">
                    <single-upload v-model="scope.row.photos" style="width: 400px;display: inline-block;margin-left: 10px"></single-upload>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="80" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              </el-form>
              <div>
                <el-button type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">刷新列表
                </el-button>
              </div>

            </div>
          </el-card>

        </el-form-item>
        <el-form-item label="商品参数：">
          <el-card shadow="never" class="cardBg">
            <div v-for="(item,index) in goodsku.attr">
              <div>
                <p> <a style="width: 150px;"> {{item.attr.name}}:</a>
                  <el-input v-model="item.value" style="width: 160px;margin-left: 10px" clearable></el-input>
                </p>
              </div>
            </div>
          </el-card>
        </el-form-item>
        <!--
        <el-form-item label="商品相册：">
          <multi-upload v-model="goodsku.goodsPics"></multi-upload>
        </el-form-item>
        -->

        <el-form-item label="商品规格参数介绍：">
          <quill-editor ref="text" v-model="goodsku.mobileHtml" class="myQuillEditor" :options="quillOption" />
          <!--
          <tinymce :width="595" :height="300" v-model="goodsku.mobileHtml"></tinymce>
          -->
        </el-form-item>
      </el-form>
      <br/>
      <!--
    </el-card>
    -->
    <div style="width: 100%;text-align:center">
 <br /> <br /> <br /> <br />
    <el-button style="margin-bottom: 10px;" @click="updateGoodsProperties" size="small">
      更新
    </el-button>
    </div>
  </div>
</template>

<script>
  import {
    getAttributetypes as getAttributetypes
  } from '@/api/productAttrCate';

  import {
    msg
  } from '@/api/iunits';

  import {
    getGoodsInfoByGoodsId,
    updateGoodsAttr
  } from '@/api/product';

  import {
    fetchSelectList as fetchPropertisParamsSelectList
  } from '@/api/productAttr';

  import SingleUpload from '@/components/Upload/singleUpload';
  // import MultiUpload from '@/components/Upload/multiUpload';
  // import {
  //   getToken
  // } from '@/utils/auth';

  //import Tinymce from '@/components/Tinymce';

  import  { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  // var token = getToken(); // 要保证取到

  import quillConfig from '@/components/quill-config.js'

  export default {
    name: "productsku",
    components: {
      SingleUpload,
      // MultiUpload,
      quillEditor
      // Tinymce
    },
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        loading: false,
        type: {
          type: 1
        },
        rwDispatcherState: 'write',
        quillOption: quillConfig,
        goodsku: {
          mobileHtml:null,
          goods: {},
          //goodsPics: [],
          skuStockList: [], //table 显示的  规格头
          //paramsList: [], //参数列表
          guige: [], //分类 的 规格
          attr: [], //分类 的 属性  key 参数 object  vlaue:
          guigeValue: {}, //key : 规格ID id []
          guigeSelectValue: {},
          addGuige: { // 增加的规格值
          }
        },
        productAttributeCategoryOptions: {

        },
        // editorOption: {
        //   // editorOption里是放图片上传配置参数用的，例如：
        //      action:  'http://120.24.156.254:18888/platform/sys/upload/entity/oss/ali/update',  // 必填参数 图片上传地址
        //      methods: 'post',  // 必填参数 图片上传方式
        //      token: token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        //      name: 'goods_info',  // 必填参数 文件的参数名
        //      size: 128,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
        //      accept: 'multipart/form-data, image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg'  // 可选 可上传的图片格式
        // },
        rules: {
          price: [
            { required:true, message:"价格必填", trigger:"blur" },
            // { type:'number', message:"价格必须为数字", trigger:"blur", transform (value) { // 用于解决数字非必填函数。如果没有该函数，该字段会在表单提交时候进行触发（形成必填字段）
            //     return _.toNumber(value)
            //   }
            // },
            { pattern: /^[0-9]{0,5}$|^[0-9]{0,5}(\.[0-9]{1,2})?$/, message: '请输入正确格式' }
          ],
          stock: [
            { required:true, message:"商品库存必填", trigger:"blur" },
            { pattern: /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/, message: '请输入正确格式' }
          ],
          warnQuantity: [
            { required:true, message:"商品库存预警必填", trigger:"blur" },
            { pattern: /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/, message: '请输入正确格式' }
          ],
          skuCode: [
            { required:true, message:"sku编号必填", trigger:"blur" }
            // { pattern: /[\u4E00-\u9FA5]/g, message: '不能输入中文' }
          ]
        }
      }
    },
    created() {
      this.rwDispatcherState = "write";
      this.getgoodsInfo();
      // this.$.MultiUpload.useOss=false;
      // this.$.MultiUpload.minioUploadUrl="http://120.24.156.254:18888/platform/sys/upload/entity/oss/ali/update"
      // this.getproductAttributeCategory();
    },
    methods: {

      updateGoodsProperties() {
        let good_sku = this.goodsku;

        let data = {};
        data.propertyId = good_sku.propertyId;
        data.skuStockList = good_sku.skuStockList;
        data.goodsId = good_sku.goods.id;
        //data.goodsPics = good_sku.goodsPics;
        data.attr = [];
        good_sku.attr.forEach(function(value, index, array) {
          let xx = {
            attrid: value.attr.id,
            value: value.value
          }
          data.attr.push(xx);
        });

        data.mobileHtml=good_sku.mobileHtml

        updateGoodsAttr(data).then(response => {
          if(response.result.code == 0){
            this.loading = false;
            msg("更新商品SKU成功");
            this.$router.go(-1);
            // let list = response.result.result;
            // this.goodsku.goods = list;
            // this.getproductAttributeCategory();
          }
        });
      },

      async getgoodsInfo() {
        let gooodsId = this.$route.query.goodsid;
        let set_mobileHtml = this.setmobileHtml;
        getGoodsInfoByGoodsId({
          goodsId: gooodsId
        }).then(response => {
          console.log(response)
          let tr = response.result.result;
          let goods = tr.goodsPicesBean;
          if (goods.propertyId == null) {
            this.loading = false;
            this.getproductAttributeCategory();
            this.goodsku.goods = goods;
          } else {
            getAttributetypes(0).then(response => {
              this.loading = false;
              let list = response.result.result;
              this.productAttributeCategoryOptions = list.records;
              this.goodsku.goods = goods;
              this.goodsku.propertyId = goods.propertyId;
              let goodsku_ = this.goodsku;
              this.handleProductAttrChange(goods.propertyId, function() {
                let goodsPropertyValue = tr.goodsPropertyValue;
                for (let ix in goodsPropertyValue) {
                  let pv = goodsPropertyValue[ix];
                  if (pv.propertyType == 0) {
                    let gkv = pv.propertyValue.split(",");
                    for (let gkvix in gkv) {
                      goodsku_.guigeValue[pv.goodsSkuId].push(gkv[gkvix]);
                    }
                  } else {
                    //参数
                    for (let attix in goodsku_.attr) {
                      if (goodsku_.attr[attix].attr.id == pv.goodsSkuId) {
                        goodsku_.attr[attix].value = pv.propertyValue;
                      }
                    }
                  }
                  //TABLE
                  goodsku_.skuStockList = tr.goodsSku;
                  goodsku_.mobileHtml =goods.mobileHtml;
                }
              });
            });
          }
        });

      },
      handleProductAttrChange(propertyId, backcall) {
        this.loading = true;
        this.goodsku.guige = [];
        this.goodsku.guigeValue = {};
        this.goodsku.guigeSelectValue = {},
          this.goodsku.attr = [];
        this.goodsku.addGuige = {};
        this.goodsku.skuStockList = [];
        fetchPropertisParamsSelectList({
          goodsPropertyId: propertyId
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
              let attr = {
                attr: list[i],
                value: ''
              };
              this.goodsku.attr.push(attr);
            }
          }

          if (typeof(backcall) == 'function') {
            backcall();
          }

        });
      },
      getproductAttributeCategory(backcall) {
        this.loading = true;
        getAttributetypes(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.productAttributeCategoryOptions = list.records;
          if (typeof(backcall) != 'undefined') {
            backcall();
          }
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

      handleRemoveProductSku(index, row) {
        let list = this.goodsku.skuStockList;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
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
.quill-editor{
         height:600px;
     }
  .el-table >>> .el-form-item__error{
    position: static;
    text-align: left;
  }
</style>
