<template>
  <div class="app-container">
    <el-divider content-position="left"><i class="el-icon-search"></i>商品SKU佣金设置</el-divider>
    <el-form :model="goodsku" ref="brokeRules" :rules="rules" label-width="150px" size="small">
      <div>
        <el-table style="width: 100%;margin-top: 20px" :data="goodsku.skuStockList" border>
          <el-table-column label="SKU编号" align="center" prop="goodsSkuBean.skuCode" width="250">
          </el-table-column>
          <el-table-column :label='specslabel'  align="center" prop="goodsSkuBean.skuValue" width="200">
          </el-table-column>
          <el-table-column label="单价" align="center" prop="goodsSkuBean.price" width="80">
          </el-table-column>
          <el-table-column label="团长佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.leader'" :rules='rules.leader'>
                <el-input v-model="scope.row.leader"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="代理佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.agent'" :rules='rules.agent'>
                <el-input v-model="scope.row.agent"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="客户佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.client'" :rules='rules.client'>
                <el-input v-model="scope.row.client"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="客户分享积分" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.sharePoints'" :rules='rules.sharePoints'>
                <el-input v-model="scope.row.sharePoints"></el-input>
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
          <el-table-column label="配送金额" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'skuStockList.' + scope.$index + '.delivery'" :rules='rules.delivery'>
                <el-input v-model="scope.row.delivery"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
<!--          <el-table-column>-->
<!--            <template slot-scope="scope"><span style="color: #ca0400">{{scope.row.warnMsg}}</span></template>-->
<!--          </el-table-column>-->
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
          leader: [
            { required: true, message: '请输入团长佣金', trigger: 'blur' },
            // { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ],
          agent: [
            { required: true, message: '请输入代理佣金', trigger: 'blur' },
            // { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ],
          client: [
            { required: true, message: '请输入客户佣金', trigger: 'blur' },
            // { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ],
          clientShare: [
            { required: true, message: '请输入客户分享积分', trigger: 'blur' },
            { pattern: /^[0-9]{0,4}$|^[0-9]{0,4}(\.[0-9]{1,2})?$/, message: '小于10000，小数点后2位的整数或小数' }],
          clientPoints: [
            { required: true, message: '请输入客户购买积分', trigger: 'blur' },
            { pattern: /^[0-9]{0,4}$|^[0-9]{0,4}(\.[0-9]{1,2})?$/, message: '小于10000，小数点后2位的整数或小数' }
          ],
          delivery: [
            { required: true, message: '请输入配送金额', trigger: 'blur' },
            // { pattern: /^(\d|1\d|20)(\.\d{0,2})?$/, message: '最大20.99，小数点后两位' }
          ]
        }
      }
    },
    created() {
      this.rwDispatcherState = "write";
      this.getgoodsInfo();
    },
    methods: {
      updateGoodsProperties(formName) {
        // console.log(this.goodsku.skuStockList);
        // let onoff = true;
        // let arr = []
        // for (let i=0; i<this.goodsku.skuStockList.length; i++) {
        //   if (this.goodsku.skuStockList[i].warnMsg !== '' && this.goodsku.skuStockList[i].warnMsg !== undefined) {
        //     arr.push(i);
        //   }
        // }
        // console.log(arr)
        // if (arr.length !== 0){
        //   onoff = false;
        //   arr = []
        // }else{
        //   onoff = true;
        //   arr = []
        // }
        this.$refs[formName].validate((valid) => {
          // if (valid && onoff) {
          if (valid) {
            this.$confirm('确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let arr = [];
              for (let j=0; j<this.goodsku.skuStockList.length; j++) {
                let obj = {};
                obj.id = this.goodsku.skuStockList[j].id;
                obj.leader = this.goodsku.skuStockList[j].leader;
                obj.agent = this.goodsku.skuStockList[j].agent;
                obj.client = this.goodsku.skuStockList[j].client;
                obj.clientPoints = this.goodsku.skuStockList[j].clientPoints;
                arr.push(obj);
              }
              // let str = JSON.stringify(arr);
              // console.log(str);
              updateBrosku(arr).then(res => {
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
      async getgoodsInfo() {
        let id = this.$route.query.id;
        defaultList.financeProfitId = id;
        getSkulist(defaultList).then(response => {
          console.log(response);
           // this.specslabel= 'ssss' //skuStockListt[0].skuKey;
           let  skuStockListt = response.result.result.records;
          if( skuStockListt.length>0){
            try{
               this.specslabel='规格['+skuStockListt[0].goodsSkuBean.skuKey+"]"; //skuStockListt[0].skuKey;
              }catch(e){
               this.specslabel="规格数据出错";
            }
          }
          this.goodsku.skuStockList =skuStockListt;
        });

      },
      // warnMsg(index, row) {
      //   let num;
      //   // this.goodsku.skuStockList[index].warnMsg == "不能超过30哦";
      //   if (this.goodsku.skuStockList[index].leader == '') {
      //     num = this.goodsku.skuStockList[index].agent + this.goodsku.skuStockList[index].client;
      //   }else if (this.goodsku.skuStockList[index].agent == '') {
      //     num = this.goodsku.skuStockList[index].leader + this.goodsku.skuStockList[index].client
      //   }else if (this.goodsku.skuStockList[index].client == '') {
      //     num = this.goodsku.skuStockList[index].leader + this.goodsku.skuStockList[index].agent
      //   }else {
      //     num = this.goodsku.skuStockList[index].leader + this.goodsku.skuStockList[index].agent + this.goodsku.skuStockList[index].client;
      //   }
      //   if (num > 30){
      //     this.$set(this.goodsku.skuStockList[index], 'warnMsg', '佣金总和不能超过30哦!');
      //   }else{
      //     this.$set(this.goodsku.skuStockList[index], 'warnMsg', '');
      //   }
      //   // this.$forceUpdate();
      // },
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
