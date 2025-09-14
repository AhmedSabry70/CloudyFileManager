import Card from '@/components/Card'
import DownloadButton from '@/components/DownloadButton'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import { getFileTypesParams, sumTotalFileSize } from '@/lib/utils'
import type { Models } from 'node-appwrite'
//type Params = Promise<{[key: string]: string}>


const page = async({params,searchParams}:SearchParamProps) => {
    const tab = (await params)?.tab as string || ''
    const query = (await searchParams)?.query as string || ''
    const sort= (await searchParams)?.sort as string || ''

    
    const types = getFileTypesParams(tab) as FileType[]
    const files: Models.Document  = await getFiles({types,query,sort})
  return (
    /* page-container */
    <div className=''>
        <section className="w-full">
            <h1 className=" h1 capitalize">
                {tab}
            </h1>
            <div className="total-size-section">
                <p className="body-1">Total: <span className="h5">{sumTotalFileSize(files.documents).humanReadable}</span></p>
                <div className="sort-container">
                    <p className="body-1 hidden sm:block text-light-200">
                        Sort by:
                    </p>
                     <Sort /> 
                </div>
            </div>
        </section>
        
        {files.total >0? (
            <section className="file-list">
            {files.documents.map((file:Models.Document)=>(
                <Card key={file.$id} file={file}/>
            ))}
            </section>
        ): <p className='empty-list'>No Files Uploaded!</p>}

    </div>
  )
}

export default page