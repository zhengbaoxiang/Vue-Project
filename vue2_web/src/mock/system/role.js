/*
 * @Date: 2022-04-06 10:08:02
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 15:45:57
 * @FilePath: \后台系统通用\src\mock\system\role.js
 */
export const getRoleList = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": {
            "total": 2,
            "pageSize": 10,
            "totalPage": 1,
            "currPage": 1,
            "data": [
          
                {
                    "id": 1,
                    "roleCode": "admin",
                    "roleName": "管理员",
                    "description": "管理员",
                    "updateTime": "2018-12-21 18:03:39",
                },
                {
                    "id": 2,
                    "roleCode": "staff",
                    "roleName": "员工",
                    "description": "部分权限",
                    "updateTime": "2022-02-19 13:37:22",
                }
            ]
        },
        "timestamp": 1649229885273
    }
}
export const addRole = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}
export const updateRole = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}

export const delRole = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}

export const getAllRoleList = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "id": 1,
                "roleCode": "admin",
                "roleName": "管理员",
                "description": "管理员",
                "updateTime": "2018-12-21 18:03:39",
            },
            {
                "id": 2,
                "roleCode": "staff",
                "roleName": "员工",
                "description": "部分权限",
                "updateTime": "2022-02-19 13:37:22",
            }
        ],
        "timestamp": 1649229917622
    }
}


