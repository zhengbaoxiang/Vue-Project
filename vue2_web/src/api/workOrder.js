/*
 * @Descripttion: 工单相关
 * @version: 1.0.0
 * @Author: zbx
 * @Date: 2020-07-13 13:08:43
 * @LastEditors: zbx
 * @LastEditTime: 2022-03-09 17:35:36
 */
import request from '@/libs/request'

/*
** 工单管理
*/
export const orderApi = {
    // 1 提交需求工单
    addRequire: data => {
        return request({
            url: `/workerOrder/addRequire`,
            data,
            method: 'post'
        });
    },
    // 2 提交配置工单
    addConfig: data => {
        return request({
            url: `/workerOrder/addConfig`,
            data,
            method: 'post'
        });
    },
    // 3 提交运维工单
    addMaintenance: data => {
        return request({
            url: `/workerOrder/addMaintenance`,
            data,
            method: 'post'
        });
    },
    // 4 配置类型选项
    listConfigType: params => {
        return request({
            url: `/workerOrder/listConfigType`,
            params,
            method: 'get'
        });
    },

    // 5 涉及系统选项
    listSystem: params => {
        return request({
            url: `/workerOrder/listSystem`,
            params,
            method: 'get'
        });
    },
    // 6 根据工单id,获取详情
    getDetail: params => {
        return request({
            url: `/workerOrder/get`,
            params,
            method: 'get'
        });
    },

    // 7 查询待处理工单列表，过滤条件，三个列表用此接口
    pending: data => {
        return request({
            url: `/workerOrder/pending`,
            data,
            method: 'post'
        });
    },
    //  查询待审批数量
    getPendingNum: () => {
        return request({
            url: `/workerOrder/getPendingNum`,
            method: 'get'
        });
    },

    // 8 查询工单列表-分页页面
    query: data => {
        return request({
            url: `/workerOrder/query`,
            data,
            method: 'post'
        });
    },

    // 9 导出工单列表-分页页面
    exportOrder: data => {
        return request({
            url: `/workerOrder/export`,
            data,
            method: 'post',
            responseType: 'blob'

        });
    },
    // 10  统计报表页面
    getReport: data => {
        return request({
            url: `/report/getReport`,
            data,
            method: 'post'
        });
    },

}

// 工作流-审批流程
export const workflow = {
    // 1 审批
    approve: data => {
        return request({
            url: `/workflow/approve`,
            data,
            method: 'post'
        });
    },
    //2 驳回
    reject: data => {
        return request({
            url: `/workflow/reject`,
            data,
            method: 'post'
        });
    },
    // 获取审批流程
    queryApprovalHistory: params => {
        return request({
            url: `/workflow/queryApprovalHistory`,
            params,
            method: 'get'
        });
    },
    
    // 获取 流程图
    queryFlowChart: params => {
        return request({
            url: `/workflow/queryFlowChart`,
            params,
            method: 'get'
        });
    },

    // 获取 流程图
    isApprover: params => {
        return request({
            url: `/workflow/isApprover`,
            params,
            method: 'get'
        });
    },

    // 提交工单
    submit: data => {
        return request({
            url: `/workflow/submit`,
            data,
            method: 'post'
        });
    },
    // 撤回工单
    recall: data => {
        return request({
            url: `/workflow/recall`,
            data,
            method: 'post'
        });
    },


}

// 备注流程
export const remarkApi = {
    // 增加
    add: data => {
        return request({
            url: `/remark/add`,
            data,
            method: 'post'
        });
    },

    //2 删
    delete: params => {
        return request({
            url: `/remark/delete`,
            params,
            method: 'get'
        });
    },
    // 3 修改
    update: data => {
        return request({
            url: `/remark/update`,
            data,
            method: 'post'
        });
    },

    // 获取备注列表
    getList: params => {
        return request({
            url: `/remark/get`,
            params,
            method: 'get'
        });
    },


}

// 工时相关APi
export const workHourApi = {
    // 增
    addData: data => {
        return request({
            url: `/workinghours/add`,
            data,
            method: 'post'
        });
    },
    // 删除
    deleteItem: (params) => {
        return request({
            url: `/workinghours/delete`,
            params,
            method: 'delete',
        });
    },
    // 改
    updateItem: (data) => {
        return request({
            url: `/workinghours/edit`,
            data,
            method: 'post'
        });
    },
    // 获取所有，全量
    getAllList: params => {
        return request({
            url: `/workinghours/queryAll`,
            params,
            method: 'get'
        });
    },
    
    // 查询-查询当前用户参与流程环节
    queryWorkflowType: params => {
        return request({
            url: `/workinghours/queryWorkflowType`,
            params,
            method: 'get'
        });
    },
}





