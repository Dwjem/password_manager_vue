<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入你的用户名' }]">
            <a-auto-complete v-model:value="formState.username" :options="account_list" placeholder="请输入你的账号"
                             :filter-option="filterOption" @select="handlerSelectAccount" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入你的密码' }]">
            <a-input-password v-model:value="formState.password" ref="passwordIpt" placeholder="请输入你的密码" />
        </a-form-item>

<!--        <a-form-item name="remember" :wrapper-col="{ offset: 4, span: 16 }">-->
<!--            <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>-->
<!--        </a-form-item>-->

        <a-form-item :wrapper-col="{ offset: 10, span: 2 }">
            <a-space direction="vertical">
                <a-button type="primary" html-type="submit">登录</a-button>
                <a-button type="default" @click="emit('changeType')">注册</a-button>
            </a-space>
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, createVNode, Ref } from "vue";
import { FileTextOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { useRouter } from "vue-router";

import { getStore, byKeypath_existStore } from "@utils/store";
import { userInfoType } from "@types/user";
import { setUserInfoByStorage } from "@utils/store";
import useUserInfoStore from "@/store/userInfo";

const emit = defineEmits(["changeType"]);

const router = useRouter();
const userInfoStore = useUserInfoStore();
// 注册账号弹窗
const registerPopup = () => {
    Modal.confirm({
        title: "账号未注册，是否注册？",
        icon: createVNode(FileTextOutlined),
        okText: "立即注册",
        okType: "primary",
        cancelText: "不用了",
        onOk() {
            console.log(emit);
            emit("changeType");
        },
        onCancel() {
            console.log("Cancel");
        }
    });
};

const formState = reactive({
    username: "",
    password: "",
    remember: true
});
// 密码框的ref
const passwordIpt: Ref<HTMLInputElement | null> = ref(null);

// 账号的密码
const password = ref("");

// 提交
const onFinish = values => {
    const { password, username, remember } = values;
    // 验证
    // 账户表中是否存在这个账户
    function handlerHasUser(hasUser: boolean | userInfoType) {
        // 如果存在, 验证密码是否正确
        if (hasUser) {
            const { password: correctPassword } = hasUser;
            if (password === correctPassword) {
                console.log("密码正确");
                // 存储用户信息
                userInfoStore.$patch((state: any) => {
                    state.username = username;
                    state.password = password;
                    state.isLogin = true;
                });
                setUserInfoByStorage({
                    username, password,
                    isLogin: true
                });

                router.push("/");
                // TODO remember 功能, 下一次打开登录页, 自动填充账号, 不填充密码

            } else {
                message.error("密码错误");
                passwordIpt.value.focus();
            }
        }
        // 如果不存在, 弹出是否注册
        else {
            console.log("不存在");
            registerPopup();
        }
    }

    byKeypath_existStore("user_list", "username", username, handlerHasUser);
};

const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
};

// 账号框再选择后
const handlerSelectAccount = (value, { password }) => {
    // 密码框获焦
    passwordIpt.value.focus();
};
// 账号忽略大小写
const filterOption = (input, option) => {
    return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};

const account_list = ref([]);

// set account list
const setAccountList = (list) => {
    account_list.value = list.map((item) => {
        return {
            value: item.username,
            password: item.password
        };
    });
};

onMounted(() => {
    getStore("user_list").then((list) => {
        list && setAccountList(list);
    });
});


</script>