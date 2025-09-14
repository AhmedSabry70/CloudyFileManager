import { formatDateTime } from '@/lib/utils'
import { Models } from 'node-appwrite'
import FormattedDate from '../FormattedDate'
import Thumbnail from '../Thumbnail'

const DetailRow = ({label,value}:{label:string,value:string})=>(
    <div className="flex">
                    <p className="file-details-label">{label}:</p>
                    <p className="file-details-value">{value}</p>

                </div>
)

const FileDetails = ({file}:{file:Models.Document}) => {
  return (
    <div>
        <div className="file-details-thumbnail">
            <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
            <div className="flex flex-col">
                <p className="subtitle-2 mb-1">{file.name}</p>
                <FormattedDate date={file.$createdAt} className='caption'/>
                
            </div>
        </div>
<div className="space-y-4 px-2 pt-2">

        <DetailRow label='Format' value={file.extension}/>
        <DetailRow label='Size' value={file.size}/>
        <DetailRow label='Owner' value={file.owner.fullName}/>
        <DetailRow label='Last edit' value={formatDateTime(file.$updatedAt)}/>
</div>

    </div>
  )
}

export default FileDetails