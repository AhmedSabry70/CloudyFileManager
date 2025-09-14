/* eslint-disable no-unused-vars */

/* FILES AND BUCKET */

declare type FileSizeSummary = {
  totalSizeBytes: number;
  humanReadable: string;
};

declare type FileType =
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'executable'
  | 'font'
  | 'code'
  | 'other'

declare type UploadFileProps = {
  file: File
  ownerId: string
  accountId: string
  path: string
}


declare type ActionType ={
  label: string;
  icon: string;
  value: string;
}

declare type FileActions ='rename'|'details'|'share'|'download'|'delete'


type FileActionBaseProps ={
  fileId:string;
  path:string
}

declare interface RenameFiler extends FileActionBaseProps {
 // fileId:string;
  name:string;
  extension:string;
 // path:string;
}

declare interface DeleteFileProps extends FileActionBaseProps {
  bucketFileId:string
}

declare interface UpdateFileUsersProps extends FileActionBaseProps {
  emails:string[];
}


declare type GetFilesProps = {
  types:FileType[];
  query?:string;
  sort?:string;
  limit?:number
}


/* 
*
* params
* 
*/


declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}