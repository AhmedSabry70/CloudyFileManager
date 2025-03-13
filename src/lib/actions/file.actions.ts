'use server'
import { ID, InputFile } from 'node-appwrite'
import { createAdminClient } from '../appwrite'
import { appwriteConfig } from '@/config'
import { getFileType, parseStringify } from '../utils'
import { revalidatePath } from 'next/cache'

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  try {
    const { storage, databases } = await createAdminClient()
    const FileChunk = InputFile.fromBuffer(Buffer.from(await file.arrayBuffer()), file.name)
    // If running in Node.js, use InputFile

    const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), FileChunk)

    const fileMeta = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: 'constructFileUrl()',
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFile: bucketFile.$id,
    }

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileMeta,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
        handleError(error, `Failed to create file document`)
      })

    revalidatePath(path)
    return parseStringify(newFile)
  } catch (err) {
    const message = `Failed to upload ${file.name} file`
    handleError(err, message)
  }
}
