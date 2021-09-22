// 对menus进行映射
import type { RouteRecordRaw } from 'vue-router'

export function mapMenusToRoutes(useMenus: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  // 1.先去加载默认所有的routes
  const allRoutes: RouteRecordRaw[] = []
  // 加载某个文件夹， true表示递归的查找， 匹配.ts结尾的文件
  const routeFiles = require.context('../router/main', true, /\.ts/)
  // 拿到../router/main所有.ts文件路径
  routeFiles.keys().forEach((key) => {
    const route = require('../router/main' + key.split('.')[1])
    // 拿到所有路由
    allRoutes.push(route.default)
  })
  // console.log(allRoutes)

  // 2.再根据useMenus获取需要添加的routes
  // userMenus: 不能直接从userMenus中获取，需要进行判断type值
  // type === 1 -> children
  // type === 2 -> url -> route
  // 递归获取route
  const _recurseGetRoute = (menus: any[]) => {
    for (const menu of menus) {
      // type等于2才是需要的
      if (menu.type === 2) {
        // find函数，会遍历所有route对象，只会找到一个
        const route = allRoutes.find((route) => route.path === menu.url)
        if (route) routes.push(route)
      } else {
        _recurseGetRoute(menu.children)
      }
    }
  }

  _recurseGetRoute(useMenus)

  return routes
}