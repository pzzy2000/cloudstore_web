<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>{{operaType}}</span>
      </div>
      <div style="overflow: hidden">
        <el-form ref="productAttrCatForm" :model="productAttrCatForm" :rules="rules" label-width="120px" style="width: 400px; margin-top: 20px">
          <el-form-item label="类型名称" prop="name">
            <el-input v-model="productAttrCatForm.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div style="float: right">
          <el-button type="primary" @click="handleConfirm('productAttrCatForm')" size="small">确 定</el-button>
          <el-button @click="backPage" size="small">取 消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {createProductAttr} from '@/api/productAttr'
    export default {
      name: "add-spectypes",
      data() {
        return {
          productAttrCatForm: {
            name: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入属性名称', trigger: 'blur' }
            ]
          },
          operaType: ''//具体操作
        }
      },
      created() {
        switch (this.$route.query.allMsg){
          case "0add": this.operaType = "添加商品规格";
            break;
          case "0update": this.operaType = "编辑商品规格";
            this.productAttrCatForm.name = this.$route.query.name;
            break;
          case "1add": this.operaType = "添加商品参数";
            break;
          case "1update": this.operaType = "编辑商品参数";
            this.productAttrCatForm.name = this.$route.query.name;
            break
        }
      },
      methods: {
        handleConfirm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.$route.query.optTp == "add"){
                createProductAttr({'goodsPropertyId':this.$route.query.goodsPropertyId,'name':this.productAttrCatForm.name,'optType':'save','type':this.$route.query.type}).then(response=>{
                  if (response.result.code == 0) {
                    this.$message({
                      message: '添加成功',
                      type: 'success',
                      duration:1000
                    });
                    this.$router.go(-1);
                  }
                });
              }else{
                createProductAttr({'id':this.$route.query.id,'name':this.productAttrCatForm.name,'optType':'update'}).then(response=>{
                  if (response.result.code == 0) {
                    this.$message({
                      message: '修改成功',
                      type: 'success',
                      duration:1000
                    });
                    this.$router.go(-1);
                  }
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        backPage() {
          this.$router.go(-1);
        }
      }
    }
</script>

<style scoped>

</style>
