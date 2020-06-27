/* 

订单接口

*/

// 引入封装好的axios函数
import reg from '../utils/request'


export function orderList(params) {
    return reg.get('/order/list', params)
}

export function orderListCheck(params) {
    return reg.get('/order/search', params)
}

export function editOrder(params) {
    return reg.post('/order/edit', params)
}
