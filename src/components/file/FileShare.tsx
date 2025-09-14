import { Models } from 'node-appwrite';
import { Dispatch, SetStateAction } from 'react';

import Image from 'next/image';
import FormattedDate from '../FormattedDate';
import Thumbnail from '../Thumbnail';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
type FileShareProps = {
    file:Models.Document;
    onInputChange: Dispatch<SetStateAction<string[]>>;
    onRemove:(email:string)=>void
}
const FileShare = ({file,onInputChange,onRemove}:FileShareProps) => {
  return (
    <div>
       <div className="file-details-thumbnail">
                  <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
                  <div className="flex flex-col">
                      <p className="subtitle-2 mb-1">{file.name}</p>
                      <FormattedDate date={file.$createdAt} className='caption'/>
                      
                  </div>
              </div>

              <div className="share-wrapper">
                <p className='subtitle-2 ps- text-light-100'>Share file with other users</p>
                <Input type='email' placeholder='Enter email address'
                onChange={e=>onInputChange(e.target.value.trim().split(','))}
                className='share-input-field'
                />
                <div className="pt-4">
                  <div className="flex justify-between">
                    <p className="subtitle-2 text-light-100">Shared with</p>
                    <p className="subtitle-2 text-light-200">{file.users.length} users</p>

                  </div>

                  <ul className="pt-2">
                    {file.users.map((email:string)=>(
                      <li key={email} className='flex items-center justify-between gap-2'>
                        <p className="subtitle-2">{email}</p>
                        <Button onClick={()=>onRemove(email)} className='share-remove-user'>
                            <Image src={'/assets/icons/remove.svg'} alt='remove' width={24} height={24} className='remove-icon'/>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
    </div>
  )
}

export default FileShare