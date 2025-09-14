

import {
  archiveExtensions,
  audioExtensions,
  codeExtensions,
  documentExtensions,
  executableExtensions,
  fontExtensions,
  imageExtensions,
  videoExtensions,
} from '@/constants/FilesTypeMaping';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type FileLike = {
  size?: number | null;
  [key: string]: any;
};


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


export const getFileTypesParams = (type: string) => {
  switch (type) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "archives":
      return ['archive']
    case "executables":
      return ['executable']
    case 'fonts':
      return ['font']
    case "code":
      return ['code']
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
};


// APPWRITE URL UTILS
// Construct appwrite file URL - https://appwrite.io/docs/apis/rest#images
export const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};


export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB"; // 1 GB or more, show in GB
  }
};

export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};

export  function sumTotalFileSize(files: FileLike[]): FileSizeSummary {
  const totalSizeBytes = files.reduce((acc, file) => {
    const size = Number(file.size ?? 0);
    return acc + (isNaN(size) ? 0 : size);
  }, 0);

  return {
    totalSizeBytes,
    humanReadable: convertFileSize(totalSizeBytes),
  };
}





/* 
*
* dashboard
* 
*/

export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(2));
};

// DASHBOARD UTILS
export const getUsageSummary = (totalSpace: any) => {
  return [
    {
      title: "Documents",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: "/assets/icons/documents.svg",
      url: "/documents",
      style:'bg-brand [filter:drop-shadow(0_10px_8px_#fa727493)]'
    },
    {
      title: "Images",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: "/assets/icons/images.svg",
      url: "/images",
      style:'bg-sky-500 [filter:drop-shadow(0_10px_8px_var(--color-sky-200))]'
    },
    {
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "/assets/icons/video.svg",
      url: "/media",
      style:'bg-green [filter:drop-shadow(0_10px_8px_#3dd9b383)]'
    },
    {
      title: "Others",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: "/assets/icons/others.svg",
      url: "/others",
      style:'bg-pink [filter:drop-shadow(0_10px_8px_#eea8fd83)] '
    },
  ];
};