import * as Progress from "@radix-ui/react-progress";
import { motion } from "motion/react";

import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { useUploads, type Upload } from "../store/uploads";
import { formatBytes } from "../utils/format-bytes";
import { downloadUrl } from "../utils/download-url";

interface UploadWidgetUploadItemProps {
  uploadId: string;
  upload: Upload;
}

export function UploadWidgetUploadItem({ uploadId, upload }: UploadWidgetUploadItemProps) {
  const { name, uploadSizeInBytes, originalSizeInBytes, compressedSizeInBytes } = upload;
  const cancelUpload = useUploads(store => store.cancelUpload);
  const retryUpload = useUploads((store) => store.retryUpload);

  const progress = Math.min(
    compressedSizeInBytes 
      ? Math.round((uploadSizeInBytes * 100) / compressedSizeInBytes)
      : 0,
    100
  );

  return (
    <motion.div
      className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
          <span className="max-w-[180px] truncate">{name}</span>
        </span>

        <span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
          <span className="line-through">
            {formatBytes(originalSizeInBytes)}
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          {compressedSizeInBytes && (
            <span className="flex items-center gap-1" >
              {formatBytes(compressedSizeInBytes)}
              <span className="text-green-400 ml-1">
                -
                  {Math.round(
                    ((originalSizeInBytes - compressedSizeInBytes) *
                      100) /
                      originalSizeInBytes
                  )}
                %
              </span>
            </span>
          )}
          <div className="size-1 rounded-full bg-zinc-700" />

          {["sucess", "progress"].includes(upload.status) && <span>{progress}</span>}
          {upload.status === "error" && (
            <span className="text-red-400">Error</span>
          )}
          {upload.status === "canceled" && (
            <span className="text-yellow-400">Canceled</span>
          )}
        </span>
      </div>

      <Progress.Root
        data-status={upload.status}
        className="group bg-zinc-800 rounded-full h-1 overflow-hidden"
      >
        <Progress.Indicator
          className="bg-indigo-500 h-1 group-data-[status=success]:bg-green-500 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-yellow-400"
          style={{ width: upload.status === "progress" ? `${progress}%` : "100%" }}
        />
      </Progress.Root>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button
          size="icon-sm"
          aria-disabled={!upload.remoteUrl}
          onClick={() => {
            if (upload.remoteUrl) {
              downloadUrl(upload.remoteUrl);
            }
          }}
        >
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button
          size="icon-sm"
          disabled={!upload.remoteUrl}
          onClick={() => {
            upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl);
          }}
        >
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button
          size="icon-sm"
          disabled={!["canceled", "error"].includes(upload.status)}
          onClick={() => retryUpload(uploadId)}
        >
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button
          size="icon-sm"
          disabled={upload.status !== "progress"}
          onClick={() => cancelUpload(uploadId)}
        >
          <X className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
      
    </motion.div>
  )
}