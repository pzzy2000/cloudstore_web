<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px"  size="small">
      <el-form-item label="商品分类：" >
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
        <el-cascader
          v-model="selectProductCateValueOne"
          :options="productCateOptionsOne">
        </el-cascader>
        <el-cascader
          v-model="selectProductCateValueTwo"
          :options="productCateOptionsTwo">
        </el-cascader>
      </el-form-item>

      <el-form-item label="地区：" >
        <el-cascader
          v-model="selectProvinceValue"
          :options="provinceOptions">
        </el-cascader>
        <el-cascader
          v-model="selectCityValue"
          :options="cityOptions">
        </el-cascader>
        <el-cascader
          v-model="selectDistrictValue"
          :options="districtOptions">
        </el-cascader>
      </el-form-item>

      <el-form-item label="商品名称：">
        <el-input v-model="value.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" >
        <el-input v-model="value.goodsSubtitle"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：">
        <el-input v-model="value.goodsBrand"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item> -->
      <el-form-item label="商品货号：">
        <el-input v-model="value.goodsNumber"></el-input>
      </el-form-item>
     <el-form-item label="商品售价：">
        <el-input v-model="value.salePrice"></el-input>
      </el-form-item>
     <el-form-item label="市场价：">
        <el-input v-model="value.martPrice"></el-input>
      </el-form-item> -->
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {getProduct,createProduct} from '@/api/product';
  import {fetchList as provinceChildren,get} from '@/api/sysdict';


  export default {
    name: "ProductInfoDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        selectProductCateValueOne: [],
        productCateOptionsOne: [],
        selectProductCateValueTwo: [],
        productCateOptionsTwo: [],
        selectProvinceValue: [],
        provinceOptions: [],
        selectCityValue: [],
        cityOptions: [],
        selectDistrictValue: [],
        districtOptions: [],
        //productParam: Object.assign({}, defaultProductParam),
        rules: {
          goodsName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          goodsSubtitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          //productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
          goodsBrand: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
          //description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          //requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateList();
      /* this.getProvinceList(); 
      let param = {pageNum: 1, pageSize: 100,codeType:'province'};
      provinceChildren(param).then(response => {
        let list = response.result.result;
        this.provinceOptions = [];
        for (let i = 0; i < list.length; i++) {
          this.provinceOptions.push({label: list[i].name, value: list[i].id});
        }
      });
      **/
      //this.getBrandList();
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },
     /* getProvinceList() {


      }, */
      selectProvinceValue: function (newValue) {
          get({'id':newValue[0]}).then(response => {
          let list = response.result.result;
          this.cityOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.cityOptions.push({label: list[i].name, value: list[i].id});
          }
        });
        this.value.provinceId= newValue[0];
      },
      selectCityValue: function (newValue) {
        provinceChildren({'id':newValue[0]}).then(response => {
          let list = response.result.result;
          this.districtOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.districtOptions.push({label: list[i].name, value: list[i].id});
          }
        });
        this.value.cityId= newValue[0];
      },
      selectDistrictValue: function (newValue) {
        this.value.areaId= newValue[0];
      },
      selectProductCateValue: function (newValue) {
        /* if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName=null;
        } */
        fetchListWithChildren(newValue).then(response => {
          let list = response.result.result;
          this.productCateOptionsOne = [];
          for (let i = 0; i < list.length; i++) {
            this.productCateOptionsOne.push({label: list[i].name, value: list[i].id});
          }
        });
        this.value.categoryOneId= newValue[0];
      },
      selectProductCateValueOne: function (newValue) {
        fetchListWithChildren(newValue).then(response => {
          let list = response.result.result;
          this.productCateOptionsTwo = [];
          for (let i = 0; i < list.length; i++) {
            this.productCateOptionsTwo.push({label: list[i].name, value: list[i].id});
          }
        });
        this.value.categoryTwoId= newValue[0];
      },
      selectProductCateValueTwo: function (newValue) {
        this.value.categoryThreeId= newValue[0];
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.productCategoryId!=null){
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated=true;
      },
      getProductCateList() {
        fetchListWithChildren(0).then(response => {
          let list = response.result.result;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.productCateOptions.push({label: list[i].name, value: list[i].id});
          }
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getCateNameById(id){
        /* let name=null;
        for(let i=0;i<this.productCateOptions.length;i++){
          for(let j=0;j<this.productCateOptions[i].children.length;j++){
            if(this.productCateOptions[i].children[j].value===id){
              name=this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name; */
       let name=null;
       for(let i=0;i<this.productCateOptions.length;i++){
          if(this.productCateOptions[i].value===id){
              name =this.productCateOptions[i].label;
              return name;
          }
       }

      },
      getCateNameByIdOne(id){
       let name=null;
       for(let i=0;i<this.productCateOptionsOne.length;i++){
          if(this.productCateOptionsOne[i].value===id){
              name =this.productCateOptionsOne[i].label;
              return name;
          }
       }
      },
      getCateNameByIdTwo(id){
       let name=null;
       for(let i=0;i<this.productCateOptionsTwo.length;i++){
          if(this.productCateOptionsTwo[i].value===id){
            console.log(this.productCateOptionsTwo[i].value);
              name =this.productCateOptionsTwo[i].label;
              return name;
          }
       }
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
           /* this.$emit('finishCommit'); */
           this.value.optType = 'save';
           createProduct(this.value).then(response=>{
             this.$message({
               type: 'success',
               message: '提交成功',
               duration:1000
             });
             //location.reload();
            //this.$emit('nextStep');
            this.$router.push({path:'/sys/goods/addProductAttrParm'});
           });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      handleBrandChange(val) {
        let brandName = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            brandName = this.brandOptions[i].label;
            break;
          }
        }
        this.value.brandName = brandName;
      }
    }
  }
</script>

<style scoped>
</style>
