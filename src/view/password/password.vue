<template>
  <div class="main">
    <a-table :columns="columns" :data-source="dataSource" @resizeColumn="handleResizeColumn" :scroll="{ y: 275 }"
             bordered>
      <template #title>
        <p class="title">{{menuName}}密码管理</p>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="['website', 'account', 'pwd','remarks'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">保存</a-typography-link>&emsp;
              <a-popconfirm ok-text="确定" cancel-text="关闭" title="确定退出吗?" @confirm="cancel(record.key)">
                <a>退出</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a>&emsp;
              <a-popconfirm
                  v-if="dataSource.length"
                  title="Sure to delete?"
                  @confirm="onDelete(record.key)"
              >
                <a>删除</a>
              </a-popconfirm>
          </span>
          </div>
        </template>
      </template>
<!--      <template #footer>-->
<!--        <strong>备注：</strong>-->
<!--        工作中所遇到的密码-->
<!--      </template>-->
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue';
import {cloneDeep} from 'lodash-es';
import type {UnwrapRef} from 'vue';
import type {TableColumnsType} from 'ant-design-vue';
import {useRoute} from 'vue-router';
import useMenuListStore from '@/store/menuList';
import {getPageParams} from '@/utils/router';

const route = useRoute();
const params = getPageParams(route);
const menuListStore = useMenuListStore();
const {id: menuID, name: menuName} = menuListStore.findMenu(params.id);
console.log(menuID, menuName)

const columns = ref<TableColumnsType>([
  {
    title: '网站',
    dataIndex: 'website',
    width: 200,
    resizable: true,
    align: 'center'
  },
  {
    title: '账号',
    dataIndex: 'account',
    width: 200,
    resizable: true,
    align: 'center'
  },
  {
    title: '密码',
    dataIndex: 'pwd',
    width: 200,
    resizable: true,
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    resizable: true,
    width: 300,
    align: 'center',
    ellipsis: true
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'operation',
    align: 'center'
  },
]);

interface DataItem {
  key: string;
  website: string;
  account: string;
  pwd: string;
  remarks: string;
}

const data: DataItem[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    website: `Edrward ${i}`,
    account: "string",
    pwd: `London Park no. ${i}`,
    remarks: `London Park no. ${i}`,
  });
}

const dataSource = ref(data);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = (key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];
};
const cancel = (key: string) => {
  delete editableData[key];
};
const onDelete = (key: string) => {
  dataSource.value = dataSource.value.filter(item => item.key !== key);
};

function handleResizeColumn(w, col) {
  col.width = w;
}

</script>

<style lang="scss" scoped>
.main {
  background: #fafafa;
  border-radius: 25px;
  padding: 20px;
  box-sizing: border-box;
  .title{
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 0;
  }
  [data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }

  [data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background-color: rgb(29, 29, 29);
  }
}


</style>
