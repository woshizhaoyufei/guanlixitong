// 统计接口


// 引入封装好的工具函数 get 和 post
import reg from '../utils/request'

// 首页报表接口接口 封装一个发送数据的函数  参数为对象
export function homeTotal (params){
    return reg.get('/order/totaldata',params)
}


export function totalOrder(params) {
    return reg.get('/order/ordertotal', params)
}