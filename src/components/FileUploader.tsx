'use client'

import { MouseEvent, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import Image from 'next/image'

import { MAX_FILE_SIZE } from '@/constants'
import { uploadFile } from '@/lib/actions/file.actions'
import { cn, convertFileToURL, getFileIcon, getFileType } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from './ui/button'

type FileUploaderProps = {
  ownerId: string
  accountId: string
  className?: string
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([])
  const pathname = usePathname()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      setFiles(acceptedFiles)
      const uploadPromises = acceptedFiles.map(async file => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name))
          return toast.error('', {
            className: 'error-toast',
            classNames: { icon: 'text-white' },
            position: 'bottom-center',
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                <br />
                max file size is 50MB.
              </p>
            ),
          })
        }

        return uploadFile({ file, ownerId, accountId, path: pathname })
      })

      await Promise.all(uploadPromises)
    },
    [ownerId, accountId, pathname],
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveFile = (e: MouseEvent<HTMLImageElement>, fileName: string) => {
    e.stopPropagation()
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))
  }
  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn('uploader-button', className)}>
        <Image src={'/assets/icons/upload.svg'} alt="upload" width={24} height={24} />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, idx) => (
            <FileComp key={file.name + '-' + idx} file={file} handleRemoveFile={handleRemoveFile} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUploader

const FileComp = ({
  file,
  handleRemoveFile,
}: {
  file: File
  handleRemoveFile: (e: MouseEvent<HTMLImageElement>, fileName: string) => void
}) => {
  const { type, extension } = getFileType(file.name)

  return (
    <li className="uploader-preview-item">
      <div className="flex items-center gap-3">
        <Thumbnail extension={extension} type={type} url={convertFileToURL(file)} />
        <div className="preview-item-name">
          {file.name}
          <Image src={'/assets/icons/file-loader.gif'} width={80} height={80} alt="loader" />
        </div>
      </div>
      <Image
        src={'/assets/icons/remove.svg'}
        alt="remove"
        height={24}
        width={24}
        onClick={e => handleRemoveFile(e, file.name)}
        className=""
      />
    </li>
  )
}

const Thumbnail = ({
  type,
  extension,
  url,
  className,
  imageClassName,
}: {
  type: string
  extension: string
  url: string
  imageClassName?: string
  className?: string
}) => {
  const isImage = type === 'image' && extension !== 'svg'
  return (
    <figure className={cn('thumbnail', className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail-image"
        width={100}
        height={100}
        className={cn('object--contain size-8', imageClassName, isImage && 'thumbnail-image')}
      />
    </figure>
  )
}
