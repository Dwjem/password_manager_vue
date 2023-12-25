<script setup lang="ts">
import {ref, watch} from 'vue'
import {storeToRefs} from 'pinia';
import {useRouter, useRoute} from 'vue-router';

import useUserInfoStore from './store/userInfo';

import {getUserInfoByStorage, delUserInfoByStorage} from './utils/store';
import {MenuOutlined, LogoutOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
const router = useRouter();
const route = useRoute();

// pinia
const userInfoStore = useUserInfoStore();
const {isLogin} = storeToRefs(userInfoStore);


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
    console.log("未登录app.vue");
    router.push('/login')
    return
  } else {
    // router.push('/')
  }
}, {immediate: true})

// 监听路由，当路由为登录页时隐藏右下角的菜单按钮
const showMenuBtns = ref<boolean>(false)
watch(
    () => route.path,
    (newPath) => {
      // 在这里执行路由变化时的逻辑
      if (newPath == "/login") {
        showMenuBtns.value = false
      } else {
        showMenuBtns.value = true
      }
    }, {immediate: true}
);

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
  <a-float-button-group v-if="showMenuBtns" title="菜单" trigger="click" type="default" :style="{ right: '24px' }">
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
