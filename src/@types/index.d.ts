/* eslint-disable no-unused-vars */

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