<template>
  <div class="max-content" ref="maxContent">
    <div class="card">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {saveImage, getImageByKey} from "@/utils/background"
import defaultBackground from '@/assets/images/index_bg.jpg';

export default defineComponent({
  name: "container",
  setup() {
    const background_url = defaultBackground;
    const maxContent = ref<HTMLImageElement>();
    getImageByKey(background_url).then(value => {
      const image = value?.image
      // 本地有地址为background_url的记录，调用本地indexDB中的
      if (image) {
        maxContent.value!.style.backgroundImage = `url(${image})`
      } else {
        // 否则请求该图片地址，并且保存到本地
        const background_img = new Image();
        background_img.setAttribute('crossOrigin', 'anonymous');
        background_img.onload = (function (e: any) {
          // 图片加载成功后的回调
          maxContent.value!.style.backgroundImage = `url(${ImageToBase64(this)})`
        })
        background_img.src = background_url;// 图片地址
      }
    })

    // 传入图片元素
    function ImageToBase64(img: HTMLElement) {
      // 创建一个Canvas元素
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');

      // 设置Canvas的宽高与图片相同
      canvas.width = img.width;
      canvas.height = img.height;

      // 在Canvas上绘制图片
      context.drawImage(img, 0, 0);

      // 将Canvas转换为base64格式的图片数据
      let base64Image = canvas.toDataURL('image/png');
      // 将base64格式的图片数据保存到 indexDB 中
      saveImage({key: img.src, base64Image});
      return base64Image
    }

    return {
      maxContent
    }
  }
})
</script>

<style lang="scss" scoped>
.max-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #282828;
  //user-select: none;

  .card {
    // border: 1px solid #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1247px;
    max-height: 80%;
    overflow: auto;
    padding: 30px;
    border-radius: 25px;
    box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, .5);
    --webkit-box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, .5);
    --moz-box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, .5);
    background: rgba(255, 255, 255, 0.2);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

@media screen and (max-width: 1247px) {
  .max-content {.card {
    max-height: 100%;
    height: 100%;
    border-radius: 0;
  }}
}
</style>
