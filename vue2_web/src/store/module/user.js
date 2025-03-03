import { login, logout, getUserAuth, ticketLogin } from '@/api/user'
import { setToken, getToken, getLocal, setLocal } from '@/libs/util'
export default {
    state: {
        token: getToken(),
        userInfo: getLocal('userInfo') || {},
        // 详细个人信息
        userId: '',
        userCode: '',
        userName: getLocal('userInfo').username || '',
        roleCode: null,
        roleName: '',
        roleList: [],
        // 是否存下了用户信息
        hasGetInfo: false,

        // access处理页面访问权限
        access: getLocal('access') || [],
        //  auth存储操作权限,供内部各种按钮显示隐藏使用
        auth: getLocal('auth') || {},

    },
    getters: {
        // Getter 也可以接受其他 getter 作为第二个参数：
        //组件使用： this.$store.getters.userName 或 mapGetters(['userName])
        userName: (state, getters,rootState) => state.userInfo.username,
        userCode: state => state.userInfo.userCode,
        access: state => state.access,
        auth: state => state.auth,

        // 也可以通过让 getter 返回一个函数，来实现给 getter 传参。
        // 在对 store 里的数组进行查询时非常有用。
        getUserByKey: (state) => (key) => {
            return state.userInfo[key]
        }
    },

    //mutation 都是同步事务：
    mutations: {
        setToken(state, val) {
            state.token = val
            setToken(val)
        },
        setUserInfo(state, val) {
            state.userInfo = val
            setLocal("userInfo", val);
        },

        setAccess(state, val) {
            state.access = val
            setLocal("access", val);

        },
        setUserAuth(state, val) {
            state.auth = val;
            setLocal("auth", val);
        },

        setUserId(state, val) {
            state.userId = val
        },
        setUserCode(state, val) {
            state.userCode = val
        },
        setUserName(state, val) {
            state.userName = val
        },
        setRole(state, val) {
            state.roleCode = val
        },
        setRoleName(state, val) {
            state.roleName = val
        },

        setHasGetInfo(state, status) {
            state.hasGetInfo = status
        },

    },

    actions: {
        // 账号密码登录
        handleLogin({ state, commit, rootState }, loginInfo) {
            console.log('loginInfo', loginInfo);
            return new Promise((resolve, reject) => {
                login({
                    username: loginInfo.username.trim(),
                    password: loginInfo.password,
                    // key: userInfo.key,
                    // code: userInfo.code
                }).then(res => {
                    console.log('->', res, '<');
                    commit('setToken', res.data.token);
                    const userInfo = res.data.userInfo
                    commit('setUserInfo', userInfo);
                    commit('setUserName', userInfo.username);

                    resolve(userInfo);
                }).catch(err => {
                    reject(err)
                })
            })
        },

        // 获取用户相关信息
        getUserInfo({ state, commit, rootState }, token) {
            return new Promise((resolve, reject) => {
                getUserAuth({ token }).then(res => {
                    // // 整合权限列表
                    let auth = {}, access = []
                    //----------------------------------------
                    // 1利用菜单权限控制
                    // let menuList = res.data || [];
                    // function handleTree(list) {
                    //     list.forEach(item => {
                    //         if (item.children) {
                    //             access.push(item.code)
                    //             let cList = item.children
                    //             handleTree(cList)
                    //         } else {
                    //             let c = item.code
                    //             auth[c] = true
                    //         }
                    //     });
                    // }
                    // handleTree(menuList)
                    //----------------------------------------
                    // 2 利用角色权限控制
                    let userInfo = res.data

                    // access = ['admin', 'reviewer', 'staff']
                    let roleCode = userInfo.roleCode

                    access.push(roleCode)
                    auth[roleCode] = true
                    //----------------------------------------
                    console.log('-auth->', auth, '<-');
                    console.log('-access->', access, '<-');

                    // 设置权限
                    commit('setAccess', access);
                    commit('setUserAuth', auth);
                    commit('setHasGetInfo', true);

                    resolve(access);
                }).catch(err => {
                    reject(err)

                })
            })
        },

        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                let token = state.token;
                // 1调用退出接口
                logout().then(() => {
                    commit('setToken', '')
                    commit('setUserInfo', '');
                    commit('setAccess', [])
                    commit('setHasGetInfo', false);

                    resolve(token)
                }).catch(err => {

                    reject(err)
                })

                // 2 若退出登录无需请求接口，则可以直接清空返回
                // commit('setToken', '')
                // commit('setAccess', [])
                // commit('setHasGetInfo', false);
                // resolve(token)
            })
        },

        // ticket登录认证
        handleTicketLogin({ commit }, ticket) {
            return new Promise((resolve, reject) => {
                ticketLogin({
                    ticket: ticket
                }).then(res => {
                    const userInfo = res.data.userInfo

                    commit('setToken', res.data.token);
                    commit('setUserInfo', userInfo);
                    commit('setUserName', userInfo.username);
                    resolve(res);
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}
