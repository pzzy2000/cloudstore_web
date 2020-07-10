import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export  function back(){
	 if (window.history.length > 1) {
       this.$router.back()
     } else {
       this.$router.push('/sys/goods/list')
     }
}

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/sign', component: () => import('@/views/sign/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
    {
        path:'/sys/power',
        component: Layout,
        redirect: '/sys/power/module/list',
        name: 'power',
        meta: {title: '权限管理', icon: 'product-list'},
         children: [{
           path: 'module/list',
           name: 'module_list',
           component: () => import('@/views/power/module/list'),
           meta: {title: '模块列表', icon: 'product-list'}
         },{
           path: 'role/list',
           name: 'role_list',
           component: () => import('@/views/power/role/list'),
           meta: {title: '角色列表', icon: 'product-list'}
         },{
           path: 'role/module/list',
           name: 'role_module_list',
           component: () => import('@/views/power/role/rolemodule'),
           meta: {title: '角色列表', icon: 'product-list'},
            hidden: true
         }]
      },
	 {
		    path:'/sys/activity',
		    component: Layout,
		    redirect: '/sys/activity/list',
		    name: 'activity',
		    meta: {title: '活动管理', icon: 'product-list'},
		     children: [{
		       path: 'list',
		       name: 'activity_list',
		       component: () => import('@/views/activity/list'),
		       meta: {title: '活动列表', icon: 'product-list'}
		     },{
		       path: 'addact',
		       name: 'add_activity',
		       component: () => import('@/views/activity/addactivity'),
		       meta: {title: '添加活动', icon: 'product-list'},
		       hidden: true
		     },{
		       path: 'assogoods',
		       name: 'asso_goods',
		       component: () => import('@/views/activity/activitygoods'),
		       meta: {title: '活动商品', icon: 'product-list'},
		       hidden: true
		     },
		     {
		       path: 'apply',
		       name: 'activity_apply',
		       component: () => import('@/views/activity/assoGoods'),
		       meta: {title: '申请活动', icon: 'product-list'}
		     }]
		  },
  {
    path:'/sys/supplier',
    component: Layout,
    redirect: '/sys/supplier/list',
    name: 'supplier',
    meta: {title: '供应商管理', icon: 'product-list'},
     children: [{
       path: 'list',
       name: 'supplier_list',
       component: () => import('@/views/supplier/list'),
       meta: {title: '供应商列表', icon: 'product-list'}
     },
     {
       path: 'edit',
       name: 'supplier_edit',
       component: () => import('@/views/supplier/info'),
       meta: {title: '编辑供应商', icon: 'product-list'},
       // hidden: true
     },
     {
       path: 'info',
       name: 'supplier_info',
       component: () => import('@/views/supplier/info'),
       meta: {title: '供应商详情', icon: 'product-list'},
       hidden: true
     }]
  },
  {
      path:'/sys/goods',
      component: Layout,
      redirect: '/sys/goods/list',
      name: 'goods',
      meta: {title: '商品管理', icon: 'product-list'},
       children: [{
         path: 'list',
         name: 'goods_list',
         component: () => import('@/views/pms/product/list'),
         meta: {title: '商品列表', icon: 'product-list'}
       },
       {
        path: 'add',
         name: 'add_goods',
         component: () => import('@/views/pms/product/info/editinfo'),
         meta: {title: '添加商品', icon: 'product-add'},
       },
       {
         path: 'info',
         name: 'goods_info',
         component: () => import('@/views/pms/product/info/editinfo'),
         meta: {title: '商品详情', icon: 'product-list'},
         hidden: true
       },
        {
         path: 'skuinfo',
         name: 'sku_info',
         component: () => import('@/views/pms/product/sku/info'),
         meta: {title: 'SKU管理', icon: 'product-list'},
         hidden: true
       },
       {
           path: 'category',
           name: 'goods_category',
           component: () => import('@/views/pms/productCate/index'),
           meta: {title: '商品分类', icon: 'product-list'}
         },
         // {
         //   path: 'category',
         //   name: 'goods_category',
         //   component: () => import('@/views/pms/productCate/index'),
         //   meta: {title: '商品分类', icon: 'product-list'}
         // },
         {
           path: 'addlevel',
           name: 'add_level',
           component: () => import('@/views/pms/productCate/addlevel'),
           meta: {title: '添加分类', icon: 'product-list'},
           hidden: true
         },
       // {
       //  path: 'addProductAttrParm',
       //   name: 'addProductAttrParm',
       //   component: () => import('@/views/pms/product/components/ProductAttrDetail'),
       //   meta: {title: '添加商品属性参数', icon: 'product-add'},
       //   hidden: true
       // },
       // {
       //   path: 'add',
       //   name: 'goodsSave',
       //   component: () => import('@/views/pms/productCate/add'),
       //   meta: {title: '添加商品分类'},
       //   hidden: true
       // },
       {
         path: 'addProductAttr',
         name: 'addProductAttr',
         component: () => import('@/views/pms/productAttr/addProductAttr'),
         meta: {title: '添加属性'},
         hidden: true
       },
       {
         path: 'param',
         name: 'goodsParam',
         component: () => import('@/views/pms/productAttr/productAttrList'),
         meta: {title: '添加规格'},
         hidden: true
       },{
         path: 'property',
         name: 'goods_property',
         component: () => import('@/views/pms/productAttr/index'),
         meta: {title: '商品规格参数', icon: 'product-list'}
       },{
         path: 'addspec',
         name: 'goods_addspec',
         component: () => import('@/views/pms/productAttr/addspecification'),
         meta: {title: '添加商品规格', icon: 'product-list'},
         hidden: true
       },{
         path: 'addspectypes',
         name: 'goods_addspectypes',
         component: () => import('@/views/pms/productAttr/addspectypes'),
         meta: {title: '添加商品规格类型', icon: 'product-list'},
         hidden: true
       }]
  },
  {
    path:'/broke/rage',
    component: Layout,
    redirect: '/broke/broke/index',
    name: 'brokerage',
    meta: {title: '佣金管理', icon: 'product-list'},
    children: [{
        path: 'index',
        name: 'broke_rage',
        component: () => import('@/views/brokerage/index'),
        meta: {title: '佣金活动列表', icon: 'product-list'}
      },
      {
        path: 'brokegoods',
        name: 'broke_goods',
        component: () => import('@/views/brokerage/brokegoods'),
        meta: {title: '佣金商品', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'brageinfo',
        name: 'brage_info',
        component: () => import('@/views/brokerage/brageInfo'),
        meta: {title: '佣金sku', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'defbro',
        name: 'default_broke',
        component: () => import('@/views/brokerage/defBroke'),
        meta: {title: '默认佣金', icon: 'product-list'}
      }]
  },
  {
    path:'/sys/agent',
    component: Layout,
    redirect: '/sys/agent/list',
    name: 'agent',
    meta: {title: '代理商', icon: 'product-list'},
     children: [{
         path: 'list',
        name: 'agent_list',
        component: () => import('@/views/agent/list'),
        meta: {title: '代理列表', icon: 'product-list'}
     },{
        path: 'info',
        name: 'agent_info',
        component: () => import('@/views/agent/agentInfo'),
        meta: {title: '代理详情', icon: 'product-list'}
     },{
        path: 'level',
        name: 'agent_level',
        component: () => import('@/views/agent/level/list'),
        meta: {title: '代理等级', icon: 'product-list'}
     },{
       path: 'addlevel',
       name: 'agent_addlevel',
       component: () => import('@/views/agent/level/addlevel'),
       meta: {title: '添加代理等级', icon: 'product-list'},
       hidden: true
     },{
        path: 'goods',
        name: 'agent_goods',
        component: () => import('@/views/agent/goods'),
        meta: {title: '代理商品', icon: 'product-list'}
     },{
       path: 'addgoods',
       name: 'add_goodsInfo',
       component: () => import('@/views/agent/addgoods'),
       meta: {title: '添加代理商品', icon: 'product-list'},
       hidden: true
     }]
  },
  {
    path:'/sys/manager',
    component: Layout,
    redirect: '/sys/manager/user/list',
    name: 'sys',
    meta: {title: '系统管理', icon: 'product-list'},
    children: [
      {
        path: 'user/list',
        name: 'user_list',
        component: () => import('@/views/sys/user/index'),
        meta: {title: '系统用户列表', icon: 'product-list'}
      },
      {
        path: 'user/edit',
        name: 'useredit',
        component: () => import('@/views/sys/user/edit'),
        meta: {title: '编辑系统用户', icon: 'product-list'},
        hidden: true
      },{
        path: 'user/info',
        name: 'usereinfo',
        component: () => import('@/views/sys/user/edit'),
        meta: {title: '系统用户详情', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'dict/list',
        name: 'dictlist',
        component: () => import('@/views/sys/dict/list'),
        meta: {title: '数字字典列表', icon: 'ums-resource'}
      },
      {
        path: 'dict/add',
        name: 'dictadd',
        component: () => import('@/views/sys/dict/add'),
        meta: {title: '添加数字字典', icon: 'ums-resource'},
         hidden: true
      }
    ]
  },
  {
      path:'/sys/client',
      component: Layout,
      redirect: '/sys/client/list',
      name: 'client',
      meta: {title: '客户管理', icon: 'product-list'},
      children: [
        {
          path: 'list',
          name: 'client_list',
          component: () => import('@/views/client/list'),
          meta: {title: '客户列表', icon: 'product-list'}
        },
        {
          path: 'userinfo',
          name: 'userinfo',
          component: () => import('@/views/client/userinfo'),
          meta: {title: '客户详情', icon: 'product-list'}
        },
        {
          path: 'userapply',
          name: 'userapply',
          component: () => import('@/views/client/userapply'),
          meta: {title: '客户代理申请', icon: 'product-list'}
        },
        {
          path: 'userApplyinfo',
          name: 'userApply_info',
          component: () => import('@/views/client/userApplyinfo'),
          meta: {title: '代理申请详情', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'add',
          name: 'adduser',
          component: () => import('@/views/client/adduser'),
          meta: {title: '添加客户', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'level',
          name: 'level',
          component: () => import('@/views/client/level'),
          meta: {title: '客户等级', icon: 'ums-resource'}
        },
        {
          path: 'addlevel',
          name: 'user_addlevel',
          component: () => import('@/views/client/addlevel'),
          meta: {title: '添加等级', icon: 'ums-resource'},
          hidden: true
        }
      ]
  },
  {
      path:'/sys/tracking',
      component: Layout,
      redirect: '/sys/tracking/list',
      name: 'tracking',
      meta: {title: '物流管理', icon: 'product-list'},
      children: [
        {
          path: 'list',
          name: 'trackinglist',
          component: () => import('@/views/tracking/list'),
          meta: {title: '物流公司列表', icon: 'product-list'}
        },
        {
          path: 'addlogistics',
          name: 'addlogistics',
          component: () => import('@/views/tracking/addlogistics'),
          meta: {title: '添加物流公司', icon: 'product-list'},
          hidden: true
        }
      ]
  },
  {
    path:'/order/manage',
    component: Layout,
    redirect: '/order/manage/orderlist',
    name: 'order',
    meta: {title: '订单管理', icon: 'product-list'},
    children: [
      {
        path: 'orderlist',
        name: 'order_list',
        component: () => import('@/views/order/orderlist/index'),
        meta: {title: '订单列表', icon: 'product-list'},
      },
      {
        path: 'readorder',
        name: 'read_order',
        component: () => import('@/views/order/orderlist/readorder'),
        meta: {title: '查看订单', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'csmlist',
        name: 'csm_list',
        component: () => import('@/views/order/consignlist/index'),
        meta: {title: '发货列表', icon: 'product-list'}
      },
      {
        path: 'asservice',
        name: 'as_service',
        component: () => import('@/views/order/asService/index'),
        meta: {title: '售后服务', icon: 'product-list'}
      },
      {
        path: 'temoffre',
        name: 'temof_fre',
        component: () => import('@/views/order/temOffre/index'),
        meta: {title: '运费模板', icon: 'product-list'}
      },
      {
        path: 'shipaddress',
        name: 'ship_address',
        component: () => import('@/views/order/shipAddress/index'),
        meta: {title: '发货地址', icon: 'product-list'}
      },
      {
        path: 'orderreview',
        name: 'order_review',
        component: () => import('@/views/order/orderReview/index'),
        meta: {title: '订单评论', icon: 'product-list'}
      }
    ]
  },
  // {
  //   path: '/pms',
  //   component: Layout,
  //   redirect: '/pms/product',
  //   name: 'pms',
  //   meta: {title: '商品', icon: 'product'},
  //   children: [{
  //     path: 'product',
  //     name: 'product',
  //     component: () => import('@/views/pms/product/index'),
  //     meta: {title: '商品列表', icon: 'product-list'}
  //   },
  //     {
  //       path: 'addProduct',
  //       name: 'addProduct',
  //       component: () => import('@/views/pms/product/add'),
  //       meta: {title: '添加商品', icon: 'product-add'}
  //     },
  //     {
  //       path: 'updateProduct',
  //       name: 'updateProduct',
  //       component: () => import('@/views/pms/product/update'),
  //       meta: {title: '修改商品', icon: 'product-add'},
  //       hidden: true
  //     },
  //     {
  //       path: 'productCate',
  //       name: 'productCate',
  //       component: () => import('@/views/pms/productCate/index'),
  //       meta: {title: '商品分类', icon: 'product-cate'}
  //     },
  //     {
  //       path: 'addProductCate',
  //       name: 'addProductCate',
  //       component: () => import('@/views/pms/productCate/add'),
  //       meta: {title: '添加商品分类'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateProductCate',
  //       name: 'updateProductCate',
  //       component: () => import('@/views/pms/productCate/update'),
  //       meta: {title: '修改商品分类'},
  //       hidden: true
  //     },
  //     {
  //       path: 'productAttr',
  //       name: 'productAttr',
  //       component: () => import('@/views/pms/productAttr/index'),
  //       meta: {title: '商品类型', icon: 'product-attr'}
  //     },
  //     {
  //       path: 'productAttrList',
  //       name: 'productAttrList',
  //       component: () => import('@/views/pms/productAttr/productAttrList'),
  //       meta: {title: '商品属性列表'},
  //       hidden: true
  //     },
  //     {
  //       path: 'addProductAttr',
  //       name: 'addProductAttr',
  //       component: () => import('@/views/pms/productAttr/addProductAttr'),
  //       meta: {title: '添加商品属性'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateProductAttr',
  //       name: 'updateProductAttr',
  //       component: () => import('@/views/pms/productAttr/updateProductAttr'),
  //       meta: {title: '修改商品属性'},
  //       hidden: true
  //     },
  //     {
  //       path: 'brand',
  //       name: 'brand',
  //       component: () => import('@/views/pms/brand/index'),
  //       meta: {title: '品牌管理', icon: 'product-brand'}
  //     },
  //     {
  //       path: 'addBrand',
  //       name: 'addBrand',
  //       component: () => import('@/views/pms/brand/add'),
  //       meta: {title: '添加品牌'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateBrand',
  //       name: 'updateBrand',
  //       component: () => import('@/views/pms/brand/update'),
  //       meta: {title: '编辑品牌'},
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/oms',
  //   component: Layout,
  //   redirect: '/oms/order',
  //   name: 'oms',
  //   meta: {title: '订单', icon: 'order'},
  //   children: [
  //     {
  //       path: 'order',
  //       name: 'order',
  //       component: () => import('@/views/oms/order/index'),
  //       meta: {title: '订单列表', icon: 'product-list'}
  //     },
  //     {
  //       path: 'orderDetail',
  //       name: 'orderDetail',
  //       component: () => import('@/views/oms/order/orderDetail'),
  //       meta: {title: '订单详情'},
  //       hidden:true
  //     },
  //     {
  //       path: 'deliverOrderList',
  //       name: 'deliverOrderList',
  //       component: () => import('@/views/oms/order/deliverOrderList'),
  //       meta: {title: '发货列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'orderSetting',
  //       name: 'orderSetting',
  //       component: () => import('@/views/oms/order/setting'),
  //       meta: {title: '订单设置', icon: 'order-setting'}
  //     },
  //     {
  //       path: 'returnApply',
  //       name: 'returnApply',
  //       component: () => import('@/views/oms/apply/index'),
  //       meta: {title: '退货申请处理', icon: 'order-return'}
  //     },
  //     {
  //       path: 'returnReason',
  //       name: 'returnReason',
  //       component: () => import('@/views/oms/apply/reason'),
  //       meta: {title: '退货原因设置', icon: 'order-return-reason'}
  //     },
  //     {
  //       path: 'returnApplyDetail',
  //       name: 'returnApplyDetail',
  //       component: () => import('@/views/oms/apply/applyDetail'),
  //       meta: {title: '退货原因详情'},
  //       hidden:true
  //     }
  //   ]
  // },
  // {
  //   path:'/sms',
  //   component: Layout,
  //   redirect: '/sms/coupon',
  //   name: 'sms',
  //   meta: {title: '营销', icon: 'sms'},
  //   children: [
  //     {
  //       path: 'flash',
  //       name: 'flash',
  //       component: () => import('@/views/sms/flash/index'),
  //       meta: {title: '秒杀活动列表', icon: 'sms-flash'}
  //     },
  //     {
  //       path: 'flashSession',
  //       name: 'flashSession',
  //       component: () => import('@/views/sms/flash/sessionList'),
  //       meta: {title: '秒杀时间段列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'selectSession',
  //       name: 'selectSession',
  //       component: () => import('@/views/sms/flash/selectSessionList'),
  //       meta: {title: '秒杀时间段选择'},
  //       hidden:true
  //     },
  //     {
  //       path: 'flashProductRelation',
  //       name: 'flashProductRelation',
  //       component: () => import('@/views/sms/flash/productRelationList'),
  //       meta: {title: '秒杀商品列表'},
  //       hidden:true
  //     },
  //     {
  //       path: 'coupon',
  //       name: 'coupon',
  //       component: () => import('@/views/sms/coupon/index'),
  //       meta: {title: '优惠券列表', icon: 'sms-coupon'}
  //     },
  //     {
  //       path: 'addCoupon',
  //       name: 'addCoupon',
  //       component: () => import('@/views/sms/coupon/add'),
  //       meta: {title: '添加优惠券'},
  //       hidden:true
  //     },
  //     {
  //       path: 'updateCoupon',
  //       name: 'updateCoupon',
  //       component: () => import('@/views/sms/coupon/update'),
  //       meta: {title: '修改优惠券'},
  //       hidden:true
  //     },
  //     {
  //       path: 'couponHistory',
  //       name: 'couponHistory',
  //       component: () => import('@/views/sms/coupon/history'),
  //       meta: {title: '优惠券领取详情'},
  //       hidden:true
  //     },
  //     {
  //       path: 'brand',
  //       name: 'homeBrand',
  //       component: () => import('@/views/sms/brand/index'),
  //       meta: {title: '品牌推荐', icon: 'product-brand'}
  //     },
  //     {
  //       path: 'new',
  //       name: 'homeNew',
  //       component: () => import('@/views/sms/new/index'),
  //       meta: {title: '新品推荐', icon: 'sms-new'}
  //     },
  //     {
  //       path: 'hot',
  //       name: 'homeHot',
  //       component: () => import('@/views/sms/hot/index'),
  //       meta: {title: '人气推荐', icon: 'sms-hot'}
  //     },
  //     {
  //       path: 'subject',
  //       name: 'homeSubject',
  //       component: () => import('@/views/sms/subject/index'),
  //       meta: {title: '专题推荐', icon: 'sms-subject'}
  //     },
  //     {
  //       path: 'advertise',
  //       name: 'homeAdvertise',
  //       component: () => import('@/views/sms/advertise/index'),
  //       meta: {title: '广告列表', icon: 'sms-ad'}
  //     },
  //     {
  //       path: 'addAdvertise',
  //       name: 'addHomeAdvertise',
  //       component: () => import('@/views/sms/advertise/add'),
  //       meta: {title: '添加广告'},
  //       hidden:true
  //     },
  //     {
  //       path: 'updateAdvertise',
  //       name: 'updateHomeAdvertise',
  //       component: () => import('@/views/sms/advertise/update'),
  //       meta: {title: '编辑广告'},
  //       hidden:true
  //     }
  //   ]
  // },
  // {
  //   path:'/ums',
  //   component: Layout,
  //   redirect: '/ums/admin',
  //   name: 'ums',
  //   meta: {title: '权限', icon: 'ums'},
  //   children: [
  //     {
  //       path: 'admin',
  //       name: 'admin',
  //       component: () => import('@/views/ums/admin/index'),
  //       meta: {title: '用户列表', icon: 'ums-admin'}
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/ums/role/index'),
  //       meta: {title: '角色列表', icon: 'ums-role'}
  //     },
  //     {
  //       path: 'allocMenu',
  //       name: 'allocMenu',
  //       component: () => import('@/views/ums/role/allocMenu'),
  //       meta: {title: '分配菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'allocResource',
  //       name: 'allocResource',
  //       component: () => import('@/views/ums/role/allocResource'),
  //       meta: {title: '分配资源'},
  //       hidden: true
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('@/views/ums/menu/index'),
  //       meta: {title: '菜单列表', icon: 'ums-menu'}
  //     },
  //     {
  //       path: 'addMenu',
  //       name: 'addMenu',
  //       component: () => import('@/views/ums/menu/add'),
  //       meta: {title: '添加菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateMenu',
  //       name: 'updateMenu',
  //       component: () => import('@/views/ums/menu/update'),
  //       meta: {title: '修改菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'resource',
  //       name: 'resource',
  //       component: () => import('@/views/ums/resource/index'),
  //       meta: {title: '资源列表', icon: 'ums-resource'}
  //     },
  //     {
  //       path: 'resourceCategory',
  //       name: 'resourceCategory',
  //       component: () => import('@/views/ums/resource/categoryList'),
  //       meta: {title: '资源分类'},
  //       hidden: true
  //     }
  //   ]
  // },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
