import { useUploads } from "../store/uploads";
import { UploadWidgetUploadItem } from "./upload-widget-upload-item";

export function UploadWidgetUploadList() {
  const uploads = useUploads((store) => store.uploads);
  const isUploadingListEmpty = uploads.size === 0;
  
  return (
    <div className="px-3 flex flex-col gap-3">
       <span className="text-xs font-medium">
        Uploaded files <span className="text-zinc-400">({uploads.size})</span>
      </span>

      {isUploadingListEmpty ? (
        <span className="text-xs text-zinc-400">No uploads added yet</span>
      ) : (
        <div className="flex flex-col gap-2">
          {Array.from(uploads).map(([uploadId, upload]) => (
            <UploadWidgetUploadItem key={uploadId} upload={upload} />
          ))}
        </div>
      )}
    </div>
  )
}