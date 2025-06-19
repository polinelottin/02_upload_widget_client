import axios from "axios";

interface UploadFileToStorageParams {
  file: File;
}

export async function uploadFilesToStorage({ file }: UploadFileToStorageParams) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{ url: string }>(
    "http://localhost:3333/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return { url: response.data.url };
}