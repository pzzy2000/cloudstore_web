<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>
          <!--基本信息--></span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="baseinfo" ref="baseinfoFrom" size="small" label-width="130px">
          <el-divider content-position="left"><i class="el-icon-search"></i>社区代理基本信息</el-divider>
          <el-form-item label="代理名字名称：" prop="name">
            <span>{{baseinfo.name}}</span>
          </el-form-item>
          <br />
          <el-form-item label="代理等级：" prop="returnRuleId">
          <span v-if="baseinfo.levelBean !=null ">{{baseinfo.levelBean.name}}</span>
          </el-form-item>
          <br />
          <el-form-item label="联系电话：" prop="phone">
            <span>{{baseinfo.phone}}</span>
          </el-form-item>
          <br />



          <el-form-item label="地区：" prop="provinceId">
            <span v-if="baseinfo.provinceBean !=null " >{{baseinfo.provinceBean.name}}</span>
            <span v-if="baseinfo.cityBean !=null ">{{baseinfo.cityBean.name}}</span>
            <span v-if="baseinfo.areaBean !=null ">{{baseinfo.areaBean.name}}</span>
            <span v-if="baseinfo.detailAddress !=null " >{{baseinfo.detailAddress}}</span>
          </el-form-item>
          <br />

          <el-form-item label="审核状态：" prop="goodsSubtitle">
            <span>{{baseinfo.status}}</span>
          </el-form-item>
          <br />
          <el-form-item label="所属账号：" prop="goodsBrand">
            <span v-if="baseinfo.sysManagerUserBean !=null " >{{baseinfo.sysManagerUserBean.name}}</span>
          </el-form-item>
          <br />



        </el-form>
        <div style="text-align:center">

          <el-button style="float: none;margin-bottom: 10px;" @click="addProduct" :style="{ display: button.add}" size="small">
            增加
          </el-button>

          <el-button style="float: none;margin-bottom: 10px;" @click="resetProduct" :style="{ display: button.reset}"
            size="small">
            重置
          </el-button>

          <el-button style="float: none;margin-bottom: 10px;" @click="updateProduct" :style="{ display: button.update}"
            size="small">
            更新
          </el-button>

          <el-button style="float: none;margin-bottom: 10px;" @click="cancelList" :style="{ display: button.cancel}"
            size="small">
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
    getAgentInfo
  } from '@/api/agent';

  export default {
    name: "goodBaseinfo",
    provide() {
      return {
        rwDispatcherProvider: this
      }
    },
    data() {
      return {
        // baseInfo: Object.assign({}, defaultBaseInfo),
        loading: false,
        baseinfo: {
          // id: '',
          // name:'',
          // levelBean:{name:''},
          // provinceBean:{name:''},
          // cityBean:{name:''},
          // areaBean:{name:''},
          // sysManagerUserBean:{name:''}
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
        agentId: null,
        rwDispatcherState: 'read',
      }
    },
    mounted() {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  mounted 2");
      // mounted在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
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
      }
    },
    methods: {

      showinfoBut() {
        this.button.add = "none";
        this.button.reset = "none";
        this.button.update = "none";
        this.button.cancel = "";
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

        action = 0;


        action = parseInt((typeof(action) == 'undefined') ? "2" : action);
        switch (action) {
          case 0:
            this.rwDispatcherState = "read"; //write  read
            this.agentId = (typeof(this.$route.query.agentId) == 'undefined') ? null : this.$route.query.agentId;
            this.showinfoBut();
            break;
          case 1:
            // this.rwDispatcherState = "write"; //write  read
            // this.showAddBut();
            // this.baseinfo = {};
            // break;
          case 2:
            // this.rwDispatcherState = "write";
            // this.goodsId = (typeof(this.$route.query.goodsId) == 'undefined') ? -1 : this.$route.query.goodsId;
            // this.showUpdateBut();
            // break;
        }
        if (action == 2 || action == 0) {
          this.loadInfo();
        }
        // this.searchRootCategory();
        // this.selectRootDistrict();
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

        switch (item) {
          case 1:
            { //一级分类
              this.category.two = [];
              this.category.three = [];
              this.baseinfo.categoryTwoId = '';
              this.baseinfo.categoryThreeId = '';
              fetchListWithChildren(event).then(response => {
                let list = response.result.result;
                this.category.two = list;
              });
              break;
            }
          case 2:
            {
              this.category.three = [];
              this.baseinfo.categoryThreeId = '';
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
              this.baseinfo.cityId = '';
              this.baseinfo.areaId = '';
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
              this.baseinfo.areaId = '';
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
      async loadInfo() {
        if (this.agentId === null) {
          msg("系统错误,没有发现商品信息[id]");
          return;
        };
        let agentId = this.agentId;
        console.log("load  goods info  agentId : " + agentId);
        await getAgentInfo({
          id: agentId
        }).then(response => {
          1 + 1;
          if (response) {
            this.baseinfo = response.result.result;
          } else {
            msg("系统错误,获得商品信息错误");
          }
        });
      },
      cancelList() {
        if (window.history.length > 1) {
          this.$router.back()
        } else {
          this.$router.push('/sys/goods/list')
        }

      },

      updateProduct() {
        msg("更新");
      },

      resetProduct() {
        msg("重置form");
      },

      addProduct() {

        this.$refs['baseinfoFrom'].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createProduct(this.baseinfo).then(response => {
                if (!response) return;
                this.$refs['baseinfoFrom'].resetFields();
                this.$message({
                  message: '增加商品成功',
                  type: 'success',
                  duration: 1000
                });
                //this.$router.go(0)
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
    }
  }
</script>

<style>
</style>
