import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Classification() {
  const [image, setImage] = useState<File | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setClassification(null);
    }
  };

  const classifyImage = async () => {
    if (!image) return alert("Upload an image first!");
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/classify/", formData);
      setClassification(res.data.classification);
    } catch (err: any) {
      alert("Classification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-4">🖼️ Image Classification</h1>

      <input type="file" accept="image/*" onChange={handleFile} className="mb-4 p-2 border rounded-lg" />

      <button
        onClick={classifyImage}
        disabled={loading || !image}
        className="mb-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
      >
        {loading ? "Classifying..." : "Classify Image"}
      </button>

      {classification && <p className="text-xl font-semibold">Result: {classification}</p>}

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back Home
      </button>
    </div>
  );
}
