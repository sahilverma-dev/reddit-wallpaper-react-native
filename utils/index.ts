import * as FileSystem from "expo-file-system";

export const saveImageFromURL = async (url: string, filename: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;

    const downloadedImage = await FileSystem.downloadAsync(url, fileUri);
    if (downloadedImage.status === 200) {
      // Image successfully downloaded and saved
      console.log("Image saved:", downloadedImage.uri);
    } else {
      // Error downloading image
      console.log("Failed to save image");
    }
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

export const redditImageURL = (url: string) =>
  url ? url.replaceAll("&amp;", "&") : null;
