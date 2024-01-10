<template>
  <div class="main" v-if="menuID">
    <a-table :columns="columns" :data-source="dataSource" @resizeColumn="handleResizeColumn" :scroll="{ y: 275 }"
             bordered>
      <template #title>
        <p class="title">密码管理 : {{ menuName }}</p>
      </template>
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="['website', 'account', 'pwdStr','remarks'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              <span v-if="column.dataIndex == 'pwdStr'">
                <span class="showPwdSpan">{{ text }}</span>
                <span class="iconClick">
                  <EyeTwoTone @click="controlPwd(0, index)"/>
                  <EyeInvisibleTwoTone @click="controlPwd(1, index)"/>
                  <CopyTwoTone @click="copyPwd(text)"/></span>
              </span>

              <span v-else>
                  {{ text }}
              </span>

            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">保存</a-typography-link>　
              <a-popconfirm ok-text="确定" cancel-text="关闭" title="确定退出吗?" @confirm="cancel(record.key)">
                <a>退出</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a>　
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
  <Empty v-else-if="!menuID" emptyDescription="没有找到此菜单"></Empty>
</template>

<script lang="ts" setup>
import type {UnwrapRef} from 'vue';
import {getCurrentInstance, onMounted, onUnmounted, reactive, ref} from 'vue';
import {cloneDeep} from 'lodash-es';
import type {TableColumnsType} from 'ant-design-vue';
import {CopyTwoTone, EyeTwoTone, EyeInvisibleTwoTone} from '@ant-design/icons-vue';
import {useRoute} from 'vue-router';

import Empty from "@/components/empty/empty.vue";

import useMenuListStore from '@/store/menuList';
import useCurPwdStore from '@/store/curPwd';

import {getPageParams} from '@/utils/router';

import IndexDB from "@/utils/indexDB";
import {PASSWORD_DB_NAME} from "@/config";

interface DataItem {
  key: string;
  website: string;
  account: string;
  pwd: string;
  remarks: string;
  pwdStr: string;
}

const route = useRoute();
const params = getPageParams(route);
const menuListStore = useMenuListStore();
const curPwdStore = useCurPwdStore();


// 汉字转拼音（不带音调）
const {proxy: {$convertToPinyin}} = getCurrentInstance();
// 路由参数  使用Number转化id是因为从路由中获取的id是字符串类型
const {id: menuID, name: menuName}: { id: number, name: string } = menuListStore.findMenu(Number(params.id)) ?? {};


onMounted( () =>{
  getDate()
})


// 数据库容器
const passwordDB = new IndexDB(PASSWORD_DB_NAME, $convertToPinyin(menuName))

const getDate = async () => {
  console.log(menuID, menuName, $convertToPinyin(menuName))
  // log
  const list = await passwordDB.getAllRecords()

  curPwdStore.list = list
  data.value = curPwdStore.getData()
  console.log(data.value)
  // for (let i = 0; i < 100; i++) {
  //   data.value.push({
  //     key: i.toString(),
  //     website: `Edrward ${i}`,
  //     account: "string",
  //     pwd: `London Park no. ${i}`,
  //     remarks: `London Park no. ${i}`,
  //   });
  // }
}


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
    dataIndex: 'pwdStr',
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
const data: Ref<UnwrapRef<any[]>> = ref([]);

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

function handleResizeColumn(w: number, col: object) {
  col.width = w;
}

const copyPwd = (e) => {
  console.log(e)
}

// 控制密码显示隐藏
const controlPwd = (show: number, index: number) => {
  const span = document.getElementsByClassName("showPwdSpan")[index]
  console.log(span)
  span.innerText = 123
  if (show) {

  }
}

onUnmounted(() => {
  // 关闭数据库连接controlPwd
  passwordDB.close();
})

</script>

<style lang="scss" scoped>
.main {
  background: #fafafa;
  border-radius: 25px;
  padding: 20px;
  box-sizing: border-box;

  .title {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 0;
  }

  .iconClick {
    margin-left: 5px;

    span {
      font-size: 16px;
      margin-right: 5px;
      cursor: pointer;
    }
  }

  [data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
  }

  [data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background-color: rgb(29, 29, 29);
  }
}


</style>
