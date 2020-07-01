<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span><!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="bean" ref="bean" :rules="rules" size="small" label-width="130px">
          <el-divider content-position="left"><i class="el-icon-search"></i>添加数字字典</el-divider>
          <el-form-item label="字典CODE：" prop="code">
            <el-input style="width: 214px" v-model="bean.code" placeholder="字典CODE"></el-input>
          </el-form-item>
           <br/>
          <el-form-item label="字典名称：" prop="name">
            <el-input style="width: 214px" v-model="bean.name" placeholder="字典名称"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="字典类型:" prop="dirctType">
            <el-select v-model="bean.dirctType.code" placeholder="字典类型">
              <el-option
                v-for="item in dirctTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br/>
          <el-form-item label="描述：">
            <el-input style="width: 900px" v-model="bean.desc" placeholder="描述"></el-input>
          </el-form-item>
          <br />
          <el-form-item style="float: right">
            <div>
              <el-button @click="saveUpdate('bean')" type="primary" size="small">
                提交
              </el-button>
              <el-button @click="resetForm('bean')" size="small">
                重置
              </el-button>
              <el-button @click="backLastpage" size="small">
                返回
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    get,saveUpate
  } from '@/api/sysdict'
  import {msg} from '@/api/iunits';
  export default {
    name: "addDict",
    data() {
      return {
        // rwDispatcherState: 'write',
        bean: {
          dirctType: {}
        },
        parent:{
        name:""
        },
        dirctTypes:[{
          label: "服务保证",
          value: "fubz"
        },{
          label: "行政划分",
          value: "area"
        }],
        rules: {
          code: [
            { required: true, message: '请输入字典CODE', trigger: 'blur' },
            { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入字典名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          dirctType: [{ required: true, message: '请选择字典类型', trigger: 'change' }]
        }
      }
    },
     mounted() {
                // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
            },
    created() {
      this.bean.optType = this.$route.query.opt == 0 ?'save':"update",
      this.bean.parentId =typeof(this.$route.query.parentId) == 'undefined' ? 0 : this.$route.query.parentId;
      this.loadInfo();
    },
    methods: {
      async loadInfo() {
        if(this.bean.parentId > 0){
           await get({
             parentId: this.bena.parentId
           }).then(response => {
             this.parent.name="www";
           });
        }
      },
      saveUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.bean.dirctType.code == "area"){
              this.bean.dirctType.name = "行政划分";
            }else {
              this.bean.dirctType.name = "服务保证";
            }
            saveUpate(this.bean).then(response => {
              msg('保存数据成功');
            });
          } else {
            return false;
          }
        });
      },
      backLastpage() {
        this.$router.go(-1);
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

<style>
</style>
