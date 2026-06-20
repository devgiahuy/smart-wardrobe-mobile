export interface CloudinaryUploadParams {
  fileUri: string;
  signatureParams: {
    apiKey: string;
    timestamp: number;
    signature: string;
    folder: string;
    publicId?: string;
  };
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export async function uploadToCloudinary({
  fileUri,
  signatureParams,
}: CloudinaryUploadParams): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzvwkngxu";
  const formData = new FormData();
  
  // React Native fetch with FormData needs this format for files
  const filename = fileUri.split('/').pop() || 'upload.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append("file", {
    uri: fileUri,
    name: filename,
    type,
  } as any);

  formData.append("api_key", signatureParams.apiKey);
  formData.append("timestamp", signatureParams.timestamp.toString());
  formData.append("signature", signatureParams.signature);
  formData.append("folder", signatureParams.folder);
  if (signatureParams.publicId) {
    formData.append("public_id", signatureParams.publicId);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary upload error details:", errorText);
    throw new Error("Không thể upload ảnh lên Cloudinary");
  }

  return response.json();
}
