import { defineComponent, ref, reactive, } from 'vue';
import { storeToRefs } from "pinia"

import createPasswordModal from "@comp/Password/creatPassword.vue";
import savePasswordModal from "@comp/Password/savePassword.vue";
import useMenuListStore from '@/store/menuList';
import { getStore, setStore } from '@/utils/store';
import config from '@/config';
import { OptionList } from '@/types/menuListType';

import { goPage, goPage_new } from '@/utils/router';
import "@/styles/index/index.scss"

export default defineComponent({
    name: "index",
    components: { createPasswordModal, savePasswordModal },
    setup() {
        const createPasswordModalRef = ref<null | { showModal: () => void }>(null);
        const savePasswordModalRef = ref<null | { showModal: () => void }>(null);
        const menuListStore = useMenuListStore();
        // 展示区列表
        const {menuList: menus} = storeToRefs(menuListStore);

        // 获取菜单列表
        getStore('menuList').then(
            menus => {
                // 将菜单保存到pinia中，便于后续使用
                menuListStore.$patch({
                    menuList: menus
                })
            },
            () => {
                // 如果本地没有存，就存一份默认的(原因是后续可能会在前台添加/删除菜单列表)
                // 将菜单保存到pinia中，便于后续使用
                menuListStore.$patch({
                    menuList: config.menuList
                })
                setStore("menuList", config.menuList)
            }
        )

        // 操作区列表
        const optionList: OptionList[] = reactive([
            { name: "导出我的密码", id: 1, icon: "#icon-daochu" },
            { name: "导入我的密码", id: 2, icon: "#icon-daoru" },
            { name: "生成一个密码", id: 3, icon: "#icon-verify" },
            { name: "记录一条密码", id: 4, icon: "#icon-jilu" },
        ])

        // 操作栏
        const operation = (id: number) => {
            console.log("生成密码", id);
            if (id === 3) {
                openCreatePasswordModal()
            }
        }

        // 打开生成密码的弹窗
        const openCreatePasswordModal = () => {
            createPasswordModalRef.value && createPasswordModalRef.value.showModal()
        }

        // 打开保存密码的弹窗
        const openSavePasswordModal = () => {
            savePasswordModalRef.value && savePasswordModalRef.value.showModal()
        }

        return () => (
            <>
                {/* 展示区 */}
                <a-space size={30} wrap align="center" class="list">
                    {
                        menus.value
                            .sort((a,b)=> a.order - b.order)
                            .map((item, index) => {
                                return (<>
                                    <div class="list_item" onClick={() => {
                                        /* 命名的路由，并加上参数，让路由建立 url */
                                        goPage({ path: "/password", params: { id: item.id }})
                                    }}>
                                        <div class="left">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlinkHref={item.icon}></use>
                                            </svg>
                                            <span>{item.name}</span>
                                        </div>
                                        <div class="right">
                                            {item.num}
                                        </div>
                                    </div>
                                </>)
                            })
                    }
                </a-space>
                {/* 操作区 */}
                <a-row gutter={30}>
                    {
                        optionList.map((item, index) => {
                            return (<>
                                <a-col span={6}>
                                    <div class="operation-button" onClick={() => { operation(item.id) }}>
                                        <svg class="icon" aria-hidden="true">
                                            <use xlinkHref={item.icon}></use>
                                        </svg>
                                        <span>{item.name}</span>
                                    </div>
                                </a-col>
                            </>)
                        })
                    }
                </a-row>
                <createPasswordModal ref={createPasswordModalRef} />
                <savePasswordModal ref={savePasswordModalRef} />
            </>
        )
    }
})
