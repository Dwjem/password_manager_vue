import { defineStore } from 'pinia';
import { menuListType } from '@/types/menuListType';
import {getStoreSync} from "@/utils/store";

export default defineStore('menuList', {
    state() {
        return {
            menuList: [
                ...getStoreSync("menuList")
            ] as menuListType[]
        }
    },
    actions: {
        findMenu(id: number):menuListType {
            return this.menuList.find(item => item.id === id)
        }
    }
})
