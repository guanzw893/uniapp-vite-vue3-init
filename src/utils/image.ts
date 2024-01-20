import { useEnv } from '@/hooks'
import { isH5, isWx } from '@/utils'

export enum EImageExt {
  PNG = 'png',
  JPG = 'jpg',
  SVG = 'svg'
}

export const ImageType = {
  [EImageExt.PNG]: 'image/png',
  [EImageExt.JPG]: 'image/jpg',
  [EImageExt.SVG]: 'image/svg+xml'
}

/**
 * 图片管理器
 */
export class ImageManager {
  /**
   * 获取文件名称
   */
  getFileName() {
    return Date.now().toString()
  }

  /**
   * 根据路径获取文件类型
   */
  getFileType(url: string) {
    const ext = url.split('.').pop() as EImageExt
    const type = ImageType[ext]
    if (!type) {
      throw Error('文件类型不支持')
    }
    return type
  }

  /**
   * 路径转base64
   */
  pathToBase64(path: string, imageType: EImageExt = EImageExt.PNG) {
    return new Promise<string>((resolve, reject) => {
      if (isH5) {
        // #ifdef H5
        const canvas = document.createElement('canvas')
        const c2x = canvas.getContext('2d')
        const img = new Image()
        img.onload = function () {
          canvas.width = img.width
          canvas.height = img.height
          c2x!.drawImage(img, 0, 0)
          resolve(canvas.toDataURL(ImageType[imageType]))
          canvas.height = canvas.width = 0
        }
        img.onerror = reject
        img.src = path
        // #endif
      } else {
        // #ifdef MP
        uni.getFileSystemManager().readFile({
          filePath: path,
          encoding: 'base64',
          success: (res) => {
            resolve(`data:${this.getFileType(path)};base64,` + res.data)
          },
          fail: function (error) {
            reject(error)
          }
        })
        // #endif
      }
    })
  }

  /**
   * base64转路径
   */
  base64ToPath(base64: string, imageType: EImageExt = EImageExt.PNG) {
    return new Promise<string>(async (resolve, reject) => {
      const [fileType, data] = base64.split(',')

      if (isH5) {
        // #ifdef H5
        const str = atob(data)
        let n = str.length
        const array = new Uint8Array(n)
        while (n--) {
          array[n] = str.charCodeAt(n)
        }
        resolve(
          URL.createObjectURL(new Blob([array], { type: ImageType[imageType] }))
        )
        // #endif
      } else {
        // #ifdef MP
        if (uni.canIUse('createOffscreenCanvas') && isWx) {
          const canvas = uni.createOffscreenCanvas({
            type: '2d'
          }) as any
          const ctx = canvas.getContext('2d')

          const image = canvas.createImage()
          await new Promise((resolve) => {
            image.onerror = reject
            image.onload = resolve
            image.src = base64
          })

          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)

          this.canvasToTemFilePath(canvas, imageType)
            .then(resolve)
            .catch(reject)
        } else {
          const ext = fileType.match(/data\:\S+\/(\S+);/)![1]
          const fileName = this.getFileName() + '.' + ext
          const filePath = useEnv().getUserDataPath() + '/' + fileName

          // 兼容抖音小程序
          const buffer = uni.base64ToArrayBuffer(data)

          uni.getFileSystemManager().writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success: function () {
              resolve(filePath)
            },
            fail: function (error) {
              reject(error)
            }
          })
        }
        // #endif
      }
    })
  }

  // #ifdef H5
  /**
   * 图片地址下载（H5）
   */
  async downloadUrlAsImageH5({
    url,
    imageType = EImageExt.PNG,
    imageName
  }: {
    url: string
    imageType?: EImageExt
    imageName?: string
  }) {
    const blob = await fetch(url).then((res) => res.blob())
    const path = URL.createObjectURL(blob)

    const base64 = await this.pathToBase64(path, imageType)

    this.downloadBase64AsImageH5({
      base64,
      imageType,
      imageName
    })

    URL.revokeObjectURL(url)
  }

  /**
   * base64下载（H5）
   */
  async downloadBase64AsImageH5({
    base64,
    imageType = EImageExt.PNG,
    imageName
  }: {
    base64: string
    imageType?: EImageExt
    imageName?: string
  }) {
    const downloadLink = document.createElement('a')
    downloadLink.href = base64
    downloadLink.download = imageName ?? this.getFileName() + '.' + imageType
    downloadLink.click()
  }
  // #endif

  // #ifdef MP
  /**
   * 图片地址下载（小程序）
   */
  async downloadUrlAsImageMp({
    url,
    imageType = EImageExt.PNG
  }: {
    url: string
    imageType?: EImageExt
  }) {
    if (url.startsWith('http')) {
      url = await this.download(url)
    }
    const base64 = await this.pathToBase64(url)

    return this.downloadBase64AsImageMp({
      base64,
      imageType
    })
  }

  /**
   * base64下载（小程序）
   */
  async downloadBase64AsImageMp({
    base64,
    imageType = EImageExt.PNG
  }: {
    base64: string
    imageType?: EImageExt
  }) {
    const filePath = await this.base64ToPath(base64, imageType)

    return this.saveImageToPhotos(filePath)
  }

  /**
   * 下载图片到本地
   */
  download(url: string) {
    return new Promise<string>((resolve, reject) => {
      uni.downloadFile({
        url,
        success(res) {
          resolve(res.tempFilePath)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  /**
   * canvas转文件路径
   */
  canvasToTemFilePath(canvas: any, fileType: EImageExt = EImageExt.PNG) {
    return new Promise<string>((resolve, reject) => {
      uni.canvasToTempFilePath({
        canvas,
        fileType,
        success(res) {
          resolve(res.tempFilePath)
        },
        fail(err) {
          reject(err)
        }
      } as UniNamespace.CanvasToTempFilePathOptions)
    })
  }

  /**
   * 保存到相册
   */
  saveImageToPhotos(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
            mask: true
          })
          resolve()
        },
        fail: (err) => {
          uni.showToast({
            title: err.message ?? '保存失败',
            icon: 'error',
            mask: true
          })
          reject(err)
        }
      })
    })
  }
  // #endif

  /**
   * 图片base64下载
   * H5直接下载
   * 小程序保存到相册
   */
  async downloadBase64Image(data: {
    base64: string
    imageType?: EImageExt
    imageName?: string
  }) {
    if (isH5) {
      // #ifdef H5
      return this.downloadBase64AsImageH5(data)
      // #endif
    } else {
      // #ifdef MP
      return this.downloadBase64AsImageMp(data)
      // #endif
    }
  }

  /**
   * 图片地址下载
   * H5直接下载
   * 小程序保存到相册
   */
  downloadUrlImage(data: {
    url: string
    imageType?: EImageExt
    imageName?: string
  }) {
    if (isH5) {
      // #ifdef H5
      return this.downloadUrlAsImageH5(data)
      // #endif
    } else {
      // #ifdef MP
      return this.downloadUrlAsImageMp(data)
      // #endif
    }
  }
}
