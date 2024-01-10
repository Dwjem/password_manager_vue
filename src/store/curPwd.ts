import {defineStore} from 'pinia';

// 定义默认值
const defa: {
    currentPage: number,
    pageSize: number
} = {currentPage: 1, pageSize: 10}
// 密码占位符
const pwdStr:string = '●●●●●●';
export default defineStore("curPwd", {
    state: () => ({
        list: []
    }),
    actions: {
        getData(page: {
            currentPage?: number;
            pageSize?: number;
        }): [] {
            // 合并默认值
            page = Object.assign(defa, page)
            // 计算分页的起始索引和结束索引
            const startIndex = (page.currentPage - 1) * page.pageSize;
            const endIndex = startIndex + page.pageSize;

            // 获取分页后的数据
            return this.list.slice(startIndex, endIndex).map((item, index) =>({...item, pwdStr, key: index + startIndex}));
        },
        setList(data: []) {
            this.list = data;
            this.page.total = data.length
        }
    },
})