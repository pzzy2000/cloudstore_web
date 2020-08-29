import {asyncRouterMap, constantRouterMap} from '@/router/index';

//判断是否有权限访问该菜单
function hasPermission(menus, routeChild) {
  // if (routeChild.name) {
  //   let currMenu = getMenu(routeChild.name, menus);
  //   //routeChild.hidden = !currMenu;
  //   console.log(currMenu);
  //    return currMenu;
  // } else {
  //   return false
  // }
  return true;
}

//根据路由名称获取菜单
function getMenu(name, menus) {
  // for (let i = 0; i < menus.length; i++) {
  //   let menu = menus[i];
  //   if (name === menu.key) {
  //     return true;
  //   }
  // }
  for (let i in menus) {
    if (name == i) {
      return true;
    }
  }
  return false;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if (router.children && router.children.length > 0) {
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p) {
  return function (m, n) {
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({commit}, menuBeans) {
      return new Promise(resolve => {
        const accessedRouters = asyncRouterMap.filter(v => {
          if (v.children && v.children.length > 0) {
            v.children = v.children.filter(child => {
              if (hasPermission(menuBeans, child)) {
                return true
              } else {
                return false;
              }
            })
          }

          if (v.hidden == true) return false;
          if (v.children.length > 0)
            return true;
          else {
            return false;
          }

        });

        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;
