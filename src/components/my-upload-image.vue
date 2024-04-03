<template>
  <div @click="handleClick" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ImageManager } from '@/utils'

const props = withDefaults(
  defineProps<{
    // 文件类型
    accept?: 'image'
    // 是否多选
    multiple?: boolean
    // 是否压缩
    isCompress?: boolean
    // 最大上传数量，multiple为true时生效，默认9
    maxCount?: number
    // 压缩参数，isCompress为true时生效
    compressOptions?: {
      // 压缩质量，范围0-1，数字越小，质量越低
      quality?: number
      // 压缩后图片的最大大小，单位为字节，默认1MB
      maxSize?: number
      // 压缩后图片的最大宽度，默认1280px
      maxWidth?: number
      // 压缩后图片的最大高度，默认1024px
      maxHeight?: number
    }
    // 自定义类名
    className?: string
  }>(),
  {
    accept: 'image',
    multiple: false,
    isCompress: false,
    maxCount: 9
  }
)

const emit = defineEmits<{
  change?: [file: UniApp.ChooseFile[]]
}>()

const imageManager = new ImageManager()

const handleClick = async () => {
  const files = await imageManager.chooseFile({
    type: props.accept,
    count: props.multiple ? props.maxCount : 1
  })

  const tempFiles = files.map((item) => ({ path: item.path, size: item.size }))
  if (props.isCompress) {
    for (const item of tempFiles) {
      const { path, size } = await imageManager.compressImage({
        src: item.path,
        ...props.compressOptions
      })

      item.path = path
      item.size = size
    }
  }

  emit('change', tempFiles)
}
</script>
