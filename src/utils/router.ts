import router from "@/router";

// 获取路由参数
const getPageParams = (route: any) => {
    let params = route.query;
    console.log(params)
    if (params?.pms) {
        params = JSON.parse(decodeURI(params.pms))
    }
    return params
}


// goPage 参数类型
export interface goPageParams {
    path: string
    params?: object | string
}

/**
 * 跳转页面
 * @param goPageParams 方法参数
 * @param goPageParams.path 跳转地址
 * @param goPageParams.params 传递参数(没有可以不传)
 */
const goPage = (goPageParams: goPageParams) => {
    let {path, params} = goPageParams

    if (params) {
        params = encodeURI(JSON.stringify(params));
    }
    router.push({
        path,
        query: {
            pms: params
        }
    })
}

/**
 * 简单的传参可以使用这个
 * */
const goPage_new = (goPageParams: goPageParams) => {
    let {path, params} = goPageParams
    router.push({
        path,
        query: {
            ...params
        }
    })
}


export {
    getPageParams,
    goPage,
    goPage_new
}
