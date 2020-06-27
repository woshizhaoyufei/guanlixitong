/* 

商品接口

*/


// 引入封装好的axios函数
import reg from '../utils/request'

// 获取分类
export  function getGoodsCatelist(params){
    return reg.get('/goods/catelist',params)
}

// 修改分类
export  function editCate(params){
    return reg.post('/goods/editcate',params)
}

// 刪除分类

export  function delCate(params){
    return reg.get('/goods/delcate',params)
}

// 添加分类

export  function addCate(params){
    return reg.post('/goods/addcate',params)
}


// 获取所有商品名称的
export  function getCateNameList(params){
    return reg.get('/goods/categories',params)
}

// 添加商品
export  function addGoods(params){
    return reg.post('/goods/add',params)
}

// 获取商品列表
export  function getGoodsList(params){
    return reg.get('/goods/list',params)
}


// 删除商品
export  function delGoods(params){
    return reg.get('/goods/del',params)
}

// 修改商品
export  function changeGoods(params){
    return reg.post('/goods/edit',params)
}