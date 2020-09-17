<template>
  <div>
    <el-card class="operate-container" shadow="never" style="margin: 20px 20px 0 20px">
      <i class="el-icon-tickets"></i>
      <span>默认佣金 百分比 </span>
    </el-card>
    <div style="margin: 20px 20px 0 20px">
      <el-form :model="defList" ref="defRules" :rules="rules" size="small">
        <el-table style="width: 100%;margin-top: 20px" :data="defList.orderList" border>
          <el-table-column align="center" width="100">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="团长佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.leader'" :rules='rules.leader'>
                <el-input v-model="scope.row.leader"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="代理佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.agent'" :rules='rules.agent'>
                <el-input v-model="scope.row.agent"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="客户佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.client'" :rules='rules.client'>
                <el-input v-model="scope.row.client"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="配送佣金" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.delivery'" :rules='rules.sharePoints'>
                <el-input v-model="scope.row.delivery"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="分享积分" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.sharePoints'" :rules='rules.clientPoints'>
                <el-input v-model="scope.row.sharePoints"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="购买积分" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'orderList.' + scope.$index + '.clientPoints'" :rules='rules.delivery'>
                <el-input v-model="scope.row.clientPoints"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center; margin-top: 30px">
          <el-button type="primary" @click="submit('defRules')" size="small" v-if="powershowing(power.broke_subDefault)">提交</el-button>
<!--          <el-button @click="backPage" size="small">返回</el-button>-->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getdefbroke, settingDef} from '@/api/brokerage'
  import {powershow} from "@/utils/power";
  export default {
    name: "index",
    data() {
      return {
        defList: {
          orderList: []
        },
        listLoading: true,
        rules: {
          leader: [
            { required: true, message: '请输入团长佣金', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }
            // { pattern: /^[0-9]{0,1}$|^[0-9]{0,1}(\.[0-9]{1,2})?$/, message: '整数,小于10，小数点后2位' }
          ],
          agent: [
            { required: true, message: '请输入代理佣金', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }
          ],
          client: [
            { required: true, message: '请输入客户佣金', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }
          ],
          delivery: [
            { required: true, message: '请输入配送佣金', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }],
          sharePoints: [
            { required: true, message: '请输入分享积分', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }
          ],
          clientPoints: [
            { required: true, message: '请输入购买积分', trigger: 'blur' },
            { pattern: /^(\d|1\d|20)$/, message: '0~20，不能有小数' }
          ]
        },
        power: ''
      }
    },
    created() {
      this.power = JSON.parse(localStorage.getItem('opt'));
      this.getList();
    },
    filters: {
      changeMsg(data) {
        try {
          return data;
        } catch (e) {
          return "数据读取出错"
        }
      }
    },
    methods: {
      powershowing(key) {
        return powershow(key);
      },
      // delLogis() {
      //   console.log("1");
      // },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let obj = {};
              obj.leader = this.defList.orderList[0].leader/100;
              obj.agent = this.defList.orderList[0].agent/100;
              obj.client = this.defList.orderList[0].client/100;
              obj.delivery = this.defList.orderList[0].delivery/100;
              obj.sharePoints = this.defList.orderList[0].sharePoints/100;
              obj.clientPoints = this.defList.orderList[0].clientPoints/100;
              obj.maxLeader = this.defList.orderList[1].leader/100;
              obj.maxAgent = this.defList.orderList[1].agent/100;
              obj.maxClient = this.defList.orderList[1].client/100;
              obj.maxDelivery = this.defList.orderList[1].delivery/100;
              obj.maxSharePoints = this.defList.orderList[1].sharePoints/100;
              obj.maxClientPoints = this.defList.orderList[1].clientPoints/100;
              obj.optType = 'update';
              settingDef(obj).then(res => {
                if (res.result.code == 0) {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 800
                  })
                }
              })
            }).catch(e => e)
          } else {
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
        getdefbroke({id: 1}).then(res => {
          console.log(res);
          this.listLoading = false;
          res.result.result.title = "默认";
          res.result.result.leader = parseInt(res.result.result.leader*100);
          res.result.result.agent = parseInt(res.result.result.agent*100);
          res.result.result.client = parseInt(res.result.result.client*100);
          res.result.result.delivery = parseInt(res.result.result.delivery*100);
          res.result.result.sharePoints = parseInt(res.result.result.sharePoints*100);
          res.result.result.clientPoints = parseInt(res.result.result.clientPoints*100);
          this.defList.orderList.push(res.result.result);
          let obj = {
            title: "最大值"
          }
          obj.leader = parseInt(this.defList.orderList[0].maxLeader*100);
          obj.agent = parseInt(this.defList.orderList[0].maxAgent*100);
          obj.client = parseInt(this.defList.orderList[0].maxClient*100);
          obj.delivery = parseInt(this.defList.orderList[0].maxDelivery*100);
          obj.sharePoints = parseInt(this.defList.orderList[0].maxSharePoints*100);
          obj.clientPoints = parseInt(this.defList.orderList[0].maxClientPoints*100);
          this.defList.orderList.push(obj);
        })
      }
    }
  }
</script>

<style>

  .datatable {
    border: 1px solid #ddd;
    border-collapse: collapse;
    width: 100%;

  }

  .datatable td, .datatable th {

    border: 1px solid #ddd;
    text-align: center;
    padding: 0.2em;
  }

  .datatable th {
    border: 1px solid #ddd;
    #background-color: gray;
    font: 14px;
    text-align: center;
    padding: 0.2em;

  }

  .datatable caption {
    font: 14px;
    background: #B0C4DE;
    color: #33517A;
    padding: 0.4em 0 0.3em 0;
    border: 1px solid #789AC6;


  }

  .datatable tr:hover {

    background-color: #DEF7F2;
    color: #000000;
  }
</style>
