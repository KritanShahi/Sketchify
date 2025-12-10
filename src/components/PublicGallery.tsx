import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface UploadedImage {
  id: number;
  image_url: string;
  effect: string;
  name: string;
  created_at: string;
  username: string;
}

export default function PublicGallery() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // For modal
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/auth/public-images/");
      setImages(res.data);
    } catch (err: any) {
      console.error("Fetch error:", err.response || err);
      alert("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filtered images based on search
  let filteredImages = images.filter(
    (img) =>
      img.effect.toLowerCase().includes(search.toLowerCase()) ||
      img.name?.toLowerCase().includes(search.toLowerCase()) ||
      img.username.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting
  filteredImages = filteredImages.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  // Download function
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download image");
    }
  };

  return (
    <GalleryContainer>
      <Header>🌍 Public Gallery</Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search by effect, name, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </SortSelect>
      </Controls>

      {loading && <p>Loading...</p>}

      <ImagesGrid>
        {filteredImages.length === 0 && !loading && <p>No images found.</p>}

        {filteredImages.map((img) => (
          <ImageCard key={img.id} onClick={() => setSelectedImage(img)}>
            <PreviewImage src={img.image_url} alt={img.effect} />
            <EffectLabel>{img.effect}</EffectLabel>
            {img.name && <CreatedAt>Name: {img.name}</CreatedAt>}
            <CreatedAt>By: {img.username}</CreatedAt>
            <CreatedAt>{new Date(img.created_at).toLocaleString()}</CreatedAt>
          </ImageCard>
        ))}
      </ImagesGrid>

      {/* Modal */}
      {selectedImage && (
        <ModalOverlay onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <LargeImage src={selectedImage.image_url} />
            <ModalTitle>{selectedImage.name || selectedImage.effect}</ModalTitle>
            <ModalText>Effect: {selectedImage.effect}</ModalText>
            <ModalText>By: {selectedImage.username}</ModalText>
            <ModalText>{new Date(selectedImage.created_at).toLocaleString()}</ModalText>

            <ModalButtons>
              <ModalButton
                onClick={() =>
                  downloadImage(
                    selectedImage.image_url,
                    `${selectedImage.name || selectedImage.effect}.png`
                  )
                }
              >
                ⬇️ Download
              </ModalButton>
              <CloseButton onClick={() => setSelectedImage(null)}>Close</CloseButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </GalleryContainer>
  );
}

/* ---------- STYLES ---------- */
const GalleryContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.7rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
`;

const SortSelect = styled.select`
  padding: 0.7rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 900px;
`;

const ImageCard = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: scale(1.03);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const EffectLabel = styled.p`
  font-weight: 600;
  margin: 0.5rem 0 0.25rem 0;
  color: #374151;
`;

const CreatedAt = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

/* ---------- MODAL ---------- */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  text-align: center;
`;

const LargeImage = styled.img`
  width: 100%;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.4rem;
  margin: 0.5rem 0;
`;

const ModalText = styled.p`
  font-size: 0.9rem;
  margin: 0.25rem 0;
  color: #4b5563;
`;

const ModalButtons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.6rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background: #1e40af;
  }
`;

const CloseButton = styled(ModalButton)`
  background: #6b7280;

  &:hover {
    background: #4b5563;
  }
`;
