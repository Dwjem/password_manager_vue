<script setup lang="ts">
import {ref} from "vue";
import axios from 'axios';
import cheerio from 'cheerio';

const url = ref('https://www.baidu.com/')

function getFullUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}

const fullUrl = getFullUrl(url.value);
console.log(fullUrl);

axios.get(fullUrl)
    .then(response => {
      const $ = cheerio.load(response.data);
      const title = $('title').text();
      console.log(title);
    })
    .catch(error => {
      console.log("获取失败")
      console.error('Error:', error);
    });

// console.log(axios)


</script>

<template>

</template>

<style scoped lang="scss">

</style>