import {defineStore} from 'pinia';
import {menuListType} from '@/types/menuListType';
import IndexDB from '@/utils/indexDB';

const useMenuListConfig = defineStore('menuList', {
    state() {
        return {
            menuList: [] as menuListType[],
            showLoginOutBtn: true,
            menuDB : new IndexDB("menuList", "menuList")
        }
    },
    actions: {
        setShowLoginOutBtn(flg: boolean) {
            this.showLoginOutBtn = flg
        },
        findMenu(id: number): menuListType {
            return this.menuList.find(item => item.id === id)
        },
        setMenu(menuList: menuListType[]) {
            this.menuList = menuList
            this.menuDB.setRecords(menuList)
        },
        addMenu(menu: object) {
            let menu_: menuListType = {
                ...menu,
                id: this.menuList.length,
                order: this.menuList.length,
                num: 0
            }
            this.menuList.push(menu_)
            this.menuDB.addRecord(menu_)
        },
        // 删除菜单
        delMenu(ids: number | number[]) {
            // 单个删除
            if (typeof id === 'number') {
                this.menuList = this.menuList.filter(item => item.id !== id)
                this.menuDB.deleteRecord(ids)
            }
            // 批量删除
            else if(typeof id === 'object'){
                this.menuList = this.menuList.filter(item => !id.includes(item.id))
                this.menuDB.deleteRecords(ids)
            }
        },
    }
})
export default useMenuListConfig