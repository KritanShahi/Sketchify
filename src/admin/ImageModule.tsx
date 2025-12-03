import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface Props {
  token: string;
}

interface Image {
  id: number;
  image_url: string;
  effect: string;
  created_at: string;
}

export default function ImageModule({ token }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("👀 ImageModule useEffect triggered, token:", token);
    console.log("Token =",token);
    if (!token) {
      console.log("⛔ No token provided, skipping fetch.");
      setError("No access token found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      console.log("📡 Fetching images from backend...");
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/auth/uploaded-images/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Fetch success:", res.data);

        setImages(res.data);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);

        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized. Token may be invalid or expired.");
          } else if (err.response.status === 404) {
            setError("API endpoint not found.");
          } else {
            setError("Error fetching images: " + err.response.statusText);
          }
        } else {
          setError("Network error or server not reachable.");
        }
      } finally {
        setLoading(false);
        console.log("⏳ Fetch completed.");
      }
    };

    fetchImages();
  }, [token]);

  if (loading) return <Message>Loading images...</Message>;
  if (error) return <Message style={{ color: "red" }}>{error}</Message>;
  if (images.length === 0) return <Message>No images uploaded yet.</Message>;

  return (
    <Module>
      <h1>🖼️ Uploaded Images</h1>
      <Grid>
        {images.map((img) => (
          <Card key={img.id}>
            <img
              src={img.image_url}
              alt="Uploaded"
              width="200"
              style={{ borderRadius: "0.5rem" }}
            />
            <p><b>Effect:</b> {img.effect}</p>
            <p><b>Uploaded:</b> {new Date(img.created_at).toLocaleString()}</p>
          </Card>
        ))}
      </Grid>
    </Module>
  );
}

// ================= Styled Components ==================

const Module = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #374151;
`;
