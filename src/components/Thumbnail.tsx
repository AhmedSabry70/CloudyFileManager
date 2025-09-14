import { cn, getFileIcon } from "@/lib/utils"
import Image from "next/image"

 const Thumbnail = ({
    type,
    extension,
    url,
    className,
    imageClassName,
  }: {
    type: string
    extension: string
    url: string
    imageClassName?: string
    className?: string
  }) => {
    const isImage = type === 'image' && extension !== 'svg'
    return (
      <figure className={cn('thumbnail', className)}>
        <Image
          src={isImage ? url : getFileIcon(extension, type)}
          alt="thumbnail-image"
          width={100}
          height={100}
          className={cn('object--contain size-8', imageClassName, isImage && 'thumbnail-image')}
        />
      </figure>
    )
  }

  export default Thumbnail