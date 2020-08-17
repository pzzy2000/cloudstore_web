<template>
  <div style="margin: 20px 20px 0 20px">
    <el-form :model="goodsku" ref="brokeRules" :rules="rules" size="small">
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
        <el-table-column label="客户分享佣金" align="center">
          <template slot-scope="scope">
            <el-form-item :prop="'skuStockList.' + scope.$index + '.sharePoints'" :rules='rules.sharePoints'>
              <el-input v-model="scope.row.sharePoints"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="积分" align="center">
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
      </el-table>
      <div style="text-align: center; margin-top: 30px">
        <el-button type="primary" @click="submit('brokeRules')" size="small">提交</el-button>
        <el-button @click="backPage" size="small">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {getgoodsSku, saveSetting} from '@/api/brokerage'
  export default {
    name: "settingBroke",
    data() {
      return {
        goodsku: {
          skuStockList: []
        },
        specslabel: '规格',
        rules: {
          leader: [
            { required: true, message: '请输入团长佣金', trigger: 'blur' },
            { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数,小于10，小数点后2位' }
          ],
          agent: [
            { required: true, message: '请输入代理佣金', trigger: 'blur' },
            { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数,或者小于10，小数点后2位' }
          ],
          client: [
            { required: true, message: '请输入客户佣金', trigger: 'blur' },
            { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数，或者小于10，小数点后2位' }
            ],
          clientShare: [
            { required: true, message: '请输入客户分享佣金', trigger: 'blur' },
            { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数，或者小于10，小数点后2位' }],
          clientPoints: [
            { required: true, message: '请输入积分', trigger: 'blur' },
            { pattern: /^100$|^(\d|[1-9]\d)?$/, message: '整数,小于等于100' }
          ],
          delivery: [
            { required: true, message: '请输入配送金额', trigger: 'blur' },
            { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数,或者小于10，小数点后2位' }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        getgoodsSku({goodsId: this.$route.query.id}).then(res => {
          this.goodsku.skuStockList = res.result.result.records;
          console.log(this.goodsku.skuStockList)
          if( this.goodsku.skuStockList.length>0){
            try{
              this.specslabel='规格['+this.goodsku.skuStockList[0].goodsSkuBean.skuKey+"]"; //skuStockListt[0].skuKey;
            }catch(e){
              this.specslabel="规格数据出错";
            }
          }
        })
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
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
                obj.delivery = this.goodsku.skuStockList[j].delivery;
                obj.sharePoints = this.goodsku.skuStockList[j].sharePoints;
                arr.push(obj);
              }
              saveSetting(arr).then(res => {
                console.log(res);
                if(res){
                  if(res.result.code == 0){
                    this.$message({
                      message: '保存成功',
                      type: 'success',
                      duration: 800
                    })
                  }else{
                    this.$message({
                      message: '更新SKU佣金失败['+res.result.msg+']',
                      type: 'error',
                      duration: 800
                    })
                  }
                }else{
                  this.$message({
                    message: '更新SKU佣金失败',
                    type: 'error',
                    duration: 800
                  })
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
      backPage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
