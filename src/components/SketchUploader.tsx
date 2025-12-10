import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Gallery from "./Gallery";
import ImageForm from "./ImageForm";

export default function SketchUploader() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [effect, setEffect] = useState("sketch");
  const [quality, setQuality] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [openNameForm, setOpenNameForm] = useState(false);
  const [customName, setCustomName] = useState("");


  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setResult(null);
      setPreview(URL.createObjectURL(file));
      setQuality(null);
      setClassification(null);
      setRecommendation(null);
    }
  };

  const resetAll = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setQuality(null);
    setClassification(null);
    setRecommendation(null);
  };

  const analyzeImage = async () => {
    if (!image) return alert("Please upload an image first!");
    const formData = new FormData();
    formData.append("image", image, image.name); // include name
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/analyze/", formData);
      setQuality(res.data.quality);
      setClassification(res.data.classification);
      setRecommendation(res.data.recommendation);
      setEffect(res.data.recommendation);
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateEffect = async () => {
    if (!image) return alert("Please upload an image first!");
    const formData = new FormData();
    formData.append("image", image, image.name); // include name
    formData.append("effect", effect);
    formData.append("name", customName);

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/sketch/", formData);
      setResult(res.data.image_base64);
    } catch (err: any) {
      alert("Generate failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
      localStorage.setItem("access_token", res.data.access);
      return res.data.access;
    } catch (err) {
      console.error("Refresh failed", err);
      return null;
    }
  };

const uploadImage = async (name: string) => {
  if (!result) return alert("Generate an effect first before uploading!");

  let token = localStorage.getItem("access_token");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      token = await refreshToken();
      if (!token) return alert("Session expired, please login again!");
    }
  } else {
    return alert("Not logged in!");
  }

  // Convert base64 to Blob
  const blob = await (await fetch(result)).blob();
  const file = new File([blob], `${effect}.png`, { type: "image/png" });

  const formData = new FormData();
  formData.append("image", file);
  formData.append("effect", effect);
  formData.append("name", name);

  setLoading(true);
  try {
    await axios.post("http://127.0.0.1:8000/api/auth/upload/", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    alert("Effect-applied image uploaded successfully!");
    resetAll();
    navigate("/gallery"); // <- switch to gallery page here

  } catch (err: any) {
    console.error("Upload error", err.response);
    alert("Upload failed: " + err.response?.data?.detail || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
   
<FullPageContainer>

      
      <Header>🎨 Sketchify</Header>

      <MainContainer>
        <Subtitle>Upload your image and let AI generate the perfect artistic effect.</Subtitle>

        <FileInput type="file" accept="image/*" onChange={handleFile} />

        {preview && (
          <PreviewWrapper>
            <PreviewImage src={preview} alt="Preview" />
          </PreviewWrapper>
        )}
{/*
        <Button type="button" onClick={analyzeImage} disabled={loading || !image}>
          {loading ? "Analyzing..." : "🔍 Analyze Image"}
        </Button>*/}

        {(quality || classification || recommendation) && (
          <AnalysisCard>
            <p><b>Classification:</b> {classification || "N/A"}</p>
            <p><b>Image Quality:</b> {quality || "N/A"}</p>
            <p><b>Recommended Effect:</b> {recommendation || "N/A"}</p>
          </AnalysisCard>
        )}

        <EffectSelector value={effect} onChange={(e) => setEffect(e.target.value)}>
          <option value="sketch">Pencil Sketch</option>
          <option value="cartoon">Cartoon</option>
          <option value="ghibli">Ghibli</option>
          <option value="sobel">Sobel Edge</option>
          <option value="nst">Neural Style Transfer</option>
        </EffectSelector>

        <Button type="button" onClick={generateEffect} disabled={loading || !image}>
          {loading ? "Processing..." : `Generate ${effect}`}
        </Button>
{/*
        <Button type="button" onClick={uploadImage} disabled={loading || !image}>
          {loading ? "Uploading..." : "⬆️ Upload Image"}
        </Button>*/}
        <Button
  type="button"
  onClick={() => setOpenNameForm(true)}
  disabled={loading || !image}
>
  {loading ? "Uploading..." : "⬆️ Upload Image"}
</Button>


{/*}

        <GalleryLink type="button" onClick={() => navigate("/gallery")}>
          🖼️ View My Gallery
        </GalleryLink>

                <GalleryLink type="button" onClick={() => navigate("/public_gallery")}>
          🖼️ Public Gallery
        </GalleryLink>
*/}
        {result && (
          <ResultWrapper>
            <ResultTitle>Result:</ResultTitle>
            <PreviewWrapper>
              <PreviewImage src={result} alt="Result" />
            </PreviewWrapper>
            <ButtonRow>
              <DownloadButton href={result} download={`${effect}.png`}>⬇️ Download</DownloadButton>
              <ResetButton type="button" onClick={resetAll}>Upload Another</ResetButton>
            </ButtonRow>
          </ResultWrapper>
        )}
      </MainContainer>
<ImageForm
  open={openNameForm}
  onClose={() => setOpenNameForm(false)}
  onSubmit={(name) => {
    setCustomName(name);
    setOpenNameForm(false);
    uploadImage(name);
  }}
/>


    </FullPageContainer>
  );
}

// ================= Styled Components ==================

const FullPageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9fafb;
  padding: 2rem;
`;

const Header = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 2rem;
  color: #1f2937;
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled.p`
  margin-bottom: 1.5rem;
  color: #4b5563;
  text-align: center;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
`;

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  max-height: 320px;
  margin-bottom: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #ffffff;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  margin: 0.5rem 0;
  border-radius: 1rem;
  font-weight: 600;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover { background: #222; }
  &:disabled { background: #555; cursor: not-allowed; }
`;

const AnalysisCard = styled.div`
  width: 100%;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  text-align: left;
  color: #374151;
`;

const EffectSelector = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ResultWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const ResultTitle = styled.h2`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const DownloadButton = styled.a`
  padding: 0.5rem 1rem;
  background: #000;
  color: #fff;
  border-radius: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;

  &:hover { background: #222; }
`;

const ResetButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;

  &:hover { background: #d1d5db; }
`;

const GalleryLink = styled.button`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 1rem;
  font-weight: 600;
  background: #10b981;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover { background: #059669; }
`;
