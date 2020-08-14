<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>
          <!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="baseinfo" ref="baseinfo" size="small" label-width="180px" :rules="rules">
          <el-divider content-position="left"><i class="el-icon-search"></i>商品基本信息</el-divider>
          <el-form-item label="商品名称：" prop="goodsName">
            <el-input-dispatcher v-model="baseinfo.goodsName" style="width: 650px;"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="分享图片(只有1个)：" prop="sharePics">
            <div v-if="rwDispatcherState =='read'">
              <el-image v-for=" (item,index) in sharePics" :src="item.url" :key='index' style="width: 150px; height: 150px;margin-right: 20px;" v-model="baseinfo.sharePics">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div v-else>
              <single-upload v-model="sharePics" logotype="share"></single-upload>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="商品标题图片(只有1个)：" prop="goodsPics">
            <div v-if="rwDispatcherState =='read'">
              <el-image v-for=" (item,index) in goodsPics" :src="item.url" :key='index' style="width: 150px; height: 150px;margin-right: 20px;" v-model="baseinfo.goodsPics">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div v-else>
              <single-upload v-model="goodsPics" logotype="1"></single-upload>
            </div>
          </el-form-item>
          <br />
          <el-form-item label="商品详情图片(最多5个)：" prop="goodsDetailPics">
            <div v-if="rwDispatcherState =='read'">
              <el-image v-for=" (item,index) in goodsDetailPics" :src="item.url" :key='index' style="width: 150px; height: 150px;margin-right: 20px;" v-model="baseinfo.goodsDetailPics">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div v-else>
              <multi-upload v-model="goodsDetailPics"></multi-upload>
            </div>
            <span style="color: #ccc">格式要求：每张图片大小不超过1M</span>
          </el-form-item>
          <br />
