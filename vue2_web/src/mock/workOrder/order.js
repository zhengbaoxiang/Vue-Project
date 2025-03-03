/*
 * @Date: 2022-04-06 10:08:02
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-08 16:28:43
 * @FilePath: \management\src\mock\workOrder\order.js
 */
export const pending = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": {
            "total": 2,
            "pageSize": 5,
            "totalPage": 0,
            "currPage": 1,
            "data": [
                {
                    "pkWorkOrder": "1511592454551224321",
                    "workOrderType": "配置工单",
                    "sender": "200861-孙权",
                    "currentNode": "上级审批",
                    "workOrderTitle": "EBS系统新增用户",
                    "currentProcessor": "123456-王涛",
                    "workOrderNo": "S220406000",
                    "sendTime": "2022-04-06"
                },
            ]
        },
        "timestamp": 1649231756415
    }
}

export const orderQuery = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": {
            "total": 63,
            "pageSize": 10,
            "totalPage": 7,
            "currPage": 1,
            "data": [
                {
                    "pkWorkOrder": "1511592454551224321",
                    "workOrderType": "配置工单",
                    "sender": "200861-孙权",
                    "currentNode": "上级审批",
                    "workOrderTitle": "EBS系统新增用户",
                    "currentProcessor": "150645-王涛",
                    "workOrderNo": "S220406000",
                    "sendTime": "2022-04-06"
                },
                {
                    "pkWorkOrder": "1511547900267577345",
                    "workOrderType": "需求工单",
                    "sender": "200861-孙权",
                    "currentNode": "需求受理",
                    "workOrderTitle": "会计引擎新增渠道管理和交叉验证功能",
                    "currentProcessor": "200861-孙权",
                    "workOrderNo": "R220406000",
                    "sendTime": "2022-04-06"
                },
                {
                    "pkWorkOrder": "1506175600999514114",
                    "workOrderType": "运维工单",
                    "sender": "210754-赵四",
                    "currentNode": "技术处理",
                    "workOrderTitle": "20220322系统缺陷工单",
                    "currentProcessor": "160071-庞永春",
                    "workOrderNo": "O220322000",
                    "sendTime": "2022-03-22"
                },
                {
                    "pkWorkOrder": "1506175134978785281",
                    "workOrderType": "配置工单",
                    "sender": "210754-赵四",
                    "currentNode": "上级审批",
                    "workOrderTitle": "20220322参数配置工单",
                    "currentProcessor": "170056-测试-张三",
                    "workOrderNo": "S220322000",
                    "sendTime": "2022-03-22"
                },
                {
                    "pkWorkOrder": "1506174886176866306",
                    "workOrderType": "需求工单",
                    "sender": "210754-赵四",
                    "currentNode": "上级审批",
                    "workOrderTitle": "20220322需求测试工单",
                    "currentProcessor": "170056-测试-张三",
                    "workOrderNo": "R220322000",
                    "sendTime": "2022-03-22"
                },
                {
                    "pkWorkOrder": "1504380799442468865",
                    "workOrderType": "需求工单",
                    "sender": "210869-何舒桐",
                    "currentNode": "上级审批",
                    "workOrderTitle": "3",
                    "currentProcessor": "150645-王涛",
                    "workOrderNo": "R220317001",
                    "sendTime": "2022-03-17"
                },
                {
                    "pkWorkOrder": "1504380658065063938",
                    "workOrderType": "需求工单",
                    "sender": "210869-何舒桐",
                    "currentNode": "上级审批",
                    "workOrderTitle": "12678",
                    "currentProcessor": "150645-王涛",
                    "workOrderNo": "R220317000",
                    "sendTime": "2022-03-17"
                },
                {
                    "pkWorkOrder": "1501823275421908993",
                    "workOrderType": "配置工单",
                    "sender": "210754-赵四",
                    "currentNode": "上级审批",
                    "workOrderTitle": "这是一个用于测试的参数配置工单",
                    "currentProcessor": "170056-测试-张三",
                    "workOrderNo": "S220310002",
                    "sendTime": "2022-03-10"
                },
                {
                    "pkWorkOrder": "1501483838900953089",
                    "workOrderType": "运维工单",
                    "sender": "200861-孙权",
                    "currentNode": "",
                    "workOrderTitle": "新费控系统参数变更",
                    "currentProcessor": null,
                    "workOrderNo": "O220309003",
                    "sendTime": "2022-03-09"
                },
                {
                    "pkWorkOrder": "1501481204043374593",
                    "workOrderType": "运维工单",
                    "sender": "200861-孙权",
                    "currentNode": "技术处理",
                    "workOrderTitle": "新费控系统单据变更",
                    "currentProcessor": "160071-庞永春",
                    "workOrderNo": "O220309002",
                    "sendTime": "2022-03-09"
                }
            ]
        },
        "timestamp": 1649231831533
    }
}

