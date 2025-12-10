import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface Image {
  id: number;
  effect: string;
  image_url: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface Props {
  token: string | null;
}

export default function DashboardModule({ token }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topEffects, setTopEffects] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userImages, setUserImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const imagesRes = await axios.get(
          "http://127.0.0.1:8000/api/auth/public-images/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImages(imagesRes.data);

        const usersRes = await axios.get(
          "http://127.0.0.1:8000/api/auth/users/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(usersRes.data);

        const effectCount: Record<string, number> = {};
        imagesRes.data.forEach((img: Image) => {
          if (img.effect) {
            effectCount[img.effect] = (effectCount[img.effect] || 0) + 1;
          }
        });

        const sortedEffects = Object.entries(effectCount)
          .sort((a, b) => b[1] - a[1])
          .map(([effect]) => effect);

        setTopEffects(sortedEffects.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const fetchUserImages = async (user: User) => {
    setSelectedUser(user);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/auth/user-images/${user.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Module>
      <h1>📊 Dashboard</h1>

      {/* Top Stats */}
      <Stats>
        <StatCard>
          <h2>{images.length}</h2>
          <p>Total Images</p>
        </StatCard>
        <StatCard>
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </StatCard>
        <StatCard>
          <h2>{topEffects.join(", ") || "None"}</h2>
          <p>Top Effects</p>
        </StatCard>
      </Stats>

      {/* Users Section */}
      <UsersSection>
        <SearchInput
          type="text"
          placeholder="Search User by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <UserList>
          {filteredUsers.map((u) => (
            <UserItem
              key={u.id}
              onClick={() => fetchUserImages(u)}
              active={selectedUser?.id === u.id}
            >
              <strong>{u.username}</strong>
              <small>{u.email}</small>
            </UserItem>
          ))}
        </UserList>

        {filteredUsers.length === 0 && <NoUsers>No users found.</NoUsers>}
      </UsersSection>

      {/* Selected User Images */}
      {selectedUser && (
        <>
          <SelectedUserTitle>
            Images uploaded by: <b>{selectedUser.username}</b>
          </SelectedUserTitle>

          <ImageGrid>
            {userImages.length === 0 ? (
              <NoUsers>No images uploaded.</NoUsers>
            ) : (
              userImages.map((img) => (
                <ImageCard key={img.id}>
                  <img src={img.image_url} alt="" />
                  <p>{img.effect}</p>
                </ImageCard>
              ))
            )}
          </ImageGrid>
        </>
      )}
    </Module>
  );
}

/* ---------- STYLES ---------- */

const Module = styled.div`
  padding: 1.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 150px;
  text-align: center;
  padding: 1.2rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
`;

const UsersSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const UserItem = styled.div<{ active?: boolean }>`
  padding: 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ active }) => (active ? "#0ea5e9" : "#e2e8f0")};
  background: ${({ active }) => (active ? "#e0f2fe" : "#ffffff")};
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }

  strong {
    display: block;
    font-size: 1rem;
  }

  small {
    font-size: 0.85rem;
    color: #64748b;
  }
`;

const SelectedUserTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const ImageGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const ImageCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 0.7rem;
  text-align: center;
  border: 1px solid #e5e7eb;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 0.75rem;
  }

  p {
    margin-top: 0.5rem;
    color: #475569;
  }
`;

const NoUsers = styled.p`
  text-align: center;
  color: #6b7280;
`;
