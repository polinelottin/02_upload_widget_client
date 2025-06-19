import axios from "axios";

interface UploadFileToStorageParams {
  file: File;
}

interface UploadFilesToStorageOptions {
  signal: AbortSignal;
}

export async function uploadFilesToStorage(
  { file }: UploadFileToStorageParams,
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
    }
  );

  return { url: response.data.url };
}