export const getDetail = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": {
            "workOrderType": 1,
            "targetSystemName": "总账系统",
            "workflowStatus": -1,
            "currentNode": "上级审批",
            "workDescription": "需求背景 （请描述此需求的具体背景信息，方便相关需求承接方更全面的理解需求）\n\n历史分时数据量较大, 目前明文存储, 大规模重启的时候, 启动较慢\n\n详细内容 （请详细的阐述此需求的完整内容、或者附件方式上传详细需求文档）\n\n历史分时数据旧字段不变, 新字段进行压缩存储.  新旧版本的wqs, 读不同字段\n\n周边依赖&影响产品 （如果需求对周边部门或者系统有依赖，或者需求可能会影响到一些具体的产品，可以在此一并描述）\n\n网站行情/期货RN小程序\n\n其它补充 （如果有其它需要特别指出的，可以在此一并说明）\n\n ",
            "configType": null,
            "planDate": "2022-02-22",
            "targetSystem": 0,
            "requirementType": 1,
            "pkWorkOrder": "1496296478546530306",
            "senderId": "1496047325388197889",
            "originalSponsor": null,
            "costTime": "4.1",
            "requirementTypeName": "现有系统优化",
            "workOrderTitle": "【web】当前任务的名称",
            "currentProcessor": "170056-测试-张三",
            "files": [
                {
                    "fileName": "20190107174042_88243.jpg",
                    "fileId": "1496292876973182977"
                },
                {
                    "fileName": "期货网站行情业务.docx",
                    "fileId": "1496293449432764418"
                },
                {
                    "fileName": "B - 审批流及功能点 (1).xlsx",
                    "fileId": "1496293628475019266"
                },
                {
                    "fileName": "红包测试.txt",
                    "fileId": "1496294763248160769"
                },
            ],
            "workOrderTypeName": "需求工单",
            "workOrderNo": "R220223000",
            "configTypeName": null
        },
        "timestamp": 1649404641506
    }
}

export const queryFlowChart = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "linkStatus": 2,
                "approvalLinkNo": 0,
                "approvalLinkName": "提交",
                "approvalTime": "2022-02-22",
                "approverName": "测试-崔永元"
            },
            {
                "linkStatus": 2,
                "approvalLinkNo": 1,
                "approvalLinkName": "上级审批",
                "approvalTime": "2022-02-22",
                "approverName": "测试-张三"
            },
            {
                "linkStatus": 1,
                "approvalLinkNo": 2,
                "approvalLinkName": "需求受理",
                "approvalTime": null,
                "approverName": "测试-薛仁贵"
            },
            {
                "linkStatus": 0,
                "approvalLinkNo": 3,
                "approvalLinkName": "需求评审",
                "approvalTime": null,
                "approverName": "测试-崔永元,测试-张三,测试-薛仁贵"
            },
            {
                "linkStatus": 0,
                "approvalLinkNo": 4,
                "approvalLinkName": "研发测试",
                "approvalTime": null,
                "approverName": "测试-薛仁贵"
            },
            {
                "linkStatus": 0,
                "approvalLinkNo": 5,
                "approvalLinkName": "验收测试",
                "approvalTime": null,
                "approverName": "测试-崔永元,测试-张三"
            }
        ],
        "timestamp": 1649405113208
    }
}

