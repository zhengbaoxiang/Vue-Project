/*
 * @Date: 2022-04-06 10:08:02
 * @LastEditors: zbx
 * @LastEditTime: 2022-04-27 14:44:32
 * @FilePath: \后台系统通用\src\mock\system\user.js
 */
export const getUserList = params => {
    return {
        "success": true,
        "message": "操作成功！",
        "code": 200,
        "data": {
            "total": 2,
            "pageSize": 10,
            "totalPage": 1,
            "currPage": 1,
            "list": [
                {

                    "id": "1496047110350426114",
                    "userId": "zbx",
                    "username": "zheng",
                    "roleCode": "admin",
                    "roleName": "管理员",
                    "status": 1
                },
                {
                    "id": "1496305359138000897",
                    "userId": "youke",
                    "username": "游客",
                    "roleCode": "user",
                    "roleName": "普通用户",
                    "status": 1
                },
            ]
        },
    }
}

export const delUser = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}

export const addUser = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}

export const editUser = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}

export const resetPass = params => {
    return {
        code: "000",
        msg: "success",
        data: true
    }
}