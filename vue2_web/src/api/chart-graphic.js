
import request from '@/libs/request'

// ?v=${new Date().getTime()}

export const overviewApi = {
    // dashboard 网络请求和业务请求统计数据
    dashboard: data => {
        return request({
            url: `/statistic/dashboard `,
            data,
            method: 'post'
        });
    },
    // 趋势统计信息
    trendDashboard: data => {
        return request({
            url: `/statistic/trend/dashboard`,
            data,
            method: 'post'
        });
    },

    // -最慢top5ISP
    carrierTop5: data => {
        return request({
            url: `/statistic/carrierTop5 `,
            data,
            method: 'post'
        });
    },
    // 网络错误最多top5
    netErrTop5: data => {
        return request({
            url: `/statistic/netErrTop5 `,
            data,
            method: 'post'
        });
    },
    // 获取域名列表，统计数据
    domain: data => {
        return request({
            url: `/statistic/domain`,
            data,
            method: 'post'
        })
    },
    // 业务错误最多top5
    logicErrTop5: data => {
        return request({
            url: `/statistic/logicErrTop5 `,
            data,
            method: 'post'
        });
    },
    // 子业务错误统计
    subNodeStatistic: data => {
        return request({
            url: `/statistic/subNodeStatistic `,
            data,
            method: 'post'
        });
    },
    // 叶子节点业务错误统计
    leafNodeStatistic: data => {
        return request({
            url: `/statistic/leafNodeStatistic `,
            data,
            method: 'post'
        });
    }
}

export const rtAlsApi = {
    // 获取域名列表，下拉框展示
    domainList: data => {
        return request({
            url: `/statistic/domainlist`,
            data,
            method: 'post'
        })
    },
    // 获取某应用全国各省份统计信息-map
    provinceInfo: data => {
        return request({
            url: `/statistic/region`,
            data,
            method: 'post'
        });
    },

    // 获取某应用各地市统计信息
    cityInfo: data => {
        return request({
            url: `/statistic/city`,
            data,
            method: 'post'
        });
    },
    // 获取城市运营商
    carrierCity: data => {
        return request({
            url: `/statistic/carrier/city`,
            data,
            method: 'post'
        });
    },
    // 获取地区运营商
    carrierProvince: data => {
        return request({
            url: `/statistic/carrier/province`,
            data,
            method: 'post'
        });
    },
    // 获取各运营商统计信息
    carrier: data => {
        return request({
            url: `/statistic/carrier/country`,
            data,
            method: 'post'
        });
    },
    // 获取指定地区人员的平均耗时和错误数量的散点图
    getUserErr: data => {
        return request({
            url: `/statistic/user`,
            data,
            method: 'post'
        });
    },
     // 趋势统计信息
     trend: data => {
        return request({
            url: `/statistic/trend/all`,
            data,
            method: 'post'
        });
    },
     // 运营商趋势统计信息
     trendCarrier: data => {
        return request({
            url: `/statistic/trend/carrier`,
            data,
            method: 'post'
        });
    },
     // 地区趋势统计信息
     trendProvince: data => {
        return request({
            url: `/statistic/trend/province`,
            data,
            method: 'post'
        });
    },
     // 地区运营商趋势统计信息
     trendProvinceCarrier: data => {
        return request({
            url: `/statistic/trend/provinceCarrier`,
            data,
            method: 'post'
        });
    },

    // 获取错误原因统计信息
    getErrList: data => {
        return request({
            url: `/statistic/reason`,
            data,
            method: 'post'
        });
    },

    // 获取应用版本分类统计信息？
    category: data => {
        return request({
            url: `/statistic/category`,
            data,
            method: 'post'
        });
    },
    // 获取应用版本查询请求耗时统计数据？
    reqexp: data => {
        return request({
            url: `/statistic/reqexp`,
            data,
            method: 'post'
        });
    },
    // 获取应用版本响应耗时统计数据？
    resexp: data => {
        return request({
            url: `/statistic/resexp`,
            data,
            method: 'post'
        });
    },
    // 获取应用版本不同服务端类型的统计数据?
    svrtp: data => {
        return request({
            url: `/statistic/svrtp`,
            data,
            method: 'post'
        });
    }

}
