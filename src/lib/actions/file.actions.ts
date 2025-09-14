'use server'
import { ID, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

import { appwriteConfig } from '@/config'
import { revalidatePath } from 'next/cache'
import { createAdminClient, createSessionClient } from '../appwrite'
import { constructFileUrl, getFileType, parseStringify } from '../utils'
import { getCurrentUser } from './user.actions'

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
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
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

export const getFiles = async ({types=[],sort='$createdAt-desc',query='',limit}:GetFilesProps) => {
  const {databases} = await createAdminClient()

  

  try {
    const currentUser = await getCurrentUser()
    if(!currentUser) throw new Error('User not found')
      const queries = [
    Query.or([
      Query.equal('owner',[currentUser.$id]),
      Query.contains('users',[currentUser.email])
    ])]
    if(types.length > 0) queries.push(Query.equal('type',types))
    if(query.trim()) queries.push(Query.contains('name',query))
    if(limit) queries.push(Query.limit(limit))
    
      const [sortBy,orderBy] = sort.split('-')
      queries.push(orderBy==='asc'?Query.orderAsc(sortBy):Query.orderDesc(sortBy))



    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    )

    return parseStringify(files)
  } catch (err) {
    handleError(err,'Failed to get files')
  }
}

export const renameFile = async ({fileId,name,extension,path}:RenameFiler) => {
  const {databases} = await createAdminClient()

  try {
    const fileName = `${name}.${extension}`
    const updatedFile= await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name:fileName
      }
    )
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (err) {
    handleError(err,`Failed to Rename file : ${name}`)
  }
}

export const deleteFile = async ({fileId,bucketFileId,path}:DeleteFileProps) => {
  try {
    const {databases,storage}= await createAdminClient()
   const deletedFile= await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )
    if(deletedFile) await storage.deleteFile(appwriteConfig.bucketId,bucketFileId)

    revalidatePath(path)
    return parseStringify({status:'File successfully deleted.'})
  } catch (err) {
    handleError(err,'Failed to delete file')
  }
}


export const fileUsersAllowed = async ({fileId,emails,path}:UpdateFileUsersProps) => {
  const {databases} = await createAdminClient()
  try {

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users:emails
      }
    )

    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (err) {
    handleError(err,"Can't share file with this user")
  }
}







// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      archive: { size: 0, latestDate: "" },
      executable: { size: 0, latestDate: "" },
      font: { size: 0, latestDate: "" },
      code: { size: 0, latestDate: "" },

      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}