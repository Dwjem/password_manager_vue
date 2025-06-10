<template>
    <a-modal v-model:open="open" title="生成密码" @ok="handleOk">
      <a-input-group compact>
        <a-input v-model:value="password" style="width: calc(100% - 100px)"/>
        <a-tooltip placement="top" title="配置项">
          <a-button type="primary" :icon="h(SettingOutlined)" @click="openConfig"></a-button>
        </a-tooltip>
        <a-tooltip placement="right" title="换一个">
          <a-button type="primary" :icon="h(SyncOutlined)" @click="refresh"></a-button>
        </a-tooltip>
      </a-input-group>
      <a-form
          layout="inline"
          :model="config"
          style="margin-top: 20px;overflow: hidden;transition: all .5s ease;"
          :style="{height: showConfig?'140px':'0'}"
      >
        <a-form-item :label="configDic['length']['desc']">
          <a-input-number id="inputNumber" v-model:value="config.length" :min="1" :placeholder="configDic.length.desc"/>
        </a-form-item>
        <a-form-item v-for="option in Object.keys(config).filter((option) => option !== 'length')"
                     :label="configDic[option].desc">
          <a-switch v-if="option!='length'" v-model:checked="config[option]"/>
        </a-form-item>
        <a-textarea v-model:value="pasChartSetList"
                    addon-before="字符集" style="resize: none"/>
      </a-form>

      <template #footer>
        <a-button type="dashed" @click="savePassword()" :icon="h(SaveOutlined)">
          保存
        </a-button>
        <a-button @click="handleCancel" :icon="h(CloseSquareOutlined)">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="handleOk" :icon="h(CopyOutlined)">复制
        </a-button>
      </template>
    </a-modal>
</template>
<script lang="ts" setup>
import {ref, h, reactive, watch } from 'vue';
import {
  SyncOutlined,
  SettingOutlined,
  CopyOutlined,
  CloseSquareOutlined,
  SaveOutlined
} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";
import {generatePassword, pwdConfig, configDic} from "@/utils/generatePassword";
import {throttle} from "lodash-es";


const loading = ref<boolean>(false);
const open = ref<boolean>(false);
const password = ref<string>("");
const config = reactive<pwdConfig>({
  length: 10,
  includeUppercase: false,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false
});
const showConfig = ref<boolean>(false);
// 字符集
const pasChartSetList = ref("");

const emit = defineEmits(["openSave"]);

//
watch(config, (n, o) => {
  //遍历一个对象
  pasChartSetList.value = ""
  for (let key in n) {
    if (n[key]) {
      pasChartSetList.value += configDic[key].str
    }
  }
}, {immediate: true})

const showModal = () => {
  open.value = true;
  password.value = generatePassword({length: config.length, chars: pasChartSetList.value})
};

// 复制操作
const handleOk = () => {
  loading.value = true;
  console.log(password.value);
  window.navigator.clipboard.writeText(password.value)
      .then(() => {
        loading.value = false;
        message.success('复制成功')
      })
      .catch((error: any) => {
        message.error('复制失败')
        console.error(`Error copying text: ${error}`);
      });
};

// 保存这个密码
const savePassword = () => {
  open.value = false;
  console.log("密码是：", password.value)
  emit("openSave",password.value)
}

const handleCancel = () => {
  open.value = false;
};

// 配置选项展示与否
const openConfig = throttle(() => {
  showConfig.value = !showConfig.value;
}, 500)

// 刷新密码(重新生成一个)
const refresh = throttle(() => {
  password.value = generatePassword({length: config.length, chars: pasChartSetList.value})
}, 200)

// 导出方法供其他组件使用
defineExpose({
  showModal
});
</script>

<style lang="scss" scoped>
.fades-enter-active,
.fades-leave-active,
.fades-enter,
.fades-leave-to {
  transition: all 0.5s ease;
}

// 进入动画
@keyframes fadeInDown {
  0% {
    opacity: 0;
    height: 0;
  }

  to {
    opacity: 1;
    height: auto;
  }
}

// 离开动画
@keyframes fadeOutUp {
  0% {
    opacity: 1;
    height: auto;
  }

  to {
    opacity: 0;
    height: 0;
  }
}


</style>
