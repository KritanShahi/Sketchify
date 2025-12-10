import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface UploadedImage {
  id: number;
  image_url: string;
  effect: string;
  created_at: string;
  username: string;
  name: string;
}

export default function MyGallery() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal & edit state
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [newName, setNewName] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");
    if (!token) return alert("Not logged in!");

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
          token = res.data.access;
          localStorage.setItem("access_token", token);
        } catch (err) {
          return alert("Session expired, please login again!");
        }
      } else {
        return alert("Session expired, please login again!");
      }
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/auth/uploaded-images/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data);
    } catch (err: any) {
      console.error("Fetch error:", err.response || err);
      alert("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    const token = localStorage.getItem("access_token");
    if (!token) return alert("No access token found. Please login again.");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/auth/delete-image/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(images.filter((img) => img.id !== id));
      alert("Image deleted!");
    } catch (err: any) {
      console.error("Delete error:", err.response || err);
      alert("Failed to delete image");
    }
  };

  const saveName = async () => {
    if (!selectedImage) return;
    const token = localStorage.getItem("access_token");
    if (!token) return alert("No access token found. Please login again.");

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/auth/update-image-name/${selectedImage.id}/`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImages(images.map(img => img.id === selectedImage.id ? { ...img, name: newName } : img));
      setSelectedImage({ ...selectedImage, name: newName });
      alert("Name updated!");
    } catch (err: any) {
      console.error("Update error:", err.response || err);
      alert("Failed to update name");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = images.filter(
    (img) =>
      img.name?.toLowerCase().includes(search.toLowerCase()) ||
      img.effect.toLowerCase().includes(search.toLowerCase()) ||
      img.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <GalleryContainer>
        <Header>🖼️ My Uploaded Images</Header>

        <SearchInput
          type="text"
          placeholder="Search by name, effect, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Loading...</p>}

        <ImagesGrid>
          {filteredImages.length === 0 && !loading && <p>No images found.</p>}
          {filteredImages.map((img) => (
            <ImageCard key={img.id} onClick={() => { setSelectedImage(img); setNewName(img.name); }}>
              <PreviewImage src={img.image_url} alt={img.effect} />
              <CreatedAt><b>Name:</b> {img.name}</CreatedAt>
              <EffectLabel>{img.effect}</EffectLabel>
              <CreatedAt>By: {img.username}</CreatedAt>
              <CreatedAt>{new Date(img.created_at).toLocaleString()}</CreatedAt>
              <DeleteButton onClick={(e) => { e.stopPropagation(); deleteImage(img.id); }}>🗑️ Delete</DeleteButton>
            </ImageCard>
          ))}
        </ImagesGrid>
      </GalleryContainer>

      {/* ---------- MODAL ---------- */}
      {selectedImage && (
        <ModalOverlay onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <LargeImage src={selectedImage.image_url} />
            <ModalTitle>Edit Name</ModalTitle>
            <NameInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <SaveButton onClick={saveName}>💾 Save</SaveButton>
            <CloseButton onClick={() => setSelectedImage(null)}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

// ================= Styled Components ==================

const PageContainer = styled.div`
  min-height: 100vh;
  width:100vw;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
`;

const GalleryContainer = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 1200px;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
`;

const Header = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #1f2937;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.7rem 1rem;
  margin: 1rem auto 2rem;
  display: block;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const EffectLabel = styled.p`
  font-weight: 600;
  margin: 0.25rem 0;
  color: #374151;
`;

const CreatedAt = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const DeleteButton = styled.button`
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #b91c1c;
  }
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.65);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:20;
`;

const ModalContent = styled.div`
  background:white;
  padding:1.5rem;
  border-radius:1rem;
  width:90%;
  max-width:500px;
  text-align:center;
`;

const LargeImage = styled.img`
  width:100%;
  border-radius:1rem;
  margin-bottom:1rem;
`;

const ModalTitle = styled.h2`
  font-size:1.4rem;
  margin:0.5rem 0;
`;

const NameInput = styled.input`
  width: 80%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border:1px solid #d1d5db;
  border-radius:0.5rem;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background:#2563eb;
  color:white;
  border:none;
  border-radius:0.5rem;
  margin-right: 0.5rem;
  cursor:pointer;
  &:hover {
    background:#1e40af;
  }
`;

const CloseButton = styled(SaveButton)`
  background:#6b7280;
  &:hover { background:#4b5563; }
`;
