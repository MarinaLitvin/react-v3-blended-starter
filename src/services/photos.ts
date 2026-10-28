import axios from "axios";
import type { Photo } from "../types/photo";

interface PhotosResponse {
  photos: Photo[];
}

axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] =
  import.meta.env.VITE_PIXEL_API_KEY;
axios.defaults.params = {
  orientation: "landscape",
};

export const getPhotos = async (query: string): Promise<Photo[]> => {
  const response = await axios.get<PhotosResponse>(`search?query=${query}`);

  return response.data.photos;
};