export const queryApprovalHistory = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "linkStatus": 2,
                "approvalLinkNo": 0,
                "approvalLinkName": "提交",
                "approvalResult": "同意",
                "approverId": "1496047325388197889",
                "pkWorkflowApproval": "1496056280604725250",
                "approvalTime": "2022-02-22 17:36:27",
                "operationType": 0,
                "approvalComments": null,
                "planDate": null,
                "approverName": "测试-崔永元"
            },
            {
                "linkStatus": 2,
                "approvalLinkNo": 1,
                "approvalLinkName": "上级审批",
                "approvalResult": "同意",
                "approverId": "1496047110350426114",
                "pkWorkflowApproval": "1496056280613113857",
                "approvalTime": "2022-02-22 18:09:18",
                "operationType": 1,
                "approvalComments": "同意\n同意\n抓紧时间做吧",
                "planDate": null,
                "approverName": "测试-张三"
            },
            {
                "linkStatus": 1,
                "approvalLinkNo": 2,
                "approvalLinkName": "需求受理",
                "approvalResult": null,
                "approverId": "1496048255684825089",
                "pkWorkflowApproval": "1496056280621502466",
                "approvalTime": null,
                "operationType": 1,
                "approvalComments": null,
                "planDate": null,
                "approverName": "测试-薛仁贵"
            }
        ],
        "timestamp": 1649405113210
    }
}

export const getRemarkList = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "userInfo": "170235-测试-崔永元",
                "pkWorkOrder": null,
                "createBy": "1496047325388197889",
                "pkRemark": "1496296708142731265",
                "createTime": "2022-02-23 09:31:50",
                "receiverName": null,
                "replyId": null,
                "rootRemarkId": null,
                "content": "计划20220228投产\n抓紧审批吧",
                "child": [
                    {
                        "userInfo": "170235-测试-崔永元",
                        "pkWorkOrder": null,
                        "createBy": "1496047325388197889",
                        "pkRemark": "1496296761829822466",
                        "createTime": "2022-02-23 01:32:03",
                        "receiverName": null,
                        "replyId": "1496296708142731265",
                        "rootRemarkId": "1496296708142731265",
                        "content": "嘿嘿"
                    },
                    {
                        "userInfo": "170056-测试-张三",
                        "pkWorkOrder": null,
                        "createBy": "1496047110350426114",
                        "pkRemark": "1496297347174305793",
                        "createTime": "2022-02-23 01:34:22",
                        "receiverName": "170235-测试-崔永元",
                        "replyId": "1496296761829822466",
                        "rootRemarkId": "1496296708142731265",
                        "content": "你嘿嘿个啥"
                    }
                ]
            },
            {
                "userInfo": "170056-测试-张三",
                "pkWorkOrder": null,
                "createBy": "1496047110350426114",
                "pkRemark": "1496297280740724738",
                "createTime": "2022-02-23 09:34:06",
                "receiverName": null,
                "replyId": null,
                "rootRemarkId": null,
                "content": "抓紧审批吧\n要投产了",
                "child": null
            }
        ],
        "timestamp": 1649404641508
    }
}
export const getHoursList = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "duration": 0.07,
                "pkWorkinghours": "1496311904051597313",
                "approvalLinkName": "需求受理",
                "registerId": "1496048255684825089",
                "remark": '回家啊收到',
                "workOrderId": "1496310489270915073",
                "registerName": "测试-薛仁贵",
                "belongDate": "2022-02-23",
                "workflowApprovalId": "1496310489358995458"
            },
            {
                "duration": 2.00,
                "pkWorkinghours": "1496310663594577921",
                "approvalLinkName": "提交",
                "registerId": "1496047325388197889",
                "remark": null,
                "workOrderId": "1496310489270915073",
                "registerName": "测试-崔永元",
                "belongDate": "2022-02-23",
                "workflowApprovalId": "1496310489350606850"
            },
            {
                "duration": 2.00,
                "pkWorkinghours": "1496310806309965825",
                "approvalLinkName": "上级审批",
                "registerId": "1496047110350426114",
                "remark": '随便写的',
                "workOrderId": "1496310489270915073",
                "registerName": "测试-张三",
                "belongDate": "2022-02-23",
                "workflowApprovalId": "1496310489354801154"
            }
        ],
        "timestamp": 1649405515688
    }
}

