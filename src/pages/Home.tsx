import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HomePage from "../components/SketchUploader";
import MyGallery from "../components/Gallery";
import PublicGallery from "../components/PublicGallery";
import Logout from "../pages/Logout";

export default function AppLayout() {
  const [currentPage, setCurrentPage] = useState<"home" | "mygallery" | "publicgallery" | "logout">("home");
  const [username, setUsername] = useState<string>("");

useEffect(() => {
  const storedUsername = localStorage.getItem("username");

  if (storedUsername) {
    setUsername(storedUsername);
  } else {
    setUsername("User");
  }
}, []);

useEffect(() => {
  const saved = localStorage.getItem("username");
  setUsername(saved || "User");
}, []);




  return (
    <LayoutContainer>
      {/* TOP NAVBAR */}
      <TopBar>
        <Logo>Sketchify</Logo>
        <NavLinks>
          <NavButton $active={currentPage === "home"} onClick={() => setCurrentPage("home")}>Home</NavButton>
          <NavButton $active={currentPage === "mygallery"} onClick={() => setCurrentPage("mygallery")}>My Gallery</NavButton>
          <NavButton $active={currentPage === "publicgallery"} onClick={() => setCurrentPage("publicgallery")}>Public Gallery</NavButton>
        </NavLinks>
  <UserSection>
  <UserAvatar>{username ? username[0].toUpperCase() : "U"}</UserAvatar>
  <span><b>{username}</b></span>
  <LogoutButton onClick={() => setCurrentPage("logout")}>Logout</LogoutButton>
</UserSection>

      </TopBar>

      {/* MAIN CONTENT */}
      <MainContent>
        {currentPage === "home" && <HomePage />}
        {currentPage === "mygallery" && <MyGallery />}
        {currentPage === "publicgallery" && <PublicGallery />}
        {currentPage === "logout" && <Logout />}
      </MainContent>
    </LayoutContainer>
  );
}

/* ================= STYLES ================= */

const LayoutContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TopBar = styled.div`
  height: 70px;
  background: linear-gradient(90deg, #2563eb, #1e40af);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

const Logo = styled.div`
  font-size: 1.6rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ $active }) => ($active ? "#1e3a8a" : "transparent")};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;

  &:hover {
    background: #374151;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #b91c1c;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f3f4f6;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.9rem;
`;
