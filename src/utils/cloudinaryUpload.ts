export interface UploadResult {
  success: true;
  data: {
    secure_url: string;
    public_id: string;
  };
}

export interface UploadError {
  success: false;
  error: string;
}

export type UploadResponse = UploadResult | UploadError;

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUD_PRESET || "your_upload_preset";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME || "your_cloud_name";


export async function uploadToCloudinary(
  file: File,
  folderName?: string
): Promise<UploadResponse> {

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    if (folderName) {
      formData.append("folder", folderName);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        success: false,
        error: `Upload failed with status ${response.status}: ${errorBody}`,
      };
    }

    const data = await response.json();

    if (!data.secure_url || !data.public_id) {
      return {
        success: false,
        error: "Cloudinary response missing required fields.",
      };
    }

    return {
      success: true,
      data: {
        secure_url: data.secure_url,
        public_id: data.public_id,
      },
    };
  } catch (err: unknown) {
    console.error("Cloudinary upload error:", err);
    return {
      success: false,
      error:
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Unknown error during upload.",
    };
  }
}
