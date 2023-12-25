import { defineStore } from 'pinia';
export default defineStore("userInfo", {
    state: () => ({
        username: "",
        password: "",
        isLogin: false
    }),
    getters: {},
    actions: {},
})
