<template>

  <div class="app-container">
    <!--
    <el-card  shadow="never" style="height: 1500px;">
    -->
    <el-divider content-position="left"><i class="el-icon-search"></i>商品SKU佣金设置</el-divider>
    <el-form :model="goodskuform" ref="goodskuform" label-width="150px" size="small">
<!--      <el-form-item label="商品名称：">-->
<!--        <el-input-dispatcher v-model="goodskuform.financeProfitId" style="width: 650px;" readonly></el-input-dispatcher>-->
<!--      </el-form-item>-->
      <!--<el-form-item label="属性类型：">-->
      <!--<el-select v-model="goodsku.propertyId" placeholder="请选择属性类型" @change="handleProductAttrChange">-->
      <!--<el-option v-for="item in productAttributeCategoryOptions" :key="item.id" :label="item.propertyName" :value="item.id">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->


          <!--<div v-for="(productAttr,idx) in goodsku.guige">-->
          <!--<div>-->
          <!--<p> {{productAttr.name}} ：-->
          <!--<el-input v-model="goodsku.addGuige[productAttr.id]" style="width: 160px;margin-left: 10px" clearable></el-input>-->
          <!--<el-button class="littleMarginLeft" @click="handleAddProductAttrValue(productAttr.id,productAttr.name)">增加</el-button>-->
          <!--</p>-->
          <!--<el-checkbox-group v-model="goodsku.guigeSelectValue[productAttr.id]">-->
          <!--<el-checkbox v-for="item in goodsku.guigeValue[productAttr.id]" :label="item" :key="item" @change="checkboxChang">-->
          <!--</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</div>-->
          <!--</div>-->
          <div>
            <el-table style="width: 100%;margin-top: 20px" :data="goodsku.skuStockList" border>
<!--              <el-table-column fixed v-for="(item,index) in goodsku.guige" :label="item.name" :key="item.id" align="center"-->
<!--                               width="100">-->
<!--                <template slot-scope="scope">-->
<!--                  {{getProductSkuSp(scope.row,index,item)}}-->
<!--                </template>-->
<!--              </el-table-column>-->
              <el-table-column label="SKU编号" align="center" prop="goodsSkuBean.skuCode" width="250">
              </el-table-column>

              <el-table-column label="团长佣金" align="center" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.leader"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="代理佣金" align="center" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.agent"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="客户佣金" align="center" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.client"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="积分" align="center" width="250">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.clientPoints"></el-input>
                </template>
              </el-table-column>
              <el-table-column  align="center" >

              </el-table-column>
            </el-table>
          </div>

    </el-form>
    <br/>
    <div style="width: 100%;text-align:center">
      <br /> <br /> <br /> <br />
      <el-button style="margin-bottom: 10px;" @click="updateGoodsProperties" size="small">
        提 交
      </el-button>
      <el-button @click="backPage" size="small">返 回</el-button>
    </div>
  </div>
</template>

<script>
  const defaultList = {
    pageNum: 1,
    pageSize: 10,
    optType:'search'
  };
  import {getSkulist, updateBrosku} from '@/api/brokerage';
  import SingleUpload from '@/components/Upload/singleUpload';
   import {msg}  from '@/api/iunits';
  export default {
    name: "brageInfo",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    components: {
      SingleUpload
    },
    data() {
      return {
        loading: false,
        type: {
          type: 1
        },
        rwDispatcherState: 'read',
        goodsku: {
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
        goodskuform: {},
        productAttributeCategoryOptions: {

        },


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
        console.log(this.goodsku.skuStockList);
        let arr = [];
        for (let i=0; i<this.goodsku.skuStockList.length; i++) {
          let obj = {};
          obj.id = this.goodsku.skuStockList[i].id;
          obj.leader = this.goodsku.skuStockList[i].leader;
          obj.agent = this.goodsku.skuStockList[i].agent;
          obj.client = this.goodsku.skuStockList[i].client;
          obj.clientPoints = this.goodsku.skuStockList[i].clientPoints;
          arr.push(obj);
        }
        // let str = JSON.stringify(arr);
        // console.log(str);
        updateBrosku(arr).then(res => {
          if(res){
             if(res.result.code == 0){
               msg('更新SKU佣金成功');
             }else{
                msg('更新SKU佣金失败['+res.result.msg+']');
             }
          }else{
            msg('更新SKU佣金失败');
          }
        })
      },
      async getgoodsInfo() {
        let id = this.$route.query.id;
        defaultList.financeProfitId = id;
        getSkulist(defaultList).then(response => {
          console.log(response);
          this.goodsku.skuStockList = response.result.result.records;
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
      },
      backPage() {
        this.$router.go(-1);
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
</style>
