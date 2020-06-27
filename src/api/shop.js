import reg from "../utils/request"

export function shopList(){
    return reg.get('/shop/info')
}

export function shopEdit(params){
    return reg.post('/shop/edit',params)
}