import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QualityDetection() {
  const [image, setImage] = useState<File | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setQuality(null);
    }
  };

  const detectQuality = async () => {
    if (!image) return alert("Upload an image first!");
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/quality/", formData);
      setQuality(res.data.quality);
    } catch (err: any) {
      alert("Detection failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <h1 className="text-3xl font-bold mb-4">🌫️ Image Quality Detection</h1>

      <input type="file" accept="image/*" onChange={handleFile} className="mb-4 p-2 border rounded-lg" />

      <button
        onClick={detectQuality}
        disabled={loading || !image}
        className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {loading ? "Detecting..." : "Detect Image Quality"}
      </button>

      {quality && <p className="text-xl font-semibold">Result: {quality}</p>}

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back Home
      </button>
    </div>
  );
}
