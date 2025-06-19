import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadFilesToStorage } from "../http/upload-files-to-storage";
import { CanceledError } from "axios";
import { useShallow } from "zustand/shallow";
import { compressImage } from "../utils/compress-image";

export type Upload = {
  name: string;
  file: File;
  abortController: AbortController;
  status: "progress" | "success" | "error" | "canceled";
  originalSizeInBytes: number;
  uploadSizeInBytes: number;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [["zustand/immer", never]]>(immer((set, get) => {
  function updateUpload(uploadId: string, data: Partial<Upload>) {
    const upload = get().uploads.get(uploadId);

    if (!upload) {
      return;
    }

    set((state) => {
      state.uploads.set(uploadId, {
        ...upload,
        ...data,
      });
    });
  }

  async function processUpload(uploadId: string) {
    const upload = get().uploads.get(uploadId);

    if (!upload) return;

    const compressedFile = await compressImage({
      file: upload.file,
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.5,
    });

    try {
      await uploadFilesToStorage(
        { 
          file: compressedFile,
          onProgress(sizeInBytes) {
            updateUpload(uploadId, {
              uploadSizeInBytes: sizeInBytes,
            });
          }
         },
        { signal: upload.abortController.signal }
      );

      updateUpload(uploadId, {
        status: "success",
      });
    } catch (error) {
      if (error instanceof CanceledError) {
        updateUpload(uploadId, {
            status: "canceled",
        });
      } else {
        updateUpload(uploadId, {
          status: "error",
        });
      }
    }
  }

  const cancelUpload = (uploadId: string) => {
    const upload = get().uploads.get(uploadId);

    if (!upload) return;

    upload.abortController.abort();
  };

  const addUploads = (files: File[]) => {
    files.forEach((file) => {
      const uploadId = crypto.randomUUID();
      const abortController = new AbortController();

      const upload: Upload = {
        name: file.name,
        file,
        abortController,
        status: "progress",
        originalSizeInBytes: file.size,
        uploadSizeInBytes: 0,
      };

      set((state) => {
        state.uploads.set(uploadId, upload);
      });

      processUpload(uploadId);
    });
    
  };

  return {
    uploads: new Map<string, Upload>(),
    addUploads,
    cancelUpload,
  };
}));

export const usePendingUploads = () => {
  return useUploads(
    useShallow(store => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        (upload) => upload.status === "progress"
      );

      if (!isThereAnyPendingUploads) {
        return { isThereAnyPendingUploads, globalPercentage: 100 };
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          acc.total += upload.originalSizeInBytes;
          acc.uploaded += upload.uploadSizeInBytes;

          return acc;
        },
        { total: 0, uploaded: 0 }
      );

      const globalPercentage = Math.min(
        Math.round((uploaded * 100) / total),
        100
      );

      return { isThereAnyPendingUploads, globalPercentage };
    })
  )
}