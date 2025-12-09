import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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

export default function UserModule({ token }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/auth/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        console.log("Fetched users:", res.data);
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
      {users.length === 0 && <NoUsers>No users found.</NoUsers>}
      <Grid>
        {users.map((u) => (
          <Card key={u.id}>
            <Username>{u.username}</Username>
            <Email>{u.email}</Email>
            <Roles>
              {u.is_superuser && <RoleBadge>Admin</RoleBadge>}
              {u.is_staff && !u.is_superuser && <RoleBadge>Staff</RoleBadge>}
              {!u.is_staff && !u.is_superuser && <RoleBadge>User</RoleBadge>}
            </Roles>
            <Actions>
              <DeleteButton onClick={() => handleDeleteUser(u.id)}>
                Delete
              </DeleteButton>
            </Actions>
          </Card>
        ))}
      </Grid>
    </Module>
  );
}

// ================= Styled Components =================

const Module = styled.div`
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160px;
`;

const Username = styled.p`
  font-weight: 700;
  font-size: 1.1rem;
  color: #374151;
`;

const Email = styled.p`
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Roles = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RoleBadge = styled.span`
  background: #3b82f6;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Actions = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: #fff;
  padding: 0.4rem 0.7rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background: #b91c1c;
  }
`;

const NoUsers = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #6b7280;
`;