export const getModuleTree = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            {
                "sortNo": 0.0,
                "code": "home",
                "children": [
                    {
                        "sortNo": 0.0,
                        "code": "workPlatform",
                        "children": [
                            {
                                "sortNo": 0.0,
                                "code": "workPlatform_view",
                                "children": null,
                                "name": "查看",
                                "description": "",
                                "perms": "workPlatform:view",
                                "menuType": 2,
                                "pkPermission": "1493824906892165121",
                                "leaf": true,
                                "parentId": "1493824690818400257"
                            },
                            {
                                "sortNo": 0.0,
                                "code": "workPlatform_addRequire",
                                "children": null,
                                "name": "新增需求工单",
                                "description": "",
                                "perms": "workPlatform:addRequire",
                                "menuType": 2,
                                "pkPermission": "1493824965281071105",
                                "leaf": true,
                                "parentId": "1493824690818400257"
                            },
                            {
                                "sortNo": 0.0,
                                "code": "workPlatform_review",
                                "children": null,
                                "name": "审核",
                                "description": "",
                                "perms": "workPlatform:review",
                                "menuType": 2,
                                "pkPermission": "1493825009359011841",
                                "leaf": true,
                                "parentId": "1493824690818400257"
                            },
                            {
                                "sortNo": 2.0,
                                "code": "workPlatform_addConfig",
                                "children": null,
                                "name": "新增配置工单",
                                "description": null,
                                "perms": "workPlatform:addConfig",
                                "menuType": 2,
                                "pkPermission": "1495955154236616707",
                                "leaf": true,
                                "parentId": "1493824690818400257"
                            },
                            {
                                "sortNo": 3.0,
                                "code": "workPlatform_addMaintenance",
                                "children": null,
                                "name": "新增运维工单",
                                "description": null,
                                "perms": "workPlatform:addMaintenance",
                                "menuType": 2,
                                "pkPermission": "1495955154236616708",
                                "leaf": true,
                                "parentId": "1493824690818400257"
                            }
                        ],
                        "name": "首页",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1493824690818400257",
                        "leaf": false,
                        "parentId": "1493822970348531714"
                    },
                    {
                        "sortNo": 0.0,
                        "code": "orderSearch",
                        "children": [
                            {
                                "sortNo": null,
                                "code": "orderSearch_viewAll",
                                "children": null,
                                "name": "查看全部数据",
                                "description": null,
                                "perms": "orderSearch:review_all",
                                "menuType": 2,
                                "pkPermission": "1493827268339843075",
                                "leaf": true,
                                "parentId": "1493825213231546369"
                            },
                            {
                                "sortNo": 0.0,
                                "code": "orderSearch_view",
                                "children": null,
                                "name": "查看和自己有关的",
                                "description": "",
                                "perms": "orderSearch:view",
                                "menuType": 2,
                                "pkPermission": "1493825453523222530",
                                "leaf": true,
                                "parentId": "1493825213231546369"
                            },
                            {
                                "sortNo": 1.0,
                                "code": "orderSearch_export",
                                "children": null,
                                "name": "导出",
                                "description": "",
                                "perms": "orderSearch:export",
                                "menuType": 2,
                                "pkPermission": "1493825535563808769",
                                "leaf": true,
                                "parentId": "1493825213231546369"
                            },
                            {
                                "sortNo": 2.0,
                                "code": "orderSearch_review",
                                "children": null,
                                "name": "审核",
                                "description": "",
                                "perms": "orderSearch:review",
                                "menuType": 2,
                                "pkPermission": "1493825596226027522",
                                "leaf": true,
                                "parentId": "1493825213231546369"
                            }
                        ],
                        "name": "工单查询",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1493825213231546369",
                        "leaf": false,
                        "parentId": "1493822970348531714"
                    },
                    {
                        "sortNo": 3.0,
                        "code": "report",
                        "children": [
                            {
                                "sortNo": 0.0,
                                "code": "report_view",
                                "children": null,
                                "name": "查看",
                                "description": "",
                                "perms": "report:view",
                                "menuType": 2,
                                "pkPermission": "1493826045645701121",
                                "leaf": true,
                                "parentId": "1493825921079066625"
                            }
                        ],
                        "name": "统计报表",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1493825921079066625",
                        "leaf": false,
                        "parentId": "1493822970348531714"
                    }
                ],
                "name": "协同工作",
                "description": "",
                "perms": "",
                "menuType": 0,
                "pkPermission": "1493822970348531714",
                "leaf": false,
                "parentId": null
            },
            {
                "sortNo": 0.0,
                "code": "system",
                "children": [
                    {
                        "sortNo": 0.0,
                        "code": "userList",
                        "children": [
                            {
                                "sortNo": 0.0,
                                "code": "userList_view",
                                "children": null,
                                "name": "查看",
                                "description": "",
                                "perms": "userList:view",
                                "menuType": 2,
                                "pkPermission": "1493826873068634113",
                                "leaf": true,
                                "parentId": "1493826507463737346"
                            },
                            {
                                "sortNo": 1.0,
                                "code": "userList_edit",
                                "children": null,
                                "name": "编辑",
                                "description": "",
                                "perms": "userList:edit",
                                "menuType": 2,
                                "pkPermission": "1493826935228219394",
                                "leaf": true,
                                "parentId": "1493826507463737346"
                            },
                            {
                                "sortNo": 3.0,
                                "code": "userList_del",
                                "children": null,
                                "name": "删除",
                                "description": "",
                                "perms": "userList:del",
                                "menuType": 2,
                                "pkPermission": "1501722307736956930",
                                "leaf": true,
                                "parentId": "1493826507463737346"
                            }
                        ],
                        "name": "用户管理",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1493826507463737346",
                        "leaf": false,
                        "parentId": "1493826337204355073"
                    },
                    {
                        "sortNo": 1.0,
                        "code": "roleList",
                        "children": [
                            {
                                "sortNo": 0.0,
                                "code": "roleList_view",
                                "children": null,
                                "name": "查看",
                                "description": "",
                                "perms": "roleList:view",
                                "menuType": 2,
                                "pkPermission": "1493827214111686657",
                                "leaf": true,
                                "parentId": "1493827088425172993"
                            },
                            {
                                "sortNo": 1.0,
                                "code": "roleList_edit",
                                "children": null,
                                "name": "编辑",
                                "description": "",
                                "perms": "roleList:edit",
                                "menuType": 2,
                                "pkPermission": "1493827268339843074",
                                "leaf": true,
                                "parentId": "1493827088425172993"
                            },
                            {
                                "sortNo": 3.0,
                                "code": "roleList_del",
                                "children": null,
                                "name": "删除",
                                "description": "",
                                "perms": "roleList:del",
                                "menuType": 2,
                                "pkPermission": "1501722421872357377",
                                "leaf": true,
                                "parentId": "1493827088425172993"
                            }
                        ],
                        "name": "角色管理",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1493827088425172993",
                        "leaf": false,
                        "parentId": "1493826337204355073"
                    },
                    {
                        "sortNo": 3.0,
                        "code": "dictionary",
                        "children": [
                            {
                                "sortNo": 0.0,
                                "code": "dictionary_view",
                                "children": null,
                                "name": "查看",
                                "description": "",
                                "perms": "dictionary:view",
                                "menuType": 2,
                                "pkPermission": "1495955068140138498",
                                "leaf": true,
                                "parentId": "1495954830461513729"
                            },
                            {
                                "sortNo": 1.0,
                                "code": "dictionary_edit",
                                "children": null,
                                "name": "编辑",
                                "description": "",
                                "perms": "dictionary:edit",
                                "menuType": 2,
                                "pkPermission": "1495955154236616706",
                                "leaf": true,
                                "parentId": "1495954830461513729"
                            },
                            {
                                "sortNo": 3.0,
                                "code": "dictionary_del",
                                "children": null,
                                "name": "删除",
                                "description": "",
                                "perms": "dictionary:del",
                                "menuType": 2,
                                "pkPermission": "1501722550226448386",
                                "leaf": true,
                                "parentId": "1495954830461513729"
                            }
                        ],
                        "name": "数据字典",
                        "description": "",
                        "perms": "",
                        "menuType": 1,
                        "pkPermission": "1495954830461513729",
                        "leaf": false,
                        "parentId": "1493826337204355073"
                    }
                ],
                "name": "系统配置",
                "description": "",
                "perms": "",
                "menuType": 0,
                "pkPermission": "1493826337204355073",
                "leaf": false,
                "parentId": null
            }
        ],
        "timestamp": 1649229728318
    }
}

export const queryRolePermission = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": [
            "1493822970348531714",
            "1493824690818400257",
            "1493824906892165121",
            "1493824965281071105",
            "1493825009359011841",
            "1493825213231546369",
            "1493825453523222530",
            "1493825535563808769",
            "1493825596226027522",
            "1493825921079066625",
            "1493826045645701121",
            "1493826337204355073",
            "1493826507463737346",
            "1493826873068634113",
            "1493826935228219394",
            "1493827088425172993",
            "1493827214111686657",
            "1493827268339843074",
            "1493827268339843075",
            "1495954830461513729",
            "1495955068140138498",
            "1495955154236616706",
            "1495955154236616707",
            "1495955154236616708",
            "1501722307736956930",
            "1501722421872357377",
            "1501722550226448386"
        ],
        "timestamp": 1649229728319
    }
}


export const saveRolePermission = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}
