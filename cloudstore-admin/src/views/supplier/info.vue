<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>
          <!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="blicense" ref="blicense" :rules="rules" size="small" label-width="130px">
          <el-divider content-position="left"><i class="el-icon-search"></i> 供应商信息</el-divider>
          <el-form-item label="供应商名字：" prop="supplierName">
            <el-input-dispatcher style="width: 580px" v-model="blicense.supplierName" placeholder="供应商名字"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="联系电话：" prop="phoneNumber">
            <el-input-dispatcher style="width: 214px" v-model.number="blicense.phoneNumber" placeholder="联系电话"></el-input-dispatcher>
          </el-form-item>
          <el-divider content-position="left"><i class="el-icon-search"></i> 店铺信息</el-divider>
          <el-form-item label="店铺名字：" prop="shopName">
            <el-input-dispatcher style="width: 580px" v-model="blicense.shopName" placeholder="店铺名字"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="店铺告示：" style="width: 100%;" prop="notice">
            <el-input-dispatcher style="width: 930px" v-model="blicense.notice" placeholder="店铺告示"></el-input-dispatcher>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-divider content-position="left"><i class="el-icon-search"></i> 营业执照</el-divider>
        <el-form :inline="true" :model="blicense" ref="blicense" :rules="rules" size="small" label-width="130px">
          <el-form-item label="执照名称：" prop="licenseName">
            <el-input-dispatcher style="width: 214px" v-model="blicense.licenseName" placeholder="执照名称"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="信用代码：" prop="creditCode">
            <el-input-dispatcher style="width: 214px" v-model="blicense.creditCode" placeholder="信用代码"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="员工人数：" prop="workNumber">
            <el-input-dispatcher style="width: 214px" v-model="blicense.workNumber" placeholder="员工人数"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="简介：" style="width: 100%;" prop="introduce">
            <el-input-dispatcher style="width: 930px" v-model="blicense.introduce" placeholder="简介"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="主营品牌：" prop="brand">
            <el-input-dispatcher style="width: 214px" v-model="blicense.brand" placeholder="主营品牌"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="电话：" prop="phone">
            <el-input-dispatcher style="width: 214px" v-model="blicense.phone" placeholder="电话"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="邮箱：" prop="email">
            <el-input-dispatcher style="width: 214px" v-model="blicense.email" placeholder="邮箱"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="注册资本：" prop="registerCapital">
            <el-input-dispatcher style="width: 214px" v-model="blicense.registerCapital" placeholder="注册资本"></el-input-dispatcher>
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="法人：" prop="legalPerson">
            <el-input-dispatcher style="width: 214px" v-model="blicense.legalPerson" placeholder="法人"></el-input-dispatcher>
          </el-form-item>
          <el-form-item label="证件类型：" prop="cardType">
            <el-input-dispatcher style="width: 214px" v-model="blicense.cardType" placeholder="证件类型"></el-input-dispatcher>
          </el-form-item>

          <el-form-item label="证件号码：" prop="cardNo">
            <el-input-dispatcher style="width: 214px" v-model="blicense.cardNo" placeholder="证件号码"></el-input-dispatcher>
          </el-form-item>
          <br/>
          <el-form-item label="证件照片：" prop="cardPhotos">
            <div v-if="rwDispatcherState =='read'">
                <el-image  v-for=" (item,index) in cardPhotos" :src="item.url"  :key='index'  style="width: 150px; height: 150px;margin-right: 20px;">
                     <div slot="placeholder" class="image-slot">
                       加载中<span class="dot">...</span>
                     </div>
                </el-image>
            </div>
            <div v-else>
             <localmulti-upload v-model="cardPhotos"></localmulti-upload>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="营业执照照片：" required>
          <div v-if="rwDispatcherState =='read'">
            <el-image  v-for=" (item,index) in licensePhotos" :src="item.url"  :key='index'  style="width: 150px; height: 150px;margin-right: 20px;">
               <div slot="placeholder" class="image-slot">
                 加载中<span class="dot">...</span>
               </div>
            </el-image>
          </div>

          <div v-else>
                   <localmulti-upload v-model="licensePhotos"></localmulti-upload>
          </div>
         </el-form-item>

        </el-form>
        <div>
          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(true)" :style="{ display: shownUpdateSubelButton}"
            size="small">
            更新
          </el-button>

          <el-button style="float: right;margin-bottom: 10px;" @click="shownUpdateSbutton(false)" :style="{ display: shownUpdateButton}"
            size="small">
            取消
          </el-button>

          <el-button style="float: right;margin-bottom: 10px; margin-right: 20px;" :style="{ display: shownUpdateButton}"
            @click="savebaseinfo('blicense')" type="primary" size="small">
            提交
          </el-button>

        </div>
      </div>
    </el-card>
  </div>

