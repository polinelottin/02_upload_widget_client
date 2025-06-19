import axios from "axios";

interface UploadFileToStorageParams {
  file: File;
  onProgress: (sizeInBytes: number) => void;
}

interface UploadFilesToStorageOptions {
  signal: AbortSignal;
}

export async function uploadFilesToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  opts?: UploadFilesToStorageOptions
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{ url: string }>(
    "http://localhost:3333/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: opts?.signal,
      onUploadProgress(progressEvent) {
        onProgress(progressEvent.loaded);
      },
    }
  );

  return { url: response.data.url };
}