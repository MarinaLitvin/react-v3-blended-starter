import Section from "../Section/Section";
import Container from "../Container/Container";

import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import type { Photo } from "../../types/photo";
import { getPhotos } from "../../services/photos";
import Form from "../../components/Form/Form";
import PhotosGallery from "../../components/PhotosGallery/PhotosGallery";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/Modal";

export default function App() {
  // useEffect(() => {
  //   const getResponse = async () => {
  //     const response = await getPhotos("cat");
  //     console.log(response);
  //   };
  //   getResponse();
  // }, []);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSearch = async (query: string) => {
    setPhotos([]);
    setIsLoading(true);
    setIsError(false);
    setSelectedPhoto(null);

    try {
      const results = await getPhotos(query);

      if (results.length === 0) {
        toast.error("No photos found for your search.");
      }

      setPhotos(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />

          {isLoading && <Loader />}

          {isError && <p>Something went wrong. Please try again.</p>}

          {!isLoading && !isError && (
            <PhotosGallery photos={photos} onSelect={setSelectedPhoto} />
          )}

          {selectedPhoto && (
            <Modal onClose={() => setSelectedPhoto(null)}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </Modal>
          )}
        </Container>
      </Section>
    </>
  );
}
