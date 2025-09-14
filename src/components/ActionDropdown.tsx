'use client'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants"
import { deleteFile, fileUsersAllowed, renameFile } from "@/lib/actions/file.actions"
import { constructDownloadUrl } from "@/lib/utils"
import { MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
//import { Models } from "node-appwrite"
import type { Models } from "node-appwrite"
import { useState } from "react"
import FileDetails from "./file/FileDetails"
import FileShare from "./file/FileShare"
import { Button } from "./ui/button"
import { Input } from "./ui/input"


const fileActions = new Set(['rename','delete','share','download','details'])

const ActionDropdown = ({file}:{file:Models.Document}) => {
  const path = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [action, setAction] = useState<ActionType|null>(null)
    const [fileName, setFileName] = useState(file.name.split('.').shift())
    const [isLoading, setIsLoading] = useState(false)
    const [emails, setEmails] = useState<string[]>([])
    const [flyStart, setFlyStart] = useState<{ x: number; y: number } | null>(null);

const resetAll = ()=>{
setAction(null)
setFileName(file.name)
setIsModalOpen(false)
setIsDropdownOpen(false)


}
const setFileAction =(action:ActionType)=>{
  setAction(action)
  if(action.value !== 'download') {
    setIsModalOpen(true)
  }
}
    const fileActionHandler = async()=>{


      if(!action) return
      setIsLoading(true)
      let success = false

      const actions = {
        rename: ()=>  renameFile({fileId:file.$id,name:fileName,extension:file.extension,path}),
        share:()=>fileUsersAllowed({fileId:file.$id,emails,path}),
        delete:()=>deleteFile({fileId:file.$id,bucketFileId:file.bucketFileId,path})
      }

       success = await actions[action.value as keyof typeof actions]()

       if(success) resetAll()
        setIsLoading(false)
    
    }


    const handleRemoveUser = async(email:string)=>{
      const updateEmails = emails.filter(mail=>mail!==email)
      const allowedUsers = await fileUsersAllowed({fileId:file.$id,emails:updateEmails,path})

      if(allowedUsers) setEmails(updateEmails)
        resetAll()
    }


    const renderDialogContent = ()=>{
      if(!action) return null
      const {value,label} = action
      return (
        <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
          {value === 'rename'&&<Input id="filename" value={fileName} className="col-span-3" onChange={(e)=>setFileName(e.target.value)}/>}
          {value === 'delete' && <DialogDescription className="delete-confirmation">
            Are you sure you want move <span className="delete-file-name">{fileName}</span> file to Trash?
          </DialogDescription>}
        </DialogHeader>
         {value==='details'&& <FileDetails file={file}/>}
         {value==='share'&& <FileShare file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>}

        {[...fileActions].slice(0, 3).includes(value) && (

        <DialogFooter className="flex flex-col md:flex-row gap-3">
          <Button onClick={resetAll} className="modal-cancel-button">Cancel</Button>

          <Button type="submit" className="modal-submit-button" onClick={fileActionHandler}>
            <p className="capitalize">{value}</p>
            {isLoading && <Image src={'/assets/icons/loader.svg'} alt="loader" width={24} height={24} className="animate-spin" />}
          </Button>
        </DialogFooter> 
        )}
      </DialogContent>
      )
    }


    
  return (
    <>
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
     <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild className="shad-no-focus">
        <MoreVertical className="text-gray-500"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuLabel className="max-w-52 truncate">{file.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actionsDropdownItems.map((action)=>(
            <DropdownMenuItem key={action.value} className="shad-dropdown-item"  onClick={(e) => {
              if (action.value === 'download') {
                const rect = e.currentTarget.getBoundingClientRect();
                setFlyStart({ x: rect.left, y: rect.top });
              }
              setAction(action)
              if(action.value !== 'download') {
                setIsModalOpen(true)
              }
            }}>
                
                {action.value === 'download'? (
                  <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className="flex items-center gap-2">
                  <Image src={action.icon} alt={action.label} width={30} height={30}/>
                  {action.label}

                  </Link>
                ):(
                  <div className="flex items-center gap-2 pe-10">
                <Image src={action.icon} alt={action.label} width={30} height={30}/>
                {action.label}
                </div>
                )}
              
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>


    {renderDialogContent()}
  </Dialog>
        
        </>

  )
}

export default ActionDropdown