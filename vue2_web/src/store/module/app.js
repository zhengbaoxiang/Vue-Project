
import router from '@/router'
import routers from '@/router/routers'
import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    getNextRoute,
    routeHasExist,
    routeEqual,
    getRouteTitleHandled,
    setLocal,
    getLocal,
    getMenuByRoutes
} from '@/libs/util'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route)

    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route)
    })
    router.push(nextRoute)
}

export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: {},
        local: getLocal('local'),
        errorList: [],
        hasReadErrorPage: false,
        menuList: []
    },
    getters: {
        menuList: (state, getters, rootState) => {
            // return getMenuByRouter(routers, rootState.user.access)
            return state.menuList
        },
        errorCount: state => state.errorList.length
    },
    mutations: {
        updateDoneCount(state, count) {
            for (let i = 0; i < state.menuList.length; i++) {
                if (state.menuList[i].name == 'project1') {
                    for (let j = 0; j < state.menuList[i].children.length; j++) {
                        if (state.menuList[i].children[j].name == 'processPending') {
                            state.menuList[i].children[j].meta.title = '待处理流程(' + count + ')';
                            break;
                        }
                        break;
                    }
                }
            }
        },
        setMenuList(state, menuList) {
            state.menuList = menuList;
        },
        setBreadCrumb(state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },
        setHomeRoute(state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName)
        },
        setTagNavList(state, list) {
            let tagList = []
            if (list) {
                tagList = [...list]
            } else tagList = getTagNavListFromLocalstorage() || []

            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()

            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            state.tagNavList = tagList
            setTagNavListInLocalstorage([...tagList])
        },
        closeTag(state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route))
            route = tag[0] ? tag[0] : null
            if (!route) return
            closePage(state, route)
        },
        addTag(state, { route, type = 'unshift' }) {
            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === homeName) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        setLocal(state, lang) {
            setLocal('local', lang)
            state.local = lang
        },
        addError(state, error) {
            state.errorList.push(error)
        },
        setHasReadErrorLoggerStatus(state, status = true) {
            state.hasReadErrorPage = status
        }
    },
    actions: {
        addErrorLog({ commit, rootState }, info) {
            if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
            const { user: { token, userId, userName } } = rootState
            let data = {
                ...info,
                time: Date.parse(new Date()),
                token,
                userId,
                userName
            }
            //   saveErrorLogger(info).then(() => {
            //     commit('addError', data)
            //   })
        },
        addMenuList({ commit, rootState }) {
            let menuList = getMenuByRouter(routers, rootState.user.access);
            commit('setMenuList', menuList);
        },
        // updateMenuCount({commit, rootState}) {
        //   getDoneCount({}).then(res => {
        //     commit('updateDoneCount', res.data || 0);
        //   });
        // }
        generateMenuList({ commit, rootState }) {
            let menuList = getMenuByRoutes(routers, rootState.user.access);
            console.log('-menuList>', menuList)
            commit('setMenuList', menuList);
        },
    }
}
