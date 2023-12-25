<script setup lang="ts">
import {reactive} from "vue";

const list = reactive([1, 2, 3, 4, 5, 6,7, 8, 9, 10])

const getVar = (index:number):string => {
  console.log(index)
  return `--start: calc(${index * 100}px);--end: calc(${index * 100}px + 200px)`
}
</script>

<template>
  <div class="max">
    <div v-for="i in list" class="item" :style="getVar(i)">{{ i }}</div>
  </div>
</template>

<style scoped lang="scss">
.max {
  .item {
    width: 50px;
    height: 50px;
    background: #ccc;
    margin: 10px;
    line-height: 50px;
    text-align: center;
    animation: move 2s linear infinite;
    @keyframes move {
      0% {
        transform: translateX(var(--start));
      }
      100% {
        transform: translateX(var(--end));
      }
    }
  }
}
</style>
