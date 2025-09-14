"use client";

import { getFiles } from "@/lib/actions/file.actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import FormattedDate from "./FormattedDate";
import Thumbnail from "./Thumbnail";
import { PlaceholdersAndVanishInput } from "./ui/PlaceholderInput";

import { useDebounce } from "use-debounce";

 function Search() {
   const placeholders = [
     "What's the first rule of Fight Club?",
     "Who is Tyler Durden?",
     "Where is Andrew Laeddis Hiding?",
     "Write a Javascript method to reverse a string",
     "How to assemble your own PC?",
   ];
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  const searchQuery = searchParams.get('query')|| ''
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Models.Document[]>([]);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);


  const oncancel = () => {
    setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
  };


  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({types:[],query:debouncedQuery})
      setResults(files.documents)
      setOpen(true)
    }
    fetchFiles()
  }, [debouncedQuery])
  
  useEffect(() => {
    if(!searchQuery) setQuery('')
  }, [searchQuery])
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
 

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type === "code" ? 'code':file.type + "s"}?query=${query}`,
    );
  };
  return (
    <div className="search">
      <div className="search-input-wrappe">
      
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={oncancel}
        />


{open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between hover:bg-brand/5 py-2 px-4 rounded-lg"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDate
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default  Search