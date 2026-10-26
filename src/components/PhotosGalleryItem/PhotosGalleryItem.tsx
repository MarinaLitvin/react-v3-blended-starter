import GridItem from "../GridItem/GridItem";
import type { Photo } from "../../types/photo";
import styles from "./PhotosGalleryItem.module.css";

interface PhotosGalleryItemProps {
  photo: Photo;
  onSelect: () => void;
}

export default function PhotosGalleryItem({
  photo,
  onSelect,
}: PhotosGalleryItemProps) {
  const { avg_color, alt, src } = photo;

  return (
    <GridItem>
      <div
        className={styles.thumb}
        style={{
          backgroundColor: avg_color,
          borderColor: avg_color,
        }}
      >
        <img src={src.large} alt={alt} onClick={onSelect} />
      </div>
    </GridItem>
  );
}
