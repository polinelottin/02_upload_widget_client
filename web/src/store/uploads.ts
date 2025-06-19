import { create } from "zustand";

export type Upload = {
  name: string;
  file: File;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
};

export const useUploads = create<UploadState>((set, get) => {
  const addUploads = (files: File[]) => {
    files.forEach((file) => {
      const uploadId = crypto.randomUUID();

      const upload = {
        name: file.name,
        file,
      };

      set((state) => ({
        uploads: state.uploads.set(uploadId, upload),
      }));
    });
    
  };

  return {
    uploads: new Map<string, Upload>(),
    addUploads,
  };
});