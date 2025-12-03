import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface UploadedImage {
  id: number;
  image_url: string;
  effect: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    let token = localStorage.getItem("access_token");

    if (!token) return alert("Not logged in!");

    // Check token expiration
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

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <GalleryContainer>
      <Header>🖼️ My Uploaded Images</Header>

      {loading && <p>Loading...</p>}

      <ImagesGrid>
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}
        {images.map((img) => (
          <ImageCard key={img.id}>
            <PreviewImage src={img.image_url} alt={img.effect} />
            <EffectLabel>{img.effect}</EffectLabel>
            <CreatedAt>{new Date(img.created_at).toLocaleString()}</CreatedAt>
          </ImageCard>
        ))}
      </ImagesGrid>
    </GalleryContainer>
  );
}

// ================= Styled Components ==================

const GalleryContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  color: #1f2937;
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
