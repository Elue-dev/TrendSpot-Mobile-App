import { CLOUD_NAME, UPLOAD_PRESET } from "../utils";

export async function uploadImageToCloud(image: string) {
  console.log("UPLOADING...");
  let imageUrl;
  try {
    if (image) {
      const img = new FormData();
      // @ts-ignore
      img.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
      img.append("cloud_name", CLOUD_NAME);
      img.append("upload_preset", UPLOAD_PRESET);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: img }
      );

      const imageData = await response.json();
      imageUrl = imageData?.secure_url?.toString();
      console.log("Image uploaded successfully:", imageUrl);
      return imageUrl;
    } else {
      console.log("Missing Image", "No image selected.");
    }
  } catch (error: any) {
    console.log(error);
    console.log(error.response?.data?.message);
  }
}
