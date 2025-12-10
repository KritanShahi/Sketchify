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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/auth/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <Module>
      <h1>👥 Users</h1>

      {/* Search Bar */}
      <SearchInput
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 && <NoUsers>No users found.</NoUsers>}

      <UserList>
        {filteredUsers.map((u) => (
          <UserRow key={u.id}>
            <Info>
              <Username>{u.username}</Username>
              <Email>{u.email}</Email>
            </Info>

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
          </UserRow>
        ))}
      </UserList>
    </Module>
  );
}

/* ------------------- Styles ------------------- */

const Module = styled.div``;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const NoUsers = styled.p`
  text-align: center;
  color: #6b7280;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserRow = styled.div`
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
`;

const Info = styled.div``;

const Username = styled.h2`
  font-size: 1.2rem;
`;

const Email = styled.p`
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const Roles = styled.div``;

const RoleBadge = styled.span`
  background: #e0f2fe;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #0369a1;
`;

const Actions = styled.div``;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;
