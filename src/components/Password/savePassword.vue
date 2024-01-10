<template>
  <a-modal v-model:open="open" title="保存密码" @ok="save">
    <a-form :model="formState" :rules="rules" :label-col="{style: {width: '100px'}}" :wrapper-col="{span: 16}"
            ref="savePasswordForm"
            style="margin-top: 20px">
      <a-form-item v-for="(dic, key) in dictionaries" :key="key" :name="key" :label="dic.label">
        <a-input-password v-if="dic.type==='password'" v-model:value.trim.lazy="formState[key]"
                          :placeholder="'这里填 '+dic.label"/>
        <a-textarea v-else-if="dic.type==='textarea'" v-model:value.trim.lazy="formState[key]"
                    :placeholder="'这里填 '+dic.label"/>
        <a-select v-else-if="dic.type==='select'" v-model:value.trim.lazy="formState[key]"
                  :options="attrList"
                  :placeholder="'这里填 '+dic.label"/>
        <a-input v-else v-model:value.trim.lazy="formState[key]" :placeholder="'这里填 '+dic.label"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="open = false" :icon="h(CloseSquareOutlined)">取消</a-button>
      <a-button @click="reset()" :icon="h(ClearOutlined)">重置</a-button>
      <a-button type="primary" @click="save" :icon="h(SaveOutlined)">保存</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts">
import {ref, h, reactive, getCurrentInstance, toRaw, UnwrapRef} from "vue";
import {CloseSquareOutlined, SaveOutlined, ClearOutlined} from "@ant-design/icons-vue";
import {Rule} from "ant-design-vue/es/form";

import {passwordType, psdForm} from "@/types/password";
import {menuListType} from "@/types/menuListType";
import {addPwd} from "@/utils/password"

export default {
  name: "savePassword",
  props: {
    menuList: {
      type: Array as () => Proxy<menuListType[]>
    }
  },
  setup(props) {
    const {proxy: {$convertToPinyin}} = getCurrentInstance()
    const open = ref(false);
    const savePasswordForm = ref()
    // 表单列表
    const dictionaries: psdForm = {
      website_name: {
        label: '网站名称',
        type: 'text'
      },
      menu: {
        label: '所属菜单',
        type: 'select'
      },
      website_url: {
        label: '网站地址',
        type: 'text'
      },
      account: {
        label: '账号',
        type: 'text'
      },
      pwd: {
        label: '密码',
        type: 'password'
      },

      remarks: {
        label: '备注',
        type: 'textarea'
      },
    }
    const {menuList}: { menuList: menuListType[] } = toRaw(props) ?? []
    // 所属菜单列表
    const attrList = menuList.map((menu: menuListType) => {
      return {
        value: menu.id,
        label: menu.name
      }
    })

    const formState: UnwrapRef<passwordType> = reactive({
      website_name: '',
      website_url: '',
      account: '',
      pwd: '',
      menu: attrList[0].value,
      remarks: '',
    });

    const rules = (() => {
      let rules: Record<string, Rule[]> = {}
      for (let key in dictionaries) {
        if (key === 'remarks' || key === 'website_name') continue;
        rules[key] = [{required: true, message: '请输入 ' + dictionaries[key].label}]
      }
      return rules
    })()

    // 打开弹窗
    const showModal = (pwd: string) => {
      open.value = true;
      pwd && (formState.pwd = pwd);
    };

    // 弹窗的保存密码按钮
    const save = () => {
      savePasswordForm.value.validate().then(() => {
        // console.log('保存密码')
        // 获取当前菜单的拼音，用来当做数据库表名
        const storeName = $convertToPinyin(menuList.find((menu: menuListType) => menu.id === formState.menu)?.name)
        addPwd(storeName, toRaw(formState))
      })
    }

    // 重置
    const reset = () => {
      for (const key in formState) {
        if (key === 'menu') {
          formState[key] = attrList[0].value;
          continue
        }
        formState[key] = '';
      }
    }
    return {
      h,
      open,
      CloseSquareOutlined,
      SaveOutlined,
      ClearOutlined,
      formState,
      reset,
      save,
      attrList,
      rules,
      dictionaries,
      showModal,
      savePasswordForm
    }
  }
}
</script>
<style scoped lang="scss">

</style>