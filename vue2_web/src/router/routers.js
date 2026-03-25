import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () => import('@/view/login/accountLogin.vue')  // 普通账户登录
        // component: () => import('@/view/login/SSOLogin.vue')  // SSO接入登录
    },
    {
        path: '/',
        name: 'home',
        component: Main,
        redirect: '/report',
        meta: {
            notCache: true,
            title: '协同工作',
            icon: 'md-briefcase',
            showAlways: true,
            hideInBread: true,
            access: []
        },
        children: [

            {
                path: 'report',
                name: 'report',
                meta: {
                    title: '数据总览',
                    notCache: false,
                    icon: 'ios-podium',
                    access: ['admin', 'staff', 'report']

                },
                component: () => import('@/view/report/report.vue')
            },
            {
                path: 'workPlatform',
                name: 'workPlatform',
                meta: {
                    title: '工作台',
                    notCache: true,
                    icon: 'md-home',
                    access: ['admin', 'workPlatform']
                },
                component: () => import('@/view/home/home.vue')
            },

            {
                path: 'addOrder',
                name: 'addOrder',
                meta: {
                    title: '新建工单',
                    hideInMenu: true,
                    notCache: true,
                    icon: 'ios-paper-outline',
                    access: ['admin', 'workPlatform']

                },
                component: () => import('@/view/work-order/addOrder.vue')
            },
            {
                path: 'orderSearch',
                name: 'orderSearch',
                meta: {
                    title: '工单查询',
                    notCache: true,
                    icon: 'logo-buffer',
                    access: ['admin', 'orderSearch']
                },
                component: () => import(/* webpackChunkName: "orderSearch" */ '@/view/work-order/orderSearch.vue')
            },

        ]
    },
    {
        path: '/system',
        name: 'system',
        component: Main,
        meta: {
            notCache: false,
            title: '系统配置',
            icon: 'md-settings',
            showAlways: true,
            hideInBread: true,
            access: ['admin', "system", 'userList', 'roleList']
        },
        children: [
            {
                path: 'userList',
                name: 'userList',
                meta: {
                    title: '用户管理',
                    notCache: true,
                    icon: 'md-person',
                    access: ['admin', 'userList']
                },
                component: () => import(/* webpackChunkName: "userList" */ '@/view/system/userList.vue')
            },
            {
                path: 'roleList',
                name: 'roleList',
                meta: {
                    title: '角色管理',
                    notCache: true,
                    icon: 'md-recording',
                    access: ['admin', 'roleList']
                },
                component: () => import('@/view/system/roleManagement.vue')
            },
        ]
    },
    {
        path: '/temp',
        name: 'temp',
        component: Main,
        redirect: '/template',
        meta: {
            title: '模板管理',
            notCache: true,
            icon: 'logo-buffer',
            // hideInMenu: true,
        },
        children: [
            {
                path: '/template',
                name: 'template',
                meta: {
                    title: '模板页面',
                    notCache: true,
                    access: ['admin']
                },
                component: () => import('@/view/template.vue')
            },
            {
                path: '/virtual-list',
                name: 'virtual-list',
                meta: {
                    title: '虚拟列表',
                    notCache: true,
                    access: ['admin']
                },
                component: () => import('@/view/virtual-list.vue')
            },
            {
                path: '/scroll-pagination',
                name: 'scroll-pagination',
                meta: {
                    title: '滚动分页加载',
                    notCache: true,
                    access: ['admin']
                },
                component: () => import('@/view/scroll-pagination.vue')
            },
        ]
    },
    {
        path: '/world',
        name: 'world',
        component: Main,
        redirect: '/worldMap',
        meta: {
            title: '模板管理',
            notCache: true,
            icon: 'logo-buffer',
            // hideInMenu: true,
        },
        children: [
            {
                path: '/worldMap',
                name: 'worldMap',
                meta: {
                    title: '世界地图',
                    notCache: true,
                    access: ['admin']
                },
                component: () => import('@/view/report/worldMap.vue')

            }
        ]
    },
    {
        path: '/three',
        name: 'three',
        component: Main,
        redirect: '/three3D',
        meta: {
            title: '模板管理',
            notCache: true,
            icon: 'logo-buffer',
            // hideInMenu: true,
        },
        children: [
            {
                path: '/three3D',
                name: 'three3D',
                meta: {
                    title: 'three3D',
                    notCache: true,
                    access: ['admin']
                },
                component: () => import('@/view/three3d/example.vue')

            }
        ]
    },
    {
        path: '/myIndex',
        name: 'myIndex',
        meta: {
            title: '我的主页',
            hideInMenu: false
        },
        component: () => import('@/view/myIndex/myIndex.vue')
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    }
]
