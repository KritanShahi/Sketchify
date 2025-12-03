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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const imagesRes = await axios.get(
          "http://127.0.0.1:8000/api/uploaded-images/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImages(imagesRes.data);

        const usersRes = await axios.get(
          "http://127.0.0.1:8000/api/users/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersRes.data);
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
          <h2>{Math.max(...images.map((img) => img.effect.length), 0)}</h2>
          <p>Top Effect Length</p>
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
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  p {
    color: #6b7280;
  }
`;
