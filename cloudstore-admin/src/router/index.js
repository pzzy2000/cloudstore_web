import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
  {path: '/manage/login', component: () => import('@/views/login/manageLoging'), hidden: true},
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
		       meta: {title: '活动列表', icon: 'product-list', keepAlive: true}
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
       meta: {title: '供应商列表', icon: 'product-list', keepAlive: true}
     },
     {
       path: 'edit',
       name: 'supplier_edit',
       component: () => import('@/views/supplier/info'),
       meta: {title: '创建店铺', icon: 'product-list'},
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
         meta: {title: '商品列表', icon: 'product-list', keepAlive: true}
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
       },{
        path: 'edit',
         name: 'edit_goods',
         component: () => import('@/views/pms/product/info/editinfo'),
         meta: {title: '编辑商品', icon: 'product-add'},
         hidden: true
       },
        {
         path: 'sku/edit',
         name: 'sku_edit',
         component: () => import('@/views/pms/product/sku/info'),
         meta: {title: 'SKU管理', icon: 'product-list'},
         hidden: true
       },{
         path: 'sku/info',
         name: 'sku_info',
         component: () => import('@/views/pms/product/sku/info'),
         meta: {title: 'SKU管理', icon: 'product-list'},
         hidden: true
       },
       {
           path: 'category/list',
           name: 'category_list',
           component: () => import('@/views/pms/productCate/index'),
           meta: {title: '商品分类', icon: 'product-list', keepAlive: true}
         },
         // {
         //   path: 'category',
         //   name: 'goods_category',
         //   component: () => import('@/views/pms/productCate/index'),
         //   meta: {title: '商品分类', icon: 'product-list'}
         // },
         {
           path: 'category/add',
           name: 'category_add',
           component: () => import('@/views/pms/productCate/addlevel'),
           meta: {title: '添加分类', icon: 'product-list'},
           hidden: true
         },
      {
         path: 'property/list',
         name: 'property_list',
         component: () => import('@/views/pms/productAttr/index'),
         meta: {title: '商品规格参数', icon: 'product-list', keepAlive: true}
       },{
         path: 'property/add',
         name: 'property_add',
         component: () => import('@/views/pms/productAttr/addspecification'),
         meta: {title: '添加商品规格', icon: 'product-list'},
         hidden: true
       },{
         path: 'property/update',
         name: 'property_update',
         component: () => import('@/views/pms/productAttr/addspecification'),
         meta: {title: '添加商品规格', icon: 'product-list'},
         hidden: true
       }, {
         path: 'property/specs/list',
         name: 'goods_specs_list',
         component: () => import('@/views/pms/productAttr/productAttrList'),
         meta: {title: '规格列表', keepAlive: true},
         hidden: true
       }, {
         path: 'property/specs/add',
         name: 'goods_specs_add',
          component: () => import('@/views/pms/productAttr/addspectypes'),
         meta: {title: '增加规格'},
         hidden: true
       }, {
         path: 'property/specs/update',
         name: 'goods_specs_update',
          component: () => import('@/views/pms/productAttr/addspectypes'),
         meta: {title: '更新规格'},
         hidden: true
       },{
         path: 'property/param/list',
         name: 'goods_param_list',
         component: () => import('@/views/pms/productAttr/productAttrList'),
         meta: {title: '参数列表', keepAlive: true},
         hidden: true
       }, {
         path: 'property/param/add',
         name: 'goods_param_add',
          component: () => import('@/views/pms/productAttr/addspectypes'),
         meta: {title: '增加规格'},
         hidden: true
       },{
         path: 'property/param/update',
         name: 'goods_param_update',
          component: () => import('@/views/pms/productAttr/addspectypes'),
         meta: {title: '增加规格'},
         hidden: true
       }, {
           path: 'goodsAsserverlist',
           name: 'goods_Asserverlist',
           component: () => import('@/views/pms/asServer/list'),
           meta: {title: '售后服务', icon: "product-list"}
        },{
           path: 'goodsAsserver',
           name: 'goods_Asserver',
           component: () => import('@/views/pms/asServer/index'),
           meta: {title: '售后服务详情', icon: "product-list"},
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
        meta: {title: '佣金活动列表', icon: 'product-list', keepAlive: true}
      },
      {
        path: 'brokegoods',
        name: 'broke_goods',
        component: () => import('@/views/brokerage/brokegoods'),
        meta: {title: '佣金商品', icon: 'product-list', keepAlive: true},
        hidden: true
      },
      {
        path: 'brageinfo',
        name: 'brage_info',
        component: () => import('@/views/brokerage/brageInfo'),
        meta: {title: '佣金sku', icon: 'product-list', keepAlive: true},
        hidden: true
      },
      {
        path: 'defbro',
        name: 'default_broke',
        component: () => import('@/views/brokerage/defBroke'),
        meta: {title: '默认佣金', icon: 'product-list'}
      },
      {
        path: 'withdrawbrage',
        name: 'withdraw_brage',
        component: () => import('@/views/brokerage/withdrawBrage'),
        meta: {title: '客户佣金列表', icon: 'product-list', keepAlive: true}
      },
      {
        path: 'withdrawinfo',
        name: 'withdraw_info',
        component: () => import('@/views/brokerage/withdrawInfo'),
        meta: {title: '客户佣金详情', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'goodsBroke',
        name: 'goodsBroke',
        component: () => import('@/views/brokerage/goodsBroke/index'),
        meta: {title: '商品默认佣金', icon: 'product-list'}
      },
      {
        path: 'settingBroke',
        name: 'settingBroke',
        component: () => import('@/views/brokerage/goodsBroke/settingBroke'),
        meta: {title: '商品佣金设置', icon: 'product-list'},
        hidden: true
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
        meta: {title: '代理列表', icon: 'product-list', keepAlive: true}
     },{
        path: 'info',
        name: 'agent_info',
        component: () => import('@/views/agent/agentInfo'),
        meta: {title: '代理详情', icon: 'product-list'},
        hidden: true
     },{
        path: 'level',
        name: 'agent_level',
        component: () => import('@/views/agent/level/list'),
        meta: {title: '代理等级', icon: 'product-list'},
        hidden: true
     },{
       path: 'addlevel',
       name: 'agent_addlevel',
       component: () => import('@/views/agent/level/addlevel'),
       meta: {title: '管理代理等级', icon: 'product-list'},
       hidden: true
     },{
        path: 'goods',
        name: 'agent_goods',
        component: () => import('@/views/agent/goods'),
        meta: {title: '代理商品', icon: 'product-list'},
       hidden: true
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
        meta: {title: '系统用户列表', icon: 'product-list', keepAlive: true}
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
      },
      {
        path: 'index/slideshow',
        name: 'slideshow',
        component: () => import('@/views/sys/slideshow'),
        meta: {title: '首页轮播图', icon: 'ums-resource'}
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/sys/setting'),
        meta: {title: '系统设置', icon: 'ums-resource'}
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
          meta: {title: '客户列表', icon: 'product-list', keepAlive: true}
        },
        {
          path: 'info',
          name: 'client_info',
          component: () => import('@/views/client/adduser'),
          meta: {title: '客户详情', icon: 'product-list'},
           hidden: true
        },
        {
          path: 'agent/apply/list',
          name: 'agent_apply_list',
          component: () => import('@/views/client/agent/applylist'),
          meta: {title: '代理申请列表', icon: 'product-list', keepAlive: true}
        },
        {
          path: 'agent/apply/info',
          name: 'agent_apply_info',
          component: () => import('@/views/client/agent/applyinfo'),
          meta: {title: '代理申请详情', icon: 'product-list'},
          hidden: true
        },
        // {
        //   path: 'add',
        //   name: 'adduser',
        //   component: () => import('@/views/client/adduser'),
        //   meta: {title: '添加客户', icon: 'product-list'},
        //   hidden: true
        // },
        // {
        //   path: 'level',
        //   name: 'level',
        //   component: () => import('@/views/client/level'),
        //   meta: {title: '客户等级', icon: 'ums-resource'}
        // },
        // {
        //   path: 'addlevel',
        //   name: 'user_addlevel',
        //   component: () => import('@/views/client/addlevel'),
        //   meta: {title: '添加等级', icon: 'ums-resource'},
        //   hidden: true
        // }
      ]
  },
  // {
  //     path:'/sys/tracking',
  //     component: Layout,
  //     redirect: '/sys/tracking/list',
  //     name: 'tracking',
  //     meta: {title: '物流管理', icon: 'product-list'},
  //     children: [
  //       {
  //         path: 'list',
  //         name: 'trackinglist',
  //         component: () => import('@/views/tracking/list'),
  //         meta: {title: '物流公司列表', icon: 'product-list'}
  //       },
  //       {
  //         path: 'addlogistics',
  //         name: 'addlogistics',
  //         component: () => import('@/views/tracking/addlogistics'),
  //         meta: {title: '添加物流公司', icon: 'product-list'},
  //         hidden: true
  //       }
  //     ]
  // },
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
        meta: {title: '订单列表', icon: 'product-list', keepAlive: true},
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
        meta: {title: '发货列表', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'asservice',
        name: 'as_service',
        component: () => import('@/views/order/asService/index'),
        meta: {title: '售后服务', icon: 'product-list', keepAlive: true}
      },
      {
        path: 'asinfo',
        name: 'as_info',
        component: () => import('@/views/order/asService/asInfo'),
        meta: {title: '退款详情', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'temoffre',
        name: 'temof_fre',
        component: () => import('@/views/order/temOffre/index'),
        meta: {title: '运费模板', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'shipaddress',
        name: 'ship_address',
        component: () => import('@/views/order/shipAddress/index'),
        meta: {title: '发货地址', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'orderreview',
        name: 'order_review',
        component: () => import('@/views/order/orderReview/index'),
        meta: {title: '订单评论', icon: 'product-list'},
        hidden: true
      }
    ]
  },{
	  path:'/allocation/order',
	    component: Layout,
	    redirect: '/allocation/order/agent/list',
	    name: 'allOrder',
	    meta: {title: '配送管理', icon: 'product-list'},
	    children: [
	    	 {
            path: 'agent/list',
            name: 'ps_agent_list',
            component: () => import('@/views/allocation/order/list'),
            meta: {title: '代理', icon: 'product-list', keepAlive: true},
            hidden: false
         },
         {
             path: 'kuaidi/list',
             name: 'ps_kd_list',
             component: () => import('@/views/allocation/order/kuaidi'),
             meta: {title: '快递', icon: 'product-list', keepAlive: true},
             hidden: false
          },
         {
            path: 'agent/detail',
            name: 'ps_agent_detail',
            component: () => import('@/views/allocation/order/detail'),
            meta: {title: '配送详情', icon: 'product-list'},
            hidden: true
	      },
		  {
		     path: 'allocation/order/detail',
		     name: 'ps_order_detail',
		     component: () => import('@/views/allocation/order/allocation/order/detail'),
		     meta: {title: '配送详情', icon: 'product-list'},
		     hidden: true
		   }
	    ]

  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: constantRouterMap
})
