<template>
  <div class="main" v-if="menuID">
    <a-button @click="goBack()" shape="circle" :icon="h(ArrowLeftOutlined)" title="返回" style="margin-bottom: 10px;"/>
    <a-table :columns="columns" :data-source="dataSource" @resizeColumn="handleResizeColumn" :scroll="{ y: 275 }"
             bordered>
      <template #title>
        <p class="title">密码管理 : {{ menuName }}</p>
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
              <span v-if="column.dataIndex == 'pwd'">
                <span class="showPwdSpan" v-if="record.show">{{ text }}</span>
                <span class="showPwdSpan" v-else>{{ pwdStr }}</span>
                <span class="iconClick">
                  <EyeTwoTone @click="record.show = true" v-show="!record.show"/>
                  <EyeInvisibleTwoTone @click="record.show = false" v-show="record.show" />
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
                  @confirm="onDelete(record.id)"
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
import {getCurrentInstance, h, onMounted, onUnmounted, reactive, ref,toRaw } from 'vue';
import {cloneDeep} from 'lodash-es';
import type {TableColumnsType} from 'ant-design-vue';
import {message} from "ant-design-vue";
import {ArrowLeftOutlined, CopyTwoTone, EyeInvisibleTwoTone, EyeTwoTone} from '@ant-design/icons-vue';
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
// 密码占位符
const pwdStr: string = '●●●●●●';

// 汉字转拼音（不带音调）
const {proxy: {$convertToPinyin}} = getCurrentInstance();
// 路由参数  使用Number转化id是因为从路由中获取的id是字符串类型
const {id: menuID, name: menuName}: { id: number, name: string } = menuListStore.findMenu(Number(params.id)) ?? {};


onMounted(() => {
  getDate()
})


// 数据库容器
const passwordDB = new IndexDB(PASSWORD_DB_NAME, $convertToPinyin(menuName))

const getDate = async () => {
  console.log(menuID, menuName, $convertToPinyin(menuName))
  // log
  try {
    curPwdStore.list = await passwordDB.getAllRecords()
    data.value = curPwdStore.getData()
  } catch (e: any) {
    message.error("获取记录失败：" + e.message)
  }
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
const data: Ref<UnwrapRef<any[]>> = ref([]);

const dataSource = ref(data);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.find(item => key === item.key));
};

const save = (key: string) => {
  const newData = Object.assign(dataSource.value.find(item => key === item.key), editableData[key]);
  console.log(toRaw(newData))
  const saveData = toRaw(newData)
  console.log(saveData.id)
  passwordDB.updateRecord(saveData.id,saveData)
  delete editableData[key];
};

const cancel = (key: string) => {
  delete editableData[key];
};

const onDelete = (id: string) => {
  dataSource.value = dataSource.value.filter(item => item.id !== id);
  passwordDB.deleteRecord(id)
};

function handleResizeColumn(w: number, col: object) {
  col.width = w;
}

// 复制密码
const copyPwd = (value: string) => {
  window.navigator.clipboard.writeText(value)
      .then(() => {
        message.success('复制成功')
      })
      .catch((error: any) => {
        message.error('复制失败')
        console.error(`Error copying text: ${error}`);
      });
}

// 返回上一页
const goBack = () => {
  window.history.go(-1)
}

//
const clickOutside=()=>{
  console.log("outSide")
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

  .ant-table-row {
    &:hover .iconClick {
      display: inline-block;
    }

    .iconClick {
      margin-left: 8px;
      display: none;

      span {
        font-size: 16px;
        margin-right: 12px;
        cursor: pointer;
      }
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
