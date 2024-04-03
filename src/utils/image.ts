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

export type ChooseFileResult = {
  size: number
  path: string
}

export type FileInfoResult = {
  size: number
  errMsg: string
}

export type CompressImageResult = ChooseFileResult

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

          this.canvasToTemFilePath({ canvas, fileType: imageType })
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
  canvasToTemFilePath({
    canvas,
    width,
    height,
    quality = 1,
    fileType = EImageExt.PNG
  }: {
    canvas: any
    width?: number
    height?: number
    fileType?: EImageExt
    quality?: number
  }) {
    return new Promise<string>((resolve, reject) => {
      uni.canvasToTempFilePath({
        canvas,
        fileType,
        quality,
        width,
        height,
        destWidth: width,
        destHeight: height,
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
        success() {
          resolve()
        },
        fail(err) {
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

  getFileInfo(filePath: string) {
    return new Promise<FileInfoResult>((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.getFileSystemManager().getFileInfo({
        filePath,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
      // #endif
      // #ifdef H5
      uni.getFileInfo({
        filePath,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
      // #endif
    })
  }

  chooseFile(options: {
    count: number
    type?: 'all' | 'image' | 'video' | 'file'
    extension?: string[]
  }) {
    return new Promise<ChooseFileResult[]>((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.chooseMessageFile({
        type: options.type,
        count: options.count,
        success(res) {
          resolve(res.tempFiles)
        },
        fail(err) {
          reject(err)
        }
      })
      // #endif

      // #ifdef H5
      uni.chooseFile({
        type: options.type as 'all' | 'image' | 'video',
        count: options.count,
        success(res) {
          resolve(res.tempFiles as ChooseFileResult[])
        },
        fail(err) {
          reject(err)
        }
      })
      // #endif
    })
  }

  async compressImage({
    src,
    quality = 8,
    maxSize = 1024 * 1024,
    maxWidth = 1280,
    maxHeight = 1024
  }: {
    src: string
    quality?: number
    maxSize?: number
    maxWidth?: number
    maxHeight?: number
  }): Promise<CompressImageResult> {
    let { width, height } = await uni.getImageInfo({ src })

    if (width > maxWidth) {
      height = Math.floor(height / (width / maxWidth))
      width = maxWidth
    }
    if (height > maxHeight) {
      width = Math.floor(width / (height / maxHeight))
      height = maxHeight
    }

    const fileInfo = await this.getFileInfo(src)

    if (fileInfo.size <= maxSize) {
      return {
        path: src,
        size: fileInfo.size
      }
    }

    // #ifdef MP
    const tempFilePath = await new Promise<string>((resolve) => {
      uni.compressImage({
        src,
        quality: quality * 10,
        compressedWidth: width,
        compressHeight: height,
        success: (res) => {
          resolve(res.tempFilePath)
        }
      })
    })
    // #endif

    // #ifdef H5
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const image = new Image()
    await new Promise((resolve, reject) => {
      image.onerror = reject
      image.onload = resolve
      image.src = src
    })

    canvas.width = width
    canvas.height = height
    ctx?.drawImage(image, 0, 0, width, height)

    const tempFilePath = canvas.toDataURL('image/jpeg', quality)
    // #endif

    const { size } = await this.getFileInfo(tempFilePath)

    return { path: tempFilePath, size }
  }
}
