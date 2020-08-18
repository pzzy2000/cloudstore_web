<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never" style="margin:20px 20px 0 20px">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">添加商品分类</span>
    </el-card>
    <el-card class="operate-container" shadow="never" style="margin:20px 20px 0 20px">
      <el-form label-width="90px" :model="addGoodsort" ref="addGoodsort" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addGoodsort.name" placeholder="分类名称" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model="addGoodsort.level" disabled style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model="addGoodsort.order" placeholder="排个序吧" style="width: 350px" oninput="value=value.replace(/\D/g, '')"></el-input>
        </el-form-item>
        <el-form-item label="分类图片(一张就好)" prop="categoryPic" v-if="addGoodsort.level == '二级' ? true : false">
          <SingleUpload v-model="addGoodsort.categoryPic" logotype="1"></SingleUpload>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="submitForm('addGoodsort')" size="small" :loading="loadingbut" :disabled="disabled" v-if="isshow == 'update' ? false : true">{{subbtntext}}</el-button>
          <el-button type="primary" @click="uppdateForm('addGoodsort')" size="small" v-if="isshow == 'update' ? true : false" :disabled="disabled">{{updbtntext}}</el-button>
          <el-button @click="resetForm('addGoodsort')" size="small">重置</el-button>
          <el-button @click="backLastpage" size="small">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { savegoodLevel, getOnelevel } from '@/api/productCate'
  import SingleUpload from '@/components/Upload/singleUpload';
  export default {
    components: {
      SingleUpload
    },
    data() {
      return {
        addGoodsort: {
          name: '',
          level: '',
          order: '',
          categoryPic: []
        },
        rules: {
          name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
          categoryPic: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        loadingbut: false,
        subbtntext: "添加",
        updbtntext: "更新",
        disabled: false,
        isshow: '',
        categoryPhotos: []
      }
    },
    created() {
      if (this.$route.query.optType == 'update') {
        this.getList();
      }
      if (this.$route.query.level == "1"){
        this.addGoodsort.level = "一级";
      }else if (this.$route.query.level == "2"){
        this.addGoodsort.level = "二级";
      }else {
        this.addGoodsort.level = "三级";
      }
      this.isshow = this.$route.query.optType;
    },
    methods: {
      getList() {
        getOnelevel({id: this.$route.query.id}).then(res => {
          console.log(res)
          this.addGoodsort.categoryPic = [];
          this.addGoodsort.name = res.result.result.name;
          this.addGoodsort.order = res.result.result.sort;
          // this.categoryPhotos = res.result.result.goodsPics;
          if (res.result.result.categoryPicUrl !== undefined) {
            let obj = {};
            obj.url = res.result.result.categoryPicUrl;
            obj.uid = res.result.result.categoryPic;
            this.addGoodsort.categoryPic.push(obj);
          }
        })
      },
      handelSelectlevel() {
        console.log(this.addGoodsort.level)
      },
      submitForm(formName) {
        let parentId;
        if (this.$route.query.parentId == null){
          parentId = 0;
        }else {
          parentId = this.$route.query.parentId;
        }
        let obj = {
          level: this.$route.query.level,
          name: this.addGoodsort.name,
          sort: this.addGoodsort.order,
          optType: "save",
          parentId: parentId
        }
        if (this.addGoodsort.level == "二级") {
          let categoryPic = []
          for (let i=0; i<this.addGoodsort.categoryPic.length; i++) {
            categoryPic.push(this.addGoodsort.categoryPic[i].uid);
          }
          obj.categoryPic = categoryPic
        }
        this.loadingbut = true;
        this.subbtntext = '添加中...';
        this.disabled = true;
        // let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            savegoodLevel(obj).then(res => {
              console.log(res);
              if(res.result.code == 0) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 800
                });
                this.$router.back();
                this.loadingbut = false;
                this.subbtntext = '添加';
                this.disabled = false;
              }
            })
          }else {
            this.loadingbut = false;
            this.subbtntext = '添加';
            this.disabled = false;
          }
        })
      },
      uppdateForm(formName) {
        this.$confirm('是否要更新该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let obj = {
                level: this.$route.query.level,
                name: this.addGoodsort.name,
                sort: this.addGoodsort.order,
                optType: "update",
                id: this.$route.query.id
              }
              if (this.addGoodsort.level == "二级") {
                let categoryPic = []
                for (let i=0; i<this.addGoodsort.categoryPic.length; i++) {
                  categoryPic.push(this.addGoodsort.categoryPic[i].uid);
                }
                obj.categoryPic = categoryPic
              }
              this.disabled = true;
              this.updbtntext = "更新中...";
              this.loadingbut = true;
              savegoodLevel(obj).then(res => {
                this.disabled = false;
                this.updbtntext = "更新";
                this.loadingbut = false;
                if(res.result.code == 0) {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 800
                  });
                  this.$router.back();
                }
              })
            }else {
              this.disabled = false;
              this.updbtntext = "更新";
              this.loadingbut = false;
            }
          })
        }).catch(e => e)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$message({
          message: '重置成功',
          type: 'success',
          duration:800
        });
      },
      backLastpage() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