</template>

<script>
  import localmultiUpload from '@/components/Upload/localmultiUpload';
  import {
    searchSupplierDetail,saveSupplierInfo
  } from '@/api/supplier' ;

  import{photoUrl} from '@/api/iunits';

  export default {
    name: "supplierBaseinfo",
    components: {
      localmultiUpload
    },
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      function checkSpecialKey(str) {
        var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
        for (var i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
      };
      var validateInput = (rule, value, callback) => {
        if (!checkSpecialKey(value)) {
          callback(new Error("不能含有特殊字符！！"));
        } else {
          callback();
        }
      };
      var validatePhonenum = (rule, value, callback) => {
        function isMobile (s) {
          return /^1[0-9]{10}$/.test(s)
        }
        if(value == ''){
          callback(new Error("请输入电话！！"));
        } else if (!isMobile(value)) {
          callback(new Error("请输入正确电话格式！！"));
        }else {
          callback();
        }
      }
      var validateEmail = (rule, value, callback) => {
        function isEmail(s) {
          return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
        }
        if(value == ''){
          callback();
        } else if (!isEmail(value)){
          callback(new Error("请输入正确邮箱格式！！"));
        }else{
          callback();
        }
      }
      var validateCardnum = (rule, value, callback) => {
        function isCardID(sId) {
          if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
            console.log('你输入的身份证长度或格式错误')
            return false
          }
          //身份证城市
          var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
          if (!aCity[parseInt(sId.substr(0, 2))]) {
            console.log('你的身份证地区非法')
            return false
          }
          // 出生日期验证
          var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
            d = new Date(sBirthday)
          if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
            console.log('身份证上的出生日期非法')
            return false
          }
          // 身份证号码校验
          var sum = 0,
            weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            codes = "10X98765432"
          for (var i = 0; i < sId.length - 1; i++) {
            sum += sId[i] * weights[i];
          }
          var last = codes[sum % 11]; //计算出来的最后一位身份证号码
          if (sId[sId.length - 1] != last) {
            console.log('你输入的身份证号非法')
            return false
          }
          return true
        }
        if (!isCardID(value)) {
          callback(new Error("请输入正确证件号码格式！！"))
        }else{
          callback();
        }
      }
      return {
        // baseInfo: Object.assign({}, defaultBaseInfo),
        updateParams:{
          from:'SysUser'
        },
        blicense: {
          supplierName: '',
          phoneNumber: '',
          shopName: '',
          notice: '',
          licenseName: '',
          creditCode: '',
          introduce: '',
          workNumber: '',
          brand: '',
          startTime: '',
          phone: '',
          email: '',
          registerCapital: '',
          legalPerson: '',
          cardType: '',
          cardNo: '',
          cardPhoto:[],
        },
        rules: {
          supplierName: [
            { required: true, message: '供应商名字不能为空', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          phoneNumber: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' },
            { validator: validatePhonenum, trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '店铺名字不能为空', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          // notice: [
          //   { validator: validateInput, trigger: 'blur' }
          // ]
          licenseName: [
            { required: true, message: '执照名称不能为空', trigger: 'blur' },
            { min: 10, max: 100, message: '长度在10到100字', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          creditCode: [
            { required: true, message: '信用代码不能为空', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '简介不能为空', trigger: 'blur' },
            { min: 10, max: 100, message: '长度在10到100字', trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          legalPerson: [
            { required: true, message: '法人不能为空', trigger: 'blur' },
            { validator: validateInput, trigger: 'blur' }
          ],
          cardType: [
            { required: true, message: '请输入证件类型', trigger: 'blur' }
          ],
          cardNo: [
            { required: true, message: '证件号码不能为空', trigger: 'blur' },
            { min: 18, max: 18, message: '请输入18位号码', trigger: 'blur' },
            { validator: validateCardnum, trigger: 'blur' }
          ],
          cardPhotos: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ]
        },
        cardPhotos:[],
        licensePhotos:[],
        rwDispatcherState: 'read',
        shownUpdateButton: "none",
        shownUpdateSubelButton: "",
        supplierId: typeof(this.$route.query.supplierId) == 'undefined' ? null : this.$route.query.supplierId,
      }
    },
    mounted() {
      // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
    },
    created() {
      this.rwDispatcherState = "write" //write  read
      // this.baseinfo.name="www";
      this.blicense.startTime = "2012-02-12"
      this.loadInfo();
    },
    methods: {
      shownUpdateSbutton(action) {
        if (action == true) {
          this.shownUpdateButton = ""
          this.shownUpdateSubelButton = "none"
          this.rwDispatcherState = "write" //write  read
        } else {
          this.shownUpdateButton = "none"
          this.shownUpdateSubelButton = ""
          this.rwDispatcherState = "read" //write  read
        }

      },

      async loadInfo() {
        await searchSupplierDetail({
          supplierId: this.supplierId
        }).then(response => {
          if (response.result.result.supplier != null) {
           this.blicense.supplierName = response.result.result.supplier.name;
           this.blicense.phoneNumber = response.result.result.supplier.phone;
           this.blicense.shopName = response.result.result.shop.shopName;
           this.blicense.notice = response.result.result.shop.notice;
           this.blicense.licenseName = response.result.result.supplierMainInfo.licenseName;
           this.blicense.creditCode = response.result.result.supplierMainInfo.creditCode;
           this.blicense.workNumber = response.result.result.supplierMainInfo.workNumber;
           this.blicense.introduce = response.result.result.supplierMainInfo.introduce;
           this.blicense.brand = response.result.result.supplierMainInfo.brand;
           this.blicense.startTime = response.result.result.supplierMainInfo.startTime;
           this.blicense.phone = response.result.result.supplierMainInfo.phone;
           this.blicense.email = response.result.result.supplierMainInfo.email;
           this.blicense.registerCapital = response.result.result.supplierMainInfo.registerCapital;
           this.blicense.legalPerson = response.result.result.supplierMainInfo.legalPerson;
           this.blicense.cardType = response.result.result.supplierMainInfo.cardType;
           this.blicense.cardNo = response.result.result.supplierMainInfo.cardNo;
           this.cardPhotos =response.result.result.supplierMainInfo.cardPhotos;
           this.licensePhotos = response.result.result.supplierMainInfo.licensePhotos;
          }
        });
      },

      savebaseinfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                console.log(this.blicense);
                let  picId=[];
                for(let  i=0; i<this.cardPhotos.length ; i++){
                      let  x = this.cardPhotos[i];
                      picId.push(this.cardPhotos[i].uid);
                }


                this.blicense.cardPhoto = picId;

                let  licensePhotoId=[];
                for(let  i=0; i<this.licensePhotos.length ; i++){
                      let  x = this.licensePhotos[i];
                      licensePhotoId.push(this.licensePhotos[i].uid);
                }
                this.blicense.licensePhoto = licensePhotoId;
                saveSupplierInfo(this.baseinfo,this.blicense).then(response=>{
                  this.cardPhotos =response.result.result.supplierMainInfo.cardPhotos;
                  this.rwDispatcherState="read";
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  // this.$router.go(0)
                  this.$forceUpdate();
                });
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },

      handlePictureCardPreview(){

      },

      handleRemove(){

      },
      dialogVisible(){

      }

    }
  }
</script>

<style>
</style>
