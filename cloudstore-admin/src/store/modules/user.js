import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_userType: (state, res) => {
      state.userType = res;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      userInfo['bean.access'] = userInfo['bean.access'].trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log("++++++++++++")
          console.log(response);
          const data = response.result.result;
          const tokenStr = data.token
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          // commit('SET_userType', data.userType)
          localStorage.setItem('userType', data.userType);
          localStorage.setItem('userAccont', data.access);
          localStorage.setItem('userName', data.name);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
           let  res=response.result;
           if(res.code ==0){
             commit('SET_ROLES', '1212')
               commit('SET_NAME', '1212')
              commit('SET_AVATAR', '1212')
           }else{

           }
                     // const data = response.result;
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          // commit('SET_NAME', data.username)
          // commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
