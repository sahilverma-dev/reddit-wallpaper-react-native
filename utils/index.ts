import * as FileSystem from "expo-file-system";
import { Platform, Share } from "react-native";

export const saveImageFromURL = async (url: string, filename: string) => {
  try {
    const downloadDir = FileSystem.cacheDirectory + "Downloads/";
    await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

    const fileUri = downloadDir + filename + ".jpg";

    const downloadedImage = await FileSystem.downloadAsync(url, fileUri);
    if (downloadedImage.status === 200) {
      // Image successfully downloaded and saved
      console.log("Image saved:", downloadedImage.uri);

      if (Platform.OS === "android") {
        // For Android, use the Share API to notify the media scanner
        Share.share({ url: downloadedImage.uri });
      } else {
        // For iOS, the image will automatically appear in the device's Photos app
        // You can also use the Share API for consistency across platforms
        Share.share({ url: downloadedImage.uri });
      }
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
