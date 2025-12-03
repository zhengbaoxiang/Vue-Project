/*
 * @Date: 2022-04-07 11:16:03
 * @LastEditors: zbx
 * @LastEditTime: 2025-12-03 19:03:57
 * @FilePath: \management\src\mock\index.js
 */
import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getUserList, addUser, editUser, delUser, resetPass } from './system/user'

import {
    getRoleList, addRole, updateRole, delRole, getAllRoleList,
    getModuleTree, queryRolePermission, saveRolePermission
} from './system/role'

import {
    pending, orderQuery, getDetail,
    queryFlowChart, queryApprovalHistory,
    getRemarkList, getHoursList,
} from './workOrder/order'

import {
    dashboard, subNodeStatistic, leafNodeStatistic, trendDashboard,
    trendAll, domain, logicErrTop5, netErrTop5,
    user, region
} from './chartGraphic'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
    timeout: 300
})

// 登录相关和获取用户信息
Mock.mock(/\/sys\/login/, login)
Mock.mock(/\/sys\/getUserAuth/, 'get', getUserInfo)
Mock.mock(/\/logout/, logout)

// Mock.mock(/\/sys\/user\/list/, 'post', getUserList)
// Mock.mock(/\/sys\/user\/add/, 'post', addUser)
// Mock.mock(/\/sys\/user\/delete/, 'delete', delUser)
// Mock.mock(/\/sys\/user\/update/, 'put', editUser)

Mock.mock(/\/sys\/role\/listAll/, 'get', getAllRoleList)

Mock.mock(/\/sys\/role\/list/, 'post', getRoleList)
Mock.mock(/\/sys\/role\/add/, 'post', addRole)
Mock.mock(/\/sys\/role\/delete/, 'delete', updateRole)
Mock.mock(/\/sys\/role\/edit/, 'put', delRole)

Mock.mock(/\/sys\/role\/queryRolePermission/, 'get', queryRolePermission)
Mock.mock(/\/sys\/role\/saveRolePermission/, 'post', saveRolePermission)
Mock.mock(/\/sys\/permission\/list/, 'get', getModuleTree)

// 工单
Mock.mock(/\/workerOrder\/pending/, 'post', pending)
Mock.mock(/\/workerOrder\/query/, 'post', orderQuery)
Mock.mock(/\/workerOrder\/get/, 'get', getDetail)
Mock.mock(/\/workflow\/queryFlowChart/, 'get', queryFlowChart)
Mock.mock(/\/workflow\/queryApprovalHistory/, 'get', queryApprovalHistory)
Mock.mock(/\/remark\/get/, 'get', getRemarkList)
Mock.mock(/\/workinghours\/queryAll/, 'get', getHoursList)



// 图表
Mock.mock(/\/statistic\/dashboard/, 'post', dashboard)
Mock.mock(/\/statistic\/subNodeStatistic/, 'post', subNodeStatistic)
Mock.mock(/\/statistic\/leafNodeStatistic/, 'post', leafNodeStatistic)
Mock.mock(/\/statistic\/trend\/dashboard/, 'post', trendDashboard)
Mock.mock(/\/statistic\/trend\/all/, 'post', trendAll)

Mock.mock(/\/statistic\/domain/, 'post', domain)
Mock.mock(/\/statistic\/logicErrTop5/, 'post', logicErrTop5)
Mock.mock(/\/statistic\/netErrTop5/, 'post', netErrTop5)

Mock.mock(/\/statistic\/user/, 'post', user)
Mock.mock(/\/statistic\/region/, 'post', region)

export default Mock
