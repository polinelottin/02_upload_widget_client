import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadFilesToStorage } from "../http/upload-files-to-storage";
import { CanceledError } from "axios";

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
  async function processUpload(uploadId: string) {
    const upload = get().uploads.get(uploadId);

    if (!upload) return;

    try {
      await uploadFilesToStorage(
        { 
          file: upload.file,
          onProgress(sizeInBytes) {
            set((state) => {
              state.uploads.set(uploadId, {
                ...upload,
                uploadSizeInBytes: sizeInBytes,
              });
            });
          }
         },
        { signal: upload.abortController.signal }
      );

      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          status: "success",
        })
      });
    } catch (error) {
      if (error instanceof CanceledError) {
        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: "canceled",
          });
        });
      } else {
        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: "error",
          });
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