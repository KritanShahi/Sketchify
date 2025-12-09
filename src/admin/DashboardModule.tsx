import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface Image {
  id: number;
  effect: string;
}

interface User {
  id: number;
}

interface Props {
  token: string | null;
}

export default function DashboardModule({ token }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topEffects, setTopEffects] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        // Fetch images
        const imagesRes = await axios.get(
          "http://127.0.0.1:8000/api/auth/uploaded-images/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImages(imagesRes.data);

        // Fetch users
        const usersRes = await axios.get(
          "http://127.0.0.1:8000/api/auth/users/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersRes.data);

        // Calculate most used effects
        const effectCount: Record<string, number> = {};
        imagesRes.data.forEach((img: Image) => {
          if (img.effect) {
            effectCount[img.effect] = (effectCount[img.effect] || 0) + 1;
          }
        });

        // Sort effects by count descending
        const sortedEffects = Object.entries(effectCount)
          .sort((a, b) => b[1] - a[1])
          .map(([effect]) => effect);

        setTopEffects(sortedEffects.slice(0, 3)); // show top 3 effects
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Module>
      <h1>📊 Dashboard</h1>
      <Stats>
        <StatCard>
          <h2>{images.length}</h2>
          <p>Images Uploaded</p>
        </StatCard>
        <StatCard>
          <h2>{users.length}</h2>
          <p>Users</p>
        </StatCard>
        <StatCard>
          <h2>{topEffects.join(", ") || "None"}</h2>
          <p>Top Effects</p>
        </StatCard>
      </Stats>
    </Module>
  );
}

const Module = styled.div``;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 1rem;
  flex: 1;
  text-align: center;
  border: 1px solid #e5e7eb;
  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
  }
  p {
    color: #6b7280;
  }
`;
