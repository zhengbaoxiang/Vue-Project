/*
 * @Descripttion: 系统管理接口列表
 * @version: 1.0.0
 * @Author: zbx
 * @Date: 2020-07-13 13:08:43
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 15:26:25
 */
import request from '@/libs/request'


// 用户管理相关APi
export const userApi = {
    // 1增
    add: data => {
        return request({
            url: `/nodeApi/user/add`,
            data,
            method: 'post'
        });
    },
    // 2删除
    deleteItem: (params) => {
        return request({
            url: `/nodeApi/user/delete`,
            params,
            method: 'delete',
        });
    },
    // 3改
    update: (data) => {
        return request({
            url: `/nodeApi/user/update`,
            data,
            method: 'put'
        });
    },
    // 4分页列表接口
    getUserList: data => {
        return request({
            url: `/nodeApi/user/list`,
            data,
            method: 'post'
        });
    },
    // 5查询用户详情信息、用户的菜单权限，放于user.js

    // 6模糊查询- 获取所有用户，全量、暂未用到
    matchAllUserList: params => {
        return request({
            url: `/nodeApi/user/match`,
            params,
            method: 'get'
        });
    },
    
}

// 角色相关APi
export const roleApi = {
    // 增
    addRole: data => {
        return request({
            url: `/sys/role/add`,
            data,
            method: 'post'
        });
    },
    // 删除
    deleteRole: (params) => {
        return request({
            url: `/sys/role/delete`,
            params,
            method: 'delete',
        });
    },
    // 改
    updateRole: (data) => {
        return request({
            url: `/sys/role/edit`,
            data,
            method: 'put'
        });
    },
    // 查询详情信息
    getDetail: params => {
        return request({
            url: `/sys/role/queryById`,
            params,
            method: 'get'
        });
    },
    // 分页列表接口
    getRoleList: data => {
        return request({
            url: `/sys/role/list`,
            data,
            method: 'post'
        });
    },
    // 获取所有，全量
    getAllRoleList: params => {
        return request({
            url: `/sys/role/listAll`,
            params,
            method: 'get'
        });
    },

    // 查询角色权限信息
    queryRolePermission: params => {
        return request({
            url: `/sys/role/queryRolePermission`,
            params,
            method: 'get'
        });
    },
    // 保存授予权限
    saveRolePermission: data => {
        return request({
            url: `/sys/role/saveRolePermission`,
            data,
            method: 'post'
        });
    },

}

// 菜单、模块相关APi
export const moduleApi = {
    // 增
    addModule: data => {
        return request({
            url: `/sys/permission/add`,
            data,
            method: 'post'
        });
    },
    // 删除
    deleteMod: (id) => {
        return request({
            url: `/sys/permission/delete`,
            params: {
                id: id
            },
            method: 'delete',
        });
    },
    // 改
    updateMod: () => {
        return request({
            url: `/sys/permission/edit`,
            data,
            method: 'post'
        });
    },

    // 查询详情信息
    getDetail: params => {
        return request({
            url: `/sys/permission/queryById`,
            params,
            method: 'get'
        });
    },
    // 分页列表接口
    getModList: data => {
        return request({
            url: `/sys/permission/getFirstMenuList`,
            data,
            method: 'post'
        });
    },
    // 获取所有，全量
    getAllList: params => {
        return request({
            url: `/sys/permission/list`,
            params,
            method: 'get'
        });
    },
}

// 获取模块权限树
export const getModuleTree = params => {
    return request({
        url: `/sys/permission/list?t=${new Date().getTime()}`,
        params,
        method: 'get'
    });
}






// 字典管理相关APi
export const dictApi = {
    // 1增
    add: data => {
        return request({
            url: `/sys/dict/add`,
            data,
            method: 'post'
        });
    },
    // 2删除
    deleteItem: (params) => {
        return request({
            url: `/sys/dict/delete`,
            params,
            method: 'delete',
        });
    },
    // 3改
    update: (data) => {
        return request({
            url: `/sys/dict/edit`,
            data,
            method: 'put'
        });
    },

    // 4查询详情信息
    getDetail: dictCode => {
        return request({
            url: `/sys/dict/getDictItems/${dictCode}`,
            method: 'get'
        });
    },
    // 5列表接口
    getList: data => {
        return request({
            url: `/sys/dict/list`,
            data,
            method: 'post'
        });
    },
}
// 数据字典
export const getDictItems = dictCode => {
    return request({
        url: `/sys/dict/getDictItems/${dictCode}`,
        method: 'get'
    });
}

// 字典明细相关APi
export const dictDetailApi = {
    // 1增
    add: data => {
        return request({
            url: `/sys/dictItem/add`,
            data,
            method: 'post'
        });
    },
    // 2删除
    deleteItem: (params) => {
        return request({
            url: `/sys/dictItem/delete`,
            params,
            method: 'delete',
        });
    },
    // 3改
    update: (data) => {
        return request({
            url: `/sys/dictItem/edit`,
            data,
            method: 'put'
        });
    },

}
