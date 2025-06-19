import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadFilesToStorage } from "../http/upload-files-to-storage";

export type Upload = {
  name: string;
  file: File;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [["zustand/immer", never]]>(immer((set, get) => {
  async function processUpload(uploadId: string) {
    const upload = get().uploads.get(uploadId);

    if (!upload) return;

    await uploadFilesToStorage({ file: upload.file });
  }

  const addUploads = (files: File[]) => {
    files.forEach((file) => {
      const uploadId = crypto.randomUUID();

      const upload = {
        name: file.name,
        file,
      };

      set((state) => {
        state.uploads.set(uploadId, upload)
      });

      processUpload(uploadId);
    });
    
  };

  return {
    uploads: new Map<string, Upload>(),
    addUploads,
  };
}));