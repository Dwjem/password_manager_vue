import {defineStore} from 'pinia';

interface Page {
    currentPage: number,
    pageSize?: number
};

// 定义默认值
const defaultPage: Page = {currentPage: 1, pageSize: 10}

export default defineStore("curPwd", {
    state: () => ({
        list: []
    }),
    actions: {
        getData(page?: Page): any[] {
            // 合并默认值
            page = Object.assign(defaultPage, page)
            // 计算分页的起始索引和结束索引
            const startIndex = (page.currentPage - 1) * (page.pageSize as number);
            const endIndex = startIndex + (page.pageSize as number);

            console.log(79879,this.list.slice(startIndex, endIndex));
            
            // 获取分页后的数据
            return this.list.slice(startIndex, endIndex)
            .map((item, index) =>({...item, show: false, key: index + startIndex}));
        },
        setList(data: []) {
            this.list = data;
            this.page.total = data.length
        }
    },
})