<!--          <el-form-item label="退货规则：" prop="returnRuleId">-->
<!--            <el-select-dispatcher v-model="baseinfo.returnRuleId" id="returnRuleId" placeholder="退货规则">-->
<!--            </el-select-dispatcher>-->
<!--          </el-form-item>-->
<!--          <br />-->
<!--          <el-form-item label="运费规则：" prop="freightRuleId">-->
<!--            <el-select-dispatcher v-model="baseinfo.freightRuleId" id="freightRuleId">-->
<!--            </el-select-dispatcher>-->
<!--          </el-form-item>-->
<!--          <br />-->
          <el-form-item label="商品分类：" prop="categoryOneId">
            <el-select-dispatcher v-model="baseinfo.categoryOneId" :options="category1" remote placeholder="一级分类"
              :loading="loading" v-on:change="seclectCategory($event, 1)">
              <el-option v-for="item in category.one" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item prop="categoryTwoId">
            <el-select-dispatcher v-model="baseinfo.categoryTwoId" :options="category1" remote v-on:change="seclectCategory($event, 2)"
              placeholder="二级分类" :loading="loading">
              <el-option v-for="item in category.two" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item prop="categoryThreeId">
            <el-select-dispatcher v-model="baseinfo.categoryThreeId" :options="category1" remote v-on:change="seclectCategory($event, 3)"
              placeholder="三级分类" :loading="loading">
              <el-option v-for="item in category.three" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="地区：" prop="provinceId">
            <el-select-dispatcher v-model="baseinfo.provinceId" :options="category1" remote placeholder="省" :loading="loading"
              @change="selectDistrict($event, 1)">
              <el-option v-for="item in district.province" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item prop="cityId">
            <el-select-dispatcher v-model="baseinfo.cityId" :options="category1" remote placeholder="市" :loading="loading"
              @change="selectDistrict($event, 2)">
              <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <el-form-item prop="areaId">
            <el-select-dispatcher v-model="baseinfo.areaId" :options="category1" remote placeholder="区/县" :loading="loading"
              @change="selectDistrict($event, 3)">
              <el-option v-for="item in district.area" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="副标题：" prop="goodsSubtitle">
            <el-input-dispatcher v-model="baseinfo.goodsSubtitle"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品品牌：" prop="goodsBrand">
            <el-input-dispatcher v-model="baseinfo.goodsBrand"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品货号：" prop="goodsNumber">
            <el-input-dispatcher v-model="baseinfo.goodsNumber"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="商品售价：" prop="salePrice">
            <el-input-dispatcher v-model="baseinfo.salePrice"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="市场价：" prop="martPrice">
            <el-input-dispatcher v-model="baseinfo.martPrice"></el-input-dispatcher>
          </el-form-item>
          <br />
          <el-form-item label="计量单位：" prop="unit">
            <el-input-dispatcher v-model="baseinfo.unit"></el-input-dispatcher>
          </el-form-item>


        </el-form>
        <div style="text-align:center">
          <el-button style="float: none;margin-bottom: 10px;" @click="addProduct" :style="{ display: button.add}">
            增加
          </el-button>
          <el-button style="float: none;margin-bottom: 10px;" @click="resetProduct" :style="{ display: button.reset}">
            重置
          </el-button>
          <el-button style="float: none;margin-bottom: 10px;" @click="updateProduct" :style="{ display: button.update}">
            更新
          </el-button>
          <el-button style="float: none;margin-bottom: 10px;" @click="cancelList" type="primary">
            返回
          </el-button>

        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
  import {
    msg
  } from '@/api/iunits';

  import {
    fetchListWithChildren
  } from '@/api/productCate';

  import {
    fetchDistrictList
  } from '@/api/sysdict';

  import {
    getProduct,
    createProduct,
    updateGood
  } from '@/api/product';

  import SingleUpload from '@/components/Upload/singleUpload';

    import MultiUpload from '@/components/Upload/multiUpload';

  export default {
    name: "goodBaseinfo",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    components: {
      SingleUpload,MultiUpload
    },
    data() {
      return {
        // baseInfo: Object.assign({}, defaultBaseInfo),
        loading: false,
        baseinfo: {
          id: null,
          // goodsPics:[],
          categoryOneId: '',
          categoryTwoId: '',
          categoryThreeId: '',
          goodsPics: [],
          goodsDetailPics: [],
          sharePics: []
        },
        category: {
          one: [],
          two: [],
          three: []
        },
        district: {
          province: [],
          city: [],
          area: []
        },
        button: {
          update: "none",
          add: "none",
          cancel: 'none',
          reset: "none"
        },
        goodsId: null,
        rwDispatcherState: 'write',
        sharePics: [],
        goodsPics: [],
        goodsDetailPics:[],
        rules: {
          goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          sharePics: [{ required: true, message: '不能为空', trigger: 'change' }],
          goodsPics: [{ required: true, message: '不能为空', trigger: 'change' }],
          goodsDetailPics: [{ required: true, message: '不能为空', trigger: 'change' }],
          categoryOneId: [{required: true, message: '请输入一级分类', trigger: ['blur', 'change']}],
          categoryTwoId: [{required: true, message: '请输入二级分类', trigger: ['blur', 'change']}],
          provinceId: [{required: true, message: '请输入省', trigger: 'change'}],
          cityId: [{required: true, message: '请输入市', trigger: 'change'}],
          areaId: [{required: true, message: '请输入区/县', trigger: 'change'}],
          goodsSubtitle: [{required: true, message: '请输入副标题', trigger: 'blur'}],
          salePrice: [
            {required: true, message: '请输入商品售价', trigger: 'blur'},
            { pattern: /^[0-9]{0,3}$|^[0-9]{0,3}(\.[0-9]{1,2})?$/, message: '整数,不超过3位，小数点后2位' }
          ],
          martPrice: [
            {required: true, message: '请输入市场价', trigger: 'blur'},
            { pattern: /^[0-9]{0,3}$|^[0-9]{0,3}(\.[0-9]{1,2})?$/, message: '整数,不超过3位，小数点后2位' }
          ],
          unit: [{required: true, message: '请输入计量单位', trigger: 'blur'}]
        }
      }
    },
    beforeMount() {},
    created() {
      this.reload();
    },
    mounted() {
      this.reload()
    },
    watch: {
      '$route'(to, from) {
        console.log('to=' + to)
        this.reload()
      },
    },
    methods: {
      showinfoBut() {
        this.button.add = "none";
        this.button.reset = "none";
        this.button.update = "none";
        this.button.cancel = "none";
      },

      showAddBut() {
        this.button.add = "";
        this.button.reset = "";
        this.button.update = "none";
        this.button.cancel = "none";
      },
      showUpdateBut() {
        this.button.add = "none";
        this.button.reset = "none";
        this.button.update = "";
        this.button.cancel = "";
      },
      reload() {
        let action = this.$route.query.action; //1:增加 2：编辑 0:查看,默认是查看
        action = parseInt((typeof(action) == 'undefined') ? "1" : action);
        switch (action) {
          case 0:
            this.rwDispatcherState = "read"; //write  read
            this.goodsId = (typeof(this.$route.query.goodsId) == 'undefined') ? -1 : this.$route.query.goodsId;
            this.showinfoBut();
            break;
          case 1:
            this.rwDispatcherState = "write"; //write  read
            this.showAddBut();
            this.baseinfo = {};
            break;
          case 2:
            this.rwDispatcherState = "write";
            this.goodsId = (typeof(this.$route.query.goodsId) == 'undefined') ? -1 : this.$route.query.goodsId;
            this.showUpdateBut();
            break;
        }
        if (action == 2 || action == 0) {
          this.loadInfo();
        }
        this.searchRootCategory();
        this.selectRootDistrict();
      },
      searchRootCategory() {
        this.loading = true;
        fetchListWithChildren(0).then(response => {
          this.loading = false;
          let list = response.result.result;
          this.category.one = list;
        });
      },
      selectRootDistrict() {
        this.loading = true;
        fetchDistrictList({
          codeType: 'province',
          parentId: 0
        }).then(response => {
          this.loading = false;
          let list = response.result.result;

          this.district.province = list.records;

        });
      },

      seclectCategory(event, item) {
        console.log(this.baseinfo);
        switch (item) {
          case 1:
            { //一级分类
              this.category.two = [];
              this.category.three = [];
              if (this.baseinfo.categoryTwoId !== undefined) {
                this.$set(this.baseinfo, 'categoryTwoId', '');
                this.$set(this.baseinfo, 'categoryThreeId', '');
              }
              fetchListWithChildren(event).then(response => {
                let list = response.result.result;
                this.category.two = list;
              });
              break;
            }
          case 2:
            {
              this.category.three = [];
              fetchListWithChildren(event).then(response => {
                let list = response.result.result;
                this.category.three = list;
              });
              break;
            }
        }
        this.$forceUpdate();
      },
      selectDistrict(type, item) {
        switch (item) {
          case 1:
            { //一级分类
              this.district.city = [];
              this.district.area = [];
              // this.baseinfo.cityId = '';
              // this.baseinfo.areaId = '';
              if (this.baseinfo.cityId !== undefined) {
                this.$set(this.baseinfo, 'cityId', '');
                this.$set(this.baseinfo, 'areaId', '');
              }
              fetchDistrictList({
                codeType: 'city',
                parentId: type
              }).then(response => {
                let list = response.result.result;
                this.district.city = list.records;
              });
              break;
            }
          case 2:
            {
              this.category.area = [];
              // this.baseinfo.areaId = '';
              this.$set(this.baseinfo, 'areaId', '');
              fetchDistrictList({
                codeType: 'district',
                parentId: type
              }).then(response => {
                let list = response.result.result;
                this.district.area = list.records;
              });
              break;
            }
        }
        this.$forceUpdate();
      },

      category1(e) {

      },

      getaction() {
        let action = this.$route.query.action; //1:增加 2：编辑 0:查看,默认是查看
        action = parseInt((typeof(action) == 'undefined') ? "1" : action);
        return action;
      },

      async loadInfo() {

        if (this.goodsId === null) {
          msg("系统错误,没有发现商品信息[id]");
          return;
        };
        let goodsId_ = this.goodsId;
        console.log("load  goods info  goodsid : " + goodsId_);

        await getProduct({
          id: goodsId_
        }).then(response => {
          let  goodsinfo =response.result.result;
          let action = this.getaction();
          if (action == 0 || action == 2) {
            fetchListWithChildren(goodsinfo.categoryOneId).then(response => {
              let list = response.result.result;
              this.category.two = list;
            });
            fetchListWithChildren(goodsinfo.categoryTwoId).then(response => {
              let list = response.result.result;
              this.category.three = list;
            });

            fetchDistrictList({
              codeType: 'city',
              parentId: goodsinfo.provinceId
            }).then(response => {
               this.district.city = response.result.result.records;
               fetchDistrictList({
                 codeType: 'district',
                 parentId: goodsinfo.cityId
               }).then(response1 => {
                 this.district.area = response1.result.result.records;
                 this.baseinfo = goodsinfo;
                 this.sharePics = [];
                 let obj = {};
                 obj.uid = this.baseinfo.sharePics;
                 obj.url = this.baseinfo.sharePicsUrl;
                 this.sharePics.push(obj);
                 console.log("+++++++++++++++")
                 console.log(this.sharePics);
                 this.goodsPics = this.baseinfo.goodsPhotos;
                 this.goodsDetailPics = this.baseinfo.goodsDetailPhotos;
               });
            });
          }
        });
      },
      cancelList() {
        this.$router.back()
      },

      updateProduct() {
        let udpobj = {};
        let goodsPics = [];
        for (let i = 0; i < this.goodsPics.length; i++) {
          let x = this.goodsPics[i];
          goodsPics.push(this.goodsPics[i].uid);
        }
        udpobj.goodsPics = goodsPics;
        let goodsDetailPics = [];
        for (let i = 0; i < this.goodsDetailPics.length; i++) {
          let x = this.goodsDetailPics[i];
          goodsDetailPics.push(this.goodsDetailPics[i].uid);
        }
        udpobj.goodsDetailPics = goodsDetailPics;
        let sharePics = [];
        for (let i = 0; i < this.sharePics.length; i++) {
          let x = this.sharePics[i];
          sharePics.push(this.sharePics[i].uid);
        }
        udpobj.sharePics = sharePics;
        udpobj.optType = "update";
        udpobj.areaId = this.baseinfo.areaId;
        udpobj.categoryOneId = this.baseinfo.categoryOneId;
        // udpobj.categoryThreeId = this.baseinfo.categoryThreeId;
        udpobj.categoryTwoId = this.baseinfo.categoryTwoId;
        udpobj.cityId = this.baseinfo.cityId;
        udpobj.provinceId = this.baseinfo.provinceId;
        udpobj.goodsSubtitle = this.baseinfo.goodsSubtitle;
        udpobj.salePrice = this.baseinfo.salePrice;
        udpobj.martPrice = this.baseinfo.martPrice;
        udpobj.unit = this.baseinfo.unit;
        udpobj.goodsName = this.baseinfo.goodsName;
        udpobj.supplierId = this.baseinfo.supplierId;
        udpobj.goodsBrand = this.baseinfo.goodsBrand;
        udpobj.goodsNumber = this.baseinfo.goodsNumber
		    udpobj.id= this.goodsId;
        this.$confirm('是否更新数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateGood(udpobj).then(res => {
            if(res){
              let  reuslt  = res.result;
              if(reuslt.code==0){
                msg("更新商品数据成功");
                this.$router.go(-1);
              }else{
                msg("更新商品数据失败["+reuslt.msg+"]");
              }
            }else{
              msg("更新商品数据错误");
            }
          })
        }).catch((e) => {
          this.$message({
            message: '没有提交',
            type: 'warning',
            duration: 800
        })
        })
      },
      resetProduct() {
        this.$refs['baseinfo'].resetFields();
      },

      addProduct() {
        let sharePics = [];
        for (let i = 0; i < this.sharePics.length; i++) {
          let x = this.sharePics[i];
          sharePics.push(this.sharePics[i].uid);
        }
        this.baseinfo.sharePics = sharePics;
        let goodsPics = [];
        for (let i = 0; i < this.goodsPics.length; i++) {
          let x = this.goodsPics[i];
          goodsPics.push(this.goodsPics[i].uid);
        }
        this.baseinfo.goodsPics = goodsPics;
        let goodsDetailPics = [];
        for (let i = 0; i < this.goodsDetailPics.length; i++) {
          let x = this.goodsDetailPics[i];
          goodsDetailPics.push(this.goodsDetailPics[i].uid);
        }
        this.baseinfo.goodsDetailPics = goodsDetailPics;
        this.$refs['baseinfo'].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createProduct(this.baseinfo).then(response => {
                if (response.result.code == 0) {
                  this.$refs['baseinfo'].resetFields();
                  this.goodsPics = [];
                  this.goodsDetailPics=[],
                    this.$message({
                      message: '增加商品成功',
                      type: 'success',
                      duration: 1000
                    });
                  this.$router.push("/sys/goods/list");
                }
              });
            })
          }else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
    }
  }
</script>

<style>
</style>
