import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Upload,
  Link2,
  X,
  FileImage,
  FileVideo,
  File,
  Loader2,
} from 'lucide-react'
import { Api, Cn, GetCookie, TranslateServerError } from '@/scripts'
import { AppApis } from '@/data'
import { Button } from '../ui/button/button.index'
import { Input } from '../ui/input/input.index'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs/tabs.index'
import {
  MediaFileAcceptMap,
  type UploadType,
  type MessageType,
  type MediaFileType,
} from '@/types'
import { toast } from 'sonner'

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function inferMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    gif: 'image/gif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
  }
  return map[ext || ''] || 'image/jpeg'
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage
  if (mimeType.startsWith('video/')) return FileVideo
  return File
}

function resolveAccept(
  fileType: MediaFileType | MediaFileType[] | undefined
): string {
  if (!fileType) return MediaFileAcceptMap.image
  const types = Array.isArray(fileType) ? fileType : [fileType]
  return types.map((t) => MediaFileAcceptMap[t]).join(',')
}

interface UploaderProps {
  value?: UploadType[]
  onChange?: (files: UploadType[]) => void
  defaultUploadIds?: number[]
  multiple?: boolean
  maxFiles?: number
  label?: string
  fileType?: MediaFileType | MediaFileType[]
  maxSizeMB?: number
  name?: string
}

