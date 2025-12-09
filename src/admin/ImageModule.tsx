import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface UploadedImage {
  id: number;
  image_url: string;
  effect: string;
  created_at: string;
  username: string;
}

export default function MyGallery() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  const currentUsername = localStorage.getItem("username");

  console.log(isAdmin,currentUsername);

  const fetchImages = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");
    if (!token) return alert("Not logged in!");

    // refresh token if expired
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
          token = res.data.access;
          localStorage.setItem("access_token", token);
        } catch {
          return alert("Session expired, please login again!");
        }
      } else {
        return alert("Session expired, please login again!");
      }
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/auth/public-images/", {
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
/*
const deleteImage = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this image?")) return;

  let token = localStorage.getItem("access_token");
  if (!token) return alert("No access token found. Please login again.");

  // refresh token if expired
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.exp * 1000 < Date.now()) {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
        token = res.data.access;
        localStorage.setItem("access_token", token);
      } catch {
        return alert("Session expired, please login again!");
      }
    } else {
      return alert("Session expired, please login again!");
    }
  }

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
*/

const deleteImage = async (id: number, imgUsername: string) => {
  if (!window.confirm("Are you sure you want to delete this image?")) return;

  let token = localStorage.getItem("access_token");
  if (!token) return alert("No access token found. Please login again.");

  // Refresh token if expired
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.exp * 1000 < Date.now()) {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
        token = res.data.access;
        localStorage.setItem("access_token", token);
      } catch {
        return alert("Session expired, please login again!");
      }
    } else {
      return alert("Session expired, please login again!");
    }
  }

  // Permission check
  if (!isAdmin && imgUsername !== currentUsername) {
    return alert("You do not have permission to delete this image.");
  }

  try {
    const url = isAdmin
      ? `http://127.0.0.1:8000/api/auth/delete-public-image/${id}/`
      : `http://127.0.0.1:8000/api/auth/delete-image/${id}/`;

    await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setImages(images.filter((img) => img.id !== id));
    alert("Image deleted!");
  } catch (err: any) {
    console.error("Delete error:", err.response || err);
    alert("Failed to delete image");
  }
};


useEffect(() => {
    fetchImages();
  }, []);



  return (
    <PageContainer>
    <GalleryContainer>
        <Header>🖼️ Image Gallery</Header>
        {loading && <Message>Loading...</Message>}
        <ImagesGrid>
          {images.length === 0 && !loading && <Message>No images found.</Message>}
          {images.map((img) => {
   const canDelete = isAdmin || img.username === currentUsername;


            return (
              <ImageCard key={img.id}>
                <PreviewImage src={img.image_url} alt={img.effect} onClick={() => setModalImage(img.image_url)} />
                <EffectLabel>{img.effect}</EffectLabel>
                <CreatedAt>By: {img.username}</CreatedAt>
                <CreatedAt>{new Date(img.created_at).toLocaleString()}</CreatedAt>
                <Actions>
                  {canDelete && <DeleteButton onClick={() => deleteImage(img.id, img.username)}>🗑️ Delete</DeleteButton>}
                  <ViewButton onClick={() => setModalImage(img.image_url)}>👁️ View</ViewButton>
                </Actions>
              </ImageCard>
            );
          })}
        </ImagesGrid>
      </GalleryContainer>

      {/* Modal */}
      {modalImage && (
        <ModalOverlay onClick={() => setModalImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setModalImage(null)}>⬅️ Back</CloseButton>
            <ModalImage src={modalImage} alt="Preview" />
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

// ================= Styled Components ==================

const PageContainer = styled.div`
  min-height: 100vh;

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
  margin-bottom: 2rem;
  color: #1f2937;
  text-align: center;
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
  cursor: pointer;
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

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const DeleteButton = styled.button`
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

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1e40af;
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #374151;
`;

// ================= Modal ==================

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 0.5rem;
`;

const CloseButton = styled.button`
  align-self: flex-start;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #1e40af; }
`;
