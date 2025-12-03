import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Props {
  token: string | null;
}

export default function UserModule({ token }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    // Optional: call backend API to delete
  };

  return (
    <Module>
      <h1>👥 Users</h1>
      {users.map((u) => (
        <Card key={u.id}>
          <p><b>Username:</b> {u.username}</p>
          <p><b>Email:</b> {u.email}</p>
          <Actions>
            <DeleteButton onClick={() => handleDeleteUser(u.id)}>Delete</DeleteButton>
          </Actions>
        </Card>
      ))}
      {users.length === 0 && <p>No users found.</p>}
    </Module>
  );
}

const Module = styled.div``;
const Card = styled.div`
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
`;
const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;
const DeleteButton = styled.button`
  flex: 1;
  background: #ef4444;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  &:hover {
    background: #b91c1c;
  }
`;
