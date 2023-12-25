<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :rules="rules"
        autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="账号" name="username">
            <a-input v-model:value.lazy="formState.username" autofocus placeholder="用户名" />
        </a-form-item>

        <a-form-item label="密码" name="password">
            <a-input-password v-model:value="formState.password" placeholder="密码" />
        </a-form-item>

        <a-form-item label="确认密码" name="passwordCopy">
            <a-input-password v-model:value="formState.passwordCopy" placeholder="确认密码" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 14 }">
            <a-space>
                <a-button type="default" @click="emit('changeType')">返回登录</a-button>
                <a-button type="primary" html-type="submit">注册</a-button>
            </a-space>
        </a-form-item>
    </a-form>
</template>
<script setup>
import { reactive, watch, defineEmits } from 'vue';
import { message } from 'ant-design-vue';
import { addUser } from "@/utils/store"

const formState = reactive({
    username: '',
    password: '',
    passwordCopy: ''
});
const emit = defineEmits(["changeType"])

// 表单校验通过
const onFinish = values => {
    const { password, username } = values;
    addUser({ username, password }, ({msg, status}) => {
        if (status === 200) {
            console.log("注册成功");
            message.success("注册成功 立即登录")
            emit("changeType")
        } else {
            message.error(msg||"注册失败")
        }
    })
};

// 表单校验未通过
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};

// 第二次输入密码的校验
const confirmPassword = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请再次输入你的密码');
    } else if (value !== formState.password) {
        return Promise.reject("两次输入的密码不一致");
    } else {
        return Promise.resolve();
    }
};

// 表单的校验规则
const rules = {
    username: [{ required: true, message: '请输入你的用户名' }],
    password: [{ required: true, message: '请输入你的密码' }],
    passwordCopy: [{ required: true, validator: confirmPassword, trigger: 'change' }]
};

</script>