<script setup lang="ts">
import {watch} from 'vue'
import {storeToRefs} from 'pinia';
import {useRouter, useRoute} from 'vue-router';

import {MenuOutlined, LogoutOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';

import useUserInfoStore from './store/userInfo';
import useMenuList from './store/menuList';

import {getUserInfoByStorage, delUserInfoByStorage} from './utils/store';

import config from '@/config';
import {menuListType} from '@/types/menuListType';

const router = useRouter();
const route = useRoute();

// pinia
const userInfoStore = useUserInfoStore();
const {isLogin} = storeToRefs(userInfoStore);
const menuListStore = useMenuList();
const {showLoginOutBtn} = storeToRefs(menuListStore)


// 配置菜单
// 获取本地菜单列表
menuListStore.menuDB.getAllRecords().then((data: []) => {
  console.log("App.vue: 获取本地菜单列表", "\n",data)
  // 本地如果没有存的则设置为配置文件中默认的
  if (data.length <= 0) {
    menuListStore.setMenu(config.menuList)
    // 保存菜单列表到本地
    config.menuList.forEach((item: menuListType) => {
      menuListStore.menuDB.addRecord(item)
    })
  }
  // 如果有就使用本地的
  else {
    menuListStore.setMenu(data)
  }
})

// 获取当前登录的用户信息sessionStorage
const userInfo = getUserInfoByStorage()
if (userInfo.username) {
  userInfoStore.$patch({
    ...userInfo
  })
}


watch(isLogin, () => {
  // 判断是否登录
  if (!isLogin.value) {
    // message.warn('未登录');
    router.push('/login')
    return
  }
}, {immediate: true})

// 退出登录
function logout() {
  userInfoStore.$patch({
    isLogin: false
  })
  delUserInfoByStorage("userInfo");
  message.success('成功退出');
}

// 退出登录弹窗ok的点击事件
const confirm = (e: MouseEvent) => {
  logout()
};


</script>

<template>
  <container>
    <router-view></router-view>
  </container>
  <a-float-button-group v-if="showLoginOutBtn" title="菜单" trigger="click" type="default" :style="{ right: '24px' }">
    <template #icon>
      <MenuOutlined/>
    </template>

    <!--    <a-float-button />-->


    <a-popconfirm
        title="确定要退出登录嘛？"
        placement="topLeft"
        ok-text="确定"
        cancel-text="取消"
        @confirm="confirm"
    >
      <a-tooltip placement="left" title="退出登录">
        <a-float-button title="">
          <template #icon>
            <LogoutOutlined/>
          </template>
          <a href="#"></a>
        </a-float-button>
      </a-tooltip>
    </a-popconfirm>


  </a-float-button-group>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
