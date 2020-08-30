<template>
  <div class="app-container">
    <el-divider content-position="left"><i class="el-icon-search"></i>商品SKU佣金设置</el-divider>
    <el-form :model="goodsku" ref="brokeRules" :rules="rules" label-width="150px" size="small">
      <div>
        <el-table style="width: 100%;margin-top: 20px" :data="goodsku.skuStockList" border>
          <el-table-column label="商品名称" align="center" prop="goodsSkuBean.skuCode" width="250">
          </el-table-column>
          <el-table-column label="SKU编号" align="center" prop="goodsSkuBean.skuCode" width="250">
          </el-table-column>
          <el-table-column :label='specslabel'  align="center" prop="goodsSkuBean.skuValue" width="200">
          </el-table-column>
          <el-table-column label="活动价" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.onlinePrice'" :rules='rules.onlinePrice'>
                <el-input v-model="scope.row.onlinePrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="团长佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.leader'" :rules='rules.leader'>
                <el-input v-model="scope.row.leader"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="客户购买积分" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.clientPoints'" :rules='rules.clientPoints'>
                <el-input v-model="scope.row.clientPoints"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <br/>
    <div style="width: 100%;text-align:center">
      <br /> <br /> <br /> <br />
      <el-button style="margin-bottom: 10px;" @click="updateGoodsProperties('brokeRules')" size="small">
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
  import SingleUpload from '@/components/Upload/singleUpload';
  import {msg}  from '@/api/iunits';
  import {getoneSKU, updateSetting} from '@/api/activity';
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
        specslabel:'规格',
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
        rules: {
          onlinePrice: [
            { required: true, message: '请输入活动价', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ],
          leader: [
            { required: true, message: '请输入团长佣金', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ],
          clientPoints: [
            { required: true, message: '请输入客户购买积分', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ]
        }
      }
    },
    created() {
      this.rwDispatcherState = "write";
      this.getList();
    },
    methods: {
      updateGoodsProperties(formName) {
        this.$refs[formName].validate((valid) => {
          // if (valid && onoff) {
          if (valid) {
            this.$confirm('确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let arr = [];
              let obj = {};
              obj.activityGoodsId = this.$route.query.activityGoodsId;
              obj.onlinePrice = this.goodsku.skuStockList[0].onlinePrice;
              obj.leader = this.goodsku.skuStockList[0].leader;
              obj.clientPoints = this.goodsku.skuStockList[0].clientPoints;
              obj.goodsSkuId = this.$route.query.id;
              obj.ativityId = this.$route.query.activityId;
              arr.push(obj);
              updateSetting(arr).then(res => {
                if(res){
                  if(res.result.code == 0){
                    msg('更新SKU佣金成功');
                    this.$router.back();
                  }else{
                    msg('更新SKU佣金失败['+res.result.msg+']');
                  }
                }else{
                  msg('更新SKU佣金失败');
                }
              })
            }).catch(e => e)
          }else{
            this.$message({
              message: '验证没通过!',
              type: 'error',
              duration: 800
            })
            return false;
          }
        })
      },
      getList() {
        let skuId = this.$route.query.id;
        let activityId = this.$route.query.activityId;
        let obj = {};
        obj.goodsSkuId = skuId;
        obj.ativityId = activityId;
        obj.pageNum = 1;
        obj.pageSize = 10;
        obj.optType = 'search'
        getoneSKU(obj).then(response => {
          this.goodsku.skuStockList =response.result.result.records;
          if (this.$route.query.offlinePrice !== undefined) {
            // this.goodsku.skuStockList[0].onlinePrice = this.$route.query.offlinePrice;
            this.$set(this.goodsku.skuStockList[0], 'onlinePrice', this.$route.query.offlinePrice);
          }
          if(this.goodsku.skuStockList.length>0){
            try{
              this.specslabel='规格['+skuStockListt[0].skuKey+"]"; //skuStockListt[0].skuKey;
            }catch(e){
              this.specslabel="规格数据出错";
            }
          }
        });

      },
      backPage() {
        this.$router.back();
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
  .el-form >>> .el-form-item__content {
    margin-left: 0 !important;
  }
</style>
