<template>
  <a-empty>
    <template #description>
      <span style="color: #dce0e6">{{ emptyDescription }}</span>
    </template>
    <a-button type="primary" @click="onBack">返回</a-button>
  </a-empty>
</template>
<script lang="ts">
export default {
  name: 'Empty',
  props: {
    emptyDescription: {
      type: String,
      default: '暂无数据',
    },
  },
  setup() {
    // 返回上一页
    const onBack = () => {
      window.history.go(-1)
    }
    return {
      onBack
    }
  }
}

</script>