import {
  archiveExtensions,
  audioExtensions,
  codeExtensions,
  documentExtensions,
  executableExtensions,
  fontExtensions,
  imageExtensions,
  videoExtensions,
} from '@/constants/FilesTypeMaping'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value))

export const convertFileToURL = (file: File) => {
  // Ensure the input is a File object
  if (!(file instanceof File)) throw new Error('The provided argument is not a File object')

  // Create a URL for the file
  const fileURL = URL.createObjectURL(file)

  return fileURL
}

export const getFileType = (filename: string) => {
  // Extract the file extension
  const extension = filename.split('.').pop()?.toLowerCase()
  if (!extension) return { type: 'other', extension: '' }

  // Get the MIME type from the mapping
  if (documentExtensions.includes(extension)) return { type: 'document', extension }
  if (imageExtensions.includes(extension)) return { type: 'image', extension }
  if (videoExtensions.includes(extension)) return { type: 'video', extension }
  if (audioExtensions.includes(extension)) return { type: 'audio', extension }
  if (archiveExtensions.includes(extension)) return { type: 'archive', extension }
  if (executableExtensions.includes(extension)) return { type: 'executable', extension }
  if (fontExtensions.includes(extension)) return { type: 'font', extension }
  if (codeExtensions.includes(extension)) return { type: 'code', extension }

  return { extension, type: 'other' }
}

export const getFileIcon = (extension: string | undefined, type: FileType | string) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg'
    case 'doc':
      return '/assets/icons/file-doc.svg'
    case 'docx':
      return '/assets/icons/file-docx.svg'
    case 'csv':
      return '/assets/icons/file-csv.svg'
    case 'txt':
      return '/assets/icons/file-txt.svg'
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg'
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg'
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg'
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg'

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg'
        case 'document':
          return '/assets/icons/file-document.svg'
        case 'video':
          return '/assets/icons/file-video.svg'
        case 'audio':
          return '/assets/icons/file-audio.svg'
        default:
          return '/assets/icons/file-other.svg'
      }
  }
}