export default function Uploader({
  value: controlledValue,
  onChange,
  defaultUploadIds,
  multiple = false,
  maxFiles = 5,
  fileType,
  maxSizeMB = 50,
  name,
}: UploaderProps) {
  const { t } = useTranslation()
  const isControlled = controlledValue !== undefined
  const [internalFiles, setInternalFiles] = useState<UploadType[]>([])
  const initRef = useRef(false)
  const files = isControlled ? controlledValue : internalFiles
  const remaining = maxFiles - files.length

  const [mode, setMode] = useState<'file' | 'url'>('file')
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState<{
    name: string
    size: number
    preview: string | null
  } | null>(null)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [urlError, setUrlError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const accept = resolveAccept(fileType)

  const isUploading = uploading !== null
  const showPicker = files.length === 0 && !isUploading

  const { data: fetchedUploads } = useQuery({
    queryKey: ['upload', 'byIds', defaultUploadIds],
    queryFn: async () => {
      const ids = defaultUploadIds || []
      return Promise.all(
        ids.map((id) =>
          Api<UploadType>(AppApis.upload.byId(id), { method: 'GET' })
        )
      )
    },
    enabled: (defaultUploadIds?.length || 0) > 0 && !isControlled,
  })

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (fetchedUploads?.length && !initRef.current) {
      initRef.current = true
      const urlItem = fetchedUploads.find((f) => f.source_type === 'FROM_URL')
      if (urlItem) {
        setMode('url')
        setUrl(urlItem.path)
      }
      setInternalFiles(fetchedUploads)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchedUploads])

  const updateFiles = (next: UploadType[]) => {
    if (!isControlled) setInternalFiles(next)
    onChange?.(next)
  }

  const urlMutation = useMutation({
    mutationFn: (inputUrl: string) =>
      Api<UploadType>(AppApis.upload.fromUrl, {
        method: 'POST',
        body: { path: inputUrl, mime_type: inferMimeType(inputUrl) },
      }),
    onSuccess: (data) => {
      if (!multiple) {
        updateFiles([data])
      } else {
        updateFiles([...files, data])
      }
      setUrl('')
      toast.success(t('upload.uploaded'))
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (uploadId: number) =>
      Api<MessageType>(AppApis.upload.adminDelete, {
        method: 'DELETE',
        body: { upload_ids: [uploadId] },
      }),
    onSuccess: (_, uploadId) => {
      const deleted = files.find((f) => f.id === uploadId)
      if (deleted?.source_type === 'FROM_URL') {
        setUrl('')
        setMode('file')
      }
      updateFiles(files.filter((f) => f.id !== uploadId))
      toast.success(t('upload.deleted'))
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status))
    },
  })

  const startUpload = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t('upload.file_exceeds', { size: maxSizeMB }))
      return
    }

    const preview = file.type.startsWith('image/')
      ? URL.createObjectURL(file)
      : null
    setUploading({ name: file.name, size: file.size, preview })
    setProgress(0)
    setProcessing(false)

    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr
    xhr.timeout = 5 * 60 * 1000

    const accessToken = GetCookie('accessToken')
    xhr.open('POST', AppApis.upload.fromFile)
    if (accessToken)
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

    const cleanup = (errorMessage?: string) => {
      if (xhrRef.current === xhr) xhrRef.current = null
      if (preview) URL.revokeObjectURL(preview)
      setUploading(null)
      setProgress(0)
      setProcessing(false)
      if (errorMessage) toast.error(errorMessage)
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100))
        if (e.loaded === e.total) setProcessing(true)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let data: UploadType
        try {
          data = JSON.parse(xhr.responseText)
        } catch {
          cleanup(t('upload.upload_failed'))
          return
        }
        if (!multiple) {
          updateFiles([data])
        } else {
          updateFiles([...files, data])
        }
        toast.success(t('upload.uploaded'))
        cleanup()
      } else {
        let detail: string | undefined
        try {
          const err = JSON.parse(xhr.responseText)
          detail = err.errors?.[0]?.detail
        } catch {
          // response is not JSON (e.g. proxy/nginx error page)
        }
        cleanup(detail || t(TranslateServerError(xhr.status)))
      }
    }

    xhr.ontimeout = () => {
      cleanup(t('upload.timeout'))
    }

    xhr.onerror = () => {
      cleanup(t('upload.network_error'))
    }

    xhr.onabort = () => {
      cleanup()
    }

    xhr.send(formData)
  }

  const cancelUpload = () => {
    xhrRef.current?.abort()
    xhrRef.current = null
    if (uploading?.preview) URL.revokeObjectURL(uploading.preview)
    setUploading(null)
    setProgress(0)
    setProcessing(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList?.length) {
      if (multiple) {
        Array.from(fileList).slice(0, remaining).forEach(startUpload)
      } else {
        startUpload(fileList[0])
      }
    }
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const fileList = e.dataTransfer.files
    if (fileList?.length) {
      if (multiple) {
        Array.from(fileList).slice(0, remaining).forEach(startUpload)
      } else {
        startUpload(fileList[0])
      }
    }
  }

  const handleUrlSubmit = () => {
    const trimmed = url.trim()
    if (!trimmed) {
      setUrlError(t('upload.url_required'))
      return
    }
    if (!isValidUrl(trimmed)) {
      setUrlError(t('upload.url_invalid'))
      return
    }
    setUrlError('')
    urlMutation.mutate(trimmed)
  }

  return (
    <div className='w-full space-y-2 rounded-lg border border-border/50 bg-card p-4 shadow-sm'>
      {showPicker && (
        <Tabs value={mode} onValueChange={(m) => setMode(m as 'file' | 'url')}>
          <div className='flex items-center justify-between'>
            <TabsList className='h-7'>
              <TabsTrigger value='file' className='px-2.5 text-xs'>
                {t('upload.file')}
              </TabsTrigger>
              <TabsTrigger value='url' className='px-2.5 text-xs'>
                {t('upload.url')}
              </TabsTrigger>
            </TabsList>

            {mode === 'file' && multiple && (
              <span className='text-xs text-muted-foreground'>
                {files.length}/{maxFiles}
              </span>
            )}
          </div>

          <TabsContent value='file' className='mt-1.5'>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={Cn(
                'flex cursor-pointer items-center justify-between gap-2 rounded-lg border-2 border-dashed p-2.5 text-xs transition-colors',
                dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              )}
            >
              <div className='flex items-center gap-2'>
                <Upload className='size-4 shrink-0 text-muted-foreground' />
                <span className='text-xs text-muted-foreground'>
                  {t('upload.click_or_drag')}
                </span>
              </div>
              <span className='text-[11px] text-muted-foreground/50'>
                {t('upload.max_size', { size: maxSizeMB })}
              </span>
              <input
                ref={inputRef}
                type='file'
                accept={accept}
                multiple={multiple}
                className='hidden'
                onChange={handleFileSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value='url' className='mt-1.5'>
            <div className='flex items-start gap-2'>
              <div className='flex-1'>
                <div className='relative'>
                  <Link2 className='absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (urlError) setUrlError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    placeholder='https://example.com/image.jpg'
                    className='h-8 pl-8 text-xs'
                    aria-invalid={!!urlError}
                  />
                </div>
                {urlError && (
                  <p className='mt-1 text-[11px] text-destructive'>
                    {urlError}
                  </p>
                )}
              </div>
              <Button
                size='sm'
                onClick={handleUrlSubmit}
                disabled={!url.trim() || urlMutation.isPending}
                className='h-8 shrink-0'
              >
                {urlMutation.isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : null}
                {t('upload.upload')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {isUploading && (
        <div className='rounded-lg border p-2.5'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-muted'>
              {uploading.preview ? (
                <img
                  src={uploading.preview}
                  alt=''
                  className='size-full rounded-md object-cover'
                />
              ) : (
                <File className='size-5 text-muted-foreground' />
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs font-medium text-foreground'>
                {uploading.name}
              </p>
              <p className='text-[11px] text-muted-foreground'>
                {processing
                  ? t('upload.processing')
                  : uploading.size
                    ? `${formatBytes(uploading.size)}${
                        progress > 0 ? ` · ${progress}%` : ` · ${t('upload.uploading')}`
                      }`
                    : t('upload.fetching')}
              </p>
              {uploading.size > 0 && (
                <div className='mt-1 h-1 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className={Cn(
                      'h-full rounded-full bg-primary transition-all duration-300 ease-out',
                      progress === 0 && !processing && 'w-1/2 animate-pulse'
                    )}
                    style={{
                      width:
                        progress === 0
                          ? undefined
                          : `${processing ? 100 : progress}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <button
              onClick={cancelUpload}
              className='shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive'
              aria-label={t('upload.cancel_upload')}
            >
              <X className='size-3.5' />
            </button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className='space-y-1.5'>
          {files.map((file) => {
            const Icon = getFileIcon(file.mime_type)
            const isImage = file.mime_type.startsWith('image/')
            return (
              <div
                key={file.id}
                className='flex items-center gap-2.5 rounded-lg border p-2'
              >
                <div className='flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
                  {isImage && file.path ? (
                    <img
                      src={file.path}
                      alt=''
                      className='size-full object-cover'
                    />
                  ) : (
                    <Icon className='size-5 text-muted-foreground' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-xs font-medium text-foreground'>
                    {file.file_name || file.path.split('/').pop() || 'file'}
                  </p>
                  <p className='text-[11px] text-muted-foreground'>
                    {file.size ? formatBytes(file.size) : ''}
                    {file.size ? ' · ' : ''}
                    {file.source_type === 'FROM_URL'
                      ? t('upload.via_url')
                      : t('upload.uploaded')}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(file.id)}
                  disabled={deleteMutation.isPending}
                  className='shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50'
                  aria-label={t('upload.remove_file')}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className='size-3.5 animate-spin' />
                  ) : (
                    <X className='size-3.5' />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
      {name && !multiple && files.length > 0 && (
        <input type='hidden' name={name} value={files[0].id} />
      )}
    </div>
  )
}
