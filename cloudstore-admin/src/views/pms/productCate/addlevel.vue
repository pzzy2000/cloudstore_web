<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never" style="margin:20px 20px 0 20px">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">添加商品分类</span>
    </el-card>
    <el-form label-width="80px" style="width: 500px;margin-top: 20px" :model="addGoodsort" :refs="addGoodsort" :rules="rules">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="addGoodsort.name" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-input v-model="addGoodsort.level" disabled></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model="addGoodsort.order" placeholder="排个序吧"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addGoodsort')">立即创建</el-button>
        <el-button @click="resetForm('addGoodsort')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { savegoodLevel } from '@/api/productCate'
  export default {
    data() {
      return {
        addGoodsort: {
          name: '',
          level: '',
          order: ''
        },
        rules: {
          name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
          order: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        }
      }
    },
    created() {
      if (this.$route.query.level == "1"){
        this.addGoodsort.level = "一级";
      }else if (this.$route.query.level == "2"){
        this.addGoodsort.level = "二级";
      }else {
        this.addGoodsort.level = "三级";
      }
    },
    methods: {
      handelSelectlevel() {
        console.log(this.addGoodsort.level)
      },
      submitForm() {
        let parentId;
        if (this.$route.query.parentId == null){
          parentId = 0;
        }else {
          parentId = this.$route.query.parentId;
        }
        console.log(parentId);
        console.log(this.$route.query.level);
        let obj = {
          level: this.$route.query.level,
          name: this.addGoodsort.name,
          sort: this.addGoodsort.order,
          optType: "save",
          parentId: parentId
        }
        // let _this = this;
        savegoodLevel('/goods/category/save', obj).then(res => {
          console.log(res);
          if(res.result.code == 0) {
            this.$router.push("/sys/goods/category");
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
