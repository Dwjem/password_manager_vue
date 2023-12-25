<template>
  <div>
    <!-- <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button> -->
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
          :style="{height: showConfig?'80px':'0'}"
      >
        <a-form-item :label="getDesc('length')">
          <a-input-number id="inputNumber" v-model:value="config.length" :min="1" :placeholder="getDesc('length')"/>
        </a-form-item>
        <a-form-item v-for="option in Object.keys(config).filter((option) => option !== 'length')"
                     :label="getDesc(option)">
          <a-switch v-if="option!='length'" v-model:checked="config[option]"/>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="back" @click="handleCancel" :icon="h(CloseSquareOutlined)">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk" :icon="h(CopyOutlined)">复制
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {ref, h, reactive} from 'vue';
import {
  SyncOutlined,
  SettingOutlined,
  CopyOutlined,
  CloseSquareOutlined
} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";
import {generatePassword, pwdConfig, getDesc} from "@/utils/generatePassword";
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

const showModal = () => {
  open.value = true;
  password.value = generatePassword(config)
};

// 复制操作
const handleOk = () => {
  loading.value = true;
  window.navigator.clipboard.writeText(password.value)
      .then(() => {
        loading.value = false;
        open.value = false;
        message.success('复制成功')
      })
      .catch((error: any) => {
        message.error('复制失败')
        console.error(`Error copying text: ${error}`);
      });
};

const handleCancel = () => {
  open.value = false;
};

// 配置选项展示与否
const openConfig = throttle(() => {
  showConfig.value = !showConfig.value;
}, 500)

// 刷新密码(重新生成一个)
const refresh = throttle(() => {
  console.log(config)
  password.value = generatePassword(config)
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
