// 账号接口


// 引入封装好的工具函数 get 和 post
import req from '../utils/request'

// 登录接口 封装一个发送数据的函数  参数为对象
export function checkLogin (params){
    return req.post('/users/checkLogin',params)
}

// 添加账号接口 封装一个发送数据的函数  参数为对象
export function addAccount (params){
    return req.post('/users/add',params)
}
// 获取账号列表 封装一个发送数据的函数  参数为对象
export function getAccList (params){
    return req.get('/users/list',params)
}

// 删除账号
export function delAccList (params){
    return req.get('/users/del',params)
}

// 批量删除账号
export function delAccBatch (params){
    return req.get('/users/batchdel',params)
}
// 修改账号
export function editAdd (params){
    return req.post('/users/edit',params)
}


// 旧密码
export function changePwd (params){
    return req.get('/users/checkoldpwd',params)
}

// 修改新密码
export function changeNewPwd (params){
    return req.post('/users/editpwd',params)
}

// 获取个人信息
export function personMsg (){
    return req.get('/users/info')
}

// 修改头像
export function changePic (params){
    return req.get('/users/avataredit',params)
}

// 修改头像
export function getRole (){
    return req.get('/users/role')
}
