import Grid from "../Grid/Grid";
import type { Photo } from "../../types/photo";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";

interface PhotosGalleryProps {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
}

export default function PhotosGallery({
  photos,
  onSelect,
}: PhotosGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <Grid>
      {photos.map((photo) => (
        <PhotosGalleryItem
          key={photo.id}
          photo={photo}
          onSelect={() => onSelect(photo)}
        />
      ))}
    </Grid>
  );
}
