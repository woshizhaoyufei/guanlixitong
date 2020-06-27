import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout/Layout.vue'
import local from '../utils/local'

// 解决跳重复跳转到同一个地址的警告问题
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

Vue.use(VueRouter)
export const asyncRoutes = [
  // 登录
  {
    path: '/login',
    component: Login,
    visible: false
  },
  // 大的布局  进入后 默认显示后台首页
  {
    path: '',
    component: Layout,
    redirect: '/home',
    visible: true,
    // 留在 Layout的路由出口加载这个首页的home路由
    children: [{
      path: 'home',
      meta: {
        title: "后台首页", //和导航对应
        icon: 'icon-shouye'
      },
      component: () => import('../views/Home/Home.vue')
    }]
  },
  // 订单列表和详情
  {
    path: '/order',
    component: Layout,
    meta: {
      title: '订单管理',
      icon: 'icon-dingdan'
    },
    visible: true,

    redirect: '/order/order-list',
    children: [{
        path: 'order-list',
        meta: {
          title: '订单列表'
        },
        visible: true,

        component: () => import('../views/Order/OrderList.vue')
      },
      {
        path: 'order-details',
        name: 'order-details',
        meta: {
          title: '订单详情',

        },
        visible: false,
        component: () => import('../views/Order/OrderDetails.vue')
      }
    ]
  },
  // 商品管理
  {
    path: '/goods',
    component: Layout,

    meta: {
      title: '商品管理',
      icon: 'icon-shangpin'
    },
    redirect: '/goods/goods-list',
    visible: true,
    children: [{
        path: 'goods-add',
        meta: {
          title: '商品添加'
        },
        component: () => import('../views/Goods/GoodsAdd.vue')
      },
      {
        path: 'goods-list',
        meta: {
          title: '商品列表'
        },

        component: () => import('../views/Goods/GoodsList.vue')
      },
      {
        path: 'goods-cate',
        meta: {
          title: '商品分类'
        },

        component: () => import('../views/Goods/GoodsCate.vue')
      }
    ]
  },
  // 店铺管理
  {
    path: '/shop',
    component: Layout,
    visible: true,
    children: [{
      path: '',
      meta: {
        title: '店铺管理',
        icon: 'icon-dianpu'
      },

      component: () => import('../views/Shop/Shop.vue')
    }]
  },

  // 账户管理
  {
    path: '/account',
    component: Layout,
    meta: {
      title: '账户管理',
      icon: 'icon-yonghu',
      roles: ['super', 'normal']
    },
    redirect: '/account/account-list',
    visible: true,
    children: [{
        path: 'account-add',
        meta: {
          title: '账户添加',
          roles: ['super']
        },

        component: () => import('../views/Account/AccountAdd.vue')
      },
      {
        path: 'account-list',
        meta: {
          title: '账户列表',
          roles: ['super']
        },

        component: () => import('../views/Account/AccountList.vue')
      },
      {
        path: 'account-pwd',
        meta: {
          title: '修改密码'
        },

        component: () => import('../views/Account/AccountPwd.vue')
      },
      {
        path: 'account-msg',
        meta: {
          title: '个人中心',
        },

        component: () => import('../views/Account/AccountMsg.vue')
      }
    ]
  },
  // 销售统计
  {
    path: '/total',
    component: Layout,
    meta: {
      title: '销售统计',
      icon: 'icon-tongji',
      roles: ['super']
    },
    redirect: '/total/order-total',
    visible: true,
    children: [{
        path: 'goods-total',
        meta: {
          title: '商品统计'
        },
        component: () => import('../views/Total/GoodsTotal.vue')
      },
      {
        path: 'order-total',
        meta: {
          title: '订单统计'
        },
        component: () => import('../views/Total/OrderTotal.vue')
      },

    ]
  },
  // 404
  {
    path: '/404',
    visible: false,
    component: () => import('../views/Error404.vue')
  },
  {
    path: "*",
    visible: false,
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes: [
    // 登录
    {
      path: "/login",
      component: Login,
      visible: false,
    },
    // 后端首页
    {
      path: "",
      component: Layout,
      redirect: "/home",
      visible: true,
      children: [{
        meta: {
          icon: "icon-shouye",
          title: "后台首页"
        },
        path: "home",
        component: () => import("@/views/Home/Home.vue"),
      }, ],
    },
  ]
})
// 路由守卫保护所有路由
router.beforeEach((to, from, next) => {
  // to 去的路由 from来的路由 
  // 判断是否在登录 查看token令牌 有true 
  let isLogin = local.get('token') ? true : false

  if (to.path === '/login') {
    next() // 去登录的路径 直接放行
  } else {
    if (isLogin) {
      next()
    } else {
      next('/login')
    }
  }

})
// 1.是否有权限
//  true 代表有权限 false 没有权限
function haspermission(route, role) {
  // route 一个路由对象  role 当前角色 
  // 查看这个对象有无meta 且meta里有无roles
  // 没有roles 默认没配 有权限
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role) //如果一级配了
    // 但是不包含当前角色 就返回fasle 没有权限
    // 包含当前角色 返回true
  } else {
    return true; //没做权限
  }
}

// 2.过滤路由
// asyncRoutes 当前异步路由
// role当前角色
function filterRoutes(asyncRoutes, role) {
  // console.log(asyncRoutes,role);  9个对象
  // 过滤出有权限可以访问的路由
  let arr = asyncRoutes.filter(item => {
    //console.log(item);//一个个的路由对象
    // 判断权限
    if (haspermission(item, role)) {
      // 如果一级有权限 就看有无儿子  看儿子权限
      if (item.children && item.children.length) {
        // 递归过滤儿子  也是数组 过滤出有权限的
        item.children = filterRoutes(item.children, role)
      }
      return true
    } else {
      return false
    }

  })
  // 算出来的路由数组
  return arr
  // console.log('一级过滤：',arr);
}



// 暴露出去 登录重新走一次
export function creatRouters() {
  // 算路由

  // 调用过滤路由函数 得到可以访问的路由
  // 登录时role存本地了
  let role = local.get('role')
  let accessRoutes = filterRoutes(asyncRoutes, role)
  // 添加
  router.addRoutes(accessRoutes)

  // console.log('计算出来的有权限访问的路由：', accessRoutes);


  // 算菜单
  // 算过一次了
  let menus = accessRoutes.filter(i => {

    // 针对订单单独处理
    if (i.children && i.children[0].visible&&i.children.length ) {
      //console.log(i); //就是订单
      i.children = i.children.filter(v => v.visible)
    }


    // 先把visible=fasle的一级过滤掉
    return i.visible //=true的要
  })

  // console.log(menus);
  // 存入本地  左侧生命周期取
  local.set('menus',menus)

}
creatRouters()
export default router