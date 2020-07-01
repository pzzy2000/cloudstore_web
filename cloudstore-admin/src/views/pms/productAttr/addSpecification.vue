<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-divider content-position="left"><i class="el-icon-search"></i>商品规格参数</el-divider>
      <el-form ref="productAttrCate":model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="propertyName">
          <el-input v-model="productAttrCate.propertyName" auto-complete="off" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="descs">
          <el-input v-model="productAttrCate.descs" auto-complete="off" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleConfirm('productAttrCate')" size="small">添 加</el-button>
          <el-button @click="resetForm('productAttrCate')" size="small">重 置</el-button>
          <el-button @click="retLastpage" size="small">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    import { createProductAttrCate,updateProductAttrCate } from '@/api/productAttrCate';
    export default {
      name: "add-specification",
      data() {
        return {
          productAttrCate:{
            propertyName: '',
            descs: '',
            id: ''
          },
          rules: {
            propertyName: [
              { required: true, message: '请输入类型名称', trigger: 'blur' }
            ]
          }
        }
      },
      created() {
        console.log(this.$route.query);
        this.productAttrCate.propertyName = this.$route.query.propertyName;
        this.productAttrCate.descs = this.$route.query.descs;
        this.productAttrCate.id = this.$route.query.id;
      },
      methods: {
        retLastpage() {
          this.$router.go(-1);
        },
        handleConfirm(formName){
          console.log(this.productAttrCate.id);
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.productAttrCate.id == null){
                createProductAttrCate({'propertyName':this.productAttrCate.propertyName,'descs':this.productAttrCate.descs,'optType':'save'}).then(response=>{
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.push("/sys/goods/property");
                });
              } else {
                updateProductAttrCate({'id':this.productAttrCate.id,'propertyName':this.productAttrCate.propertyName,'descs':this.productAttrCate.descs,'optType':'update'}).then(response=>{
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.push("/sys/goods/property");
                });
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 800
          });
        }
      }
    }
</script>

<style scoped>

</style>
