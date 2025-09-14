import ActionDropdown from "@/components/ActionDropdown";
import StorageGaugeChart from "@/components/Chart";
import FormattedDate from "@/components/FormattedDate";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { cn, convertFileSize, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";



export default async function Home() {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);
  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);
  console.log({usageSummary});
  
  return (
    <div className="dashboard-container">
      <section>

      <StorageGaugeChart percentage={20} />

      <ul className="dashboard-summary-list">
        {usageSummary.map((summary) => (
          <Link
            href={summary.url}
            key={summary.title}
            className="dashboard-summary-card "
          >{/* w-[222px] h-[233px] */}
           {/*  <div className="">
 */}
               <div className="summary-type-icon">
                <div className={cn("rounded-full size-16 bg-green-400 flex justify-center items-center [filter:drop-shadow(0_10px_8px_var(--color-green-200))]",summary.style)}>
                <Image
                src={summary.icon}
                alt={summary.title}
                width={36}
                height={36}
                />
                </div>
              </div> 


              <div className="card-image-mask  ">

                <div className="relative  flex flex-col p-[2.3rem] ">
                  <div className="space-y-4">
                    <div className="flex justify-between gap-3">

                      <h4 className="summary-type-size">
                        {convertFileSize(summary.size) || 0}
                      </h4>
                    </div>

                    <h5 className="summary-type-title">{summary.title}</h5>
                    <Separator className="bg-light-400" />
                    <FormattedDate
                      date={summary.latestDate}
                      className="text-center"
                    />
                  </div>
                </div>

              </div>

            {/* </div> */}

          </Link>
        ))}
      </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDate
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>


    </div>
  );

}

