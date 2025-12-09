import React, { useState } from "react";
import styled from "styled-components";
import HomePage from "./HomePage";
import MyGallery from "./MyGallery";
import PublicGallery from "./PublicGallery";
import AnalyzeImage from "./AnalyzeImage";
import Logout from "./Logout";

export default function AppLayout() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "mygallery" | "publicgallery" | "analyze" | "logout"
  >("home");

  return (
    <LayoutContainer>

      {/* TOP NAVBAR */}
      <TopBar>
        <Logo>Sketchify</Logo>
      </TopBar>

      {/* SIDEBAR + MAIN CONTENT */}
      <ContentWrapper>
        
        {/* SIDEBAR */}
        <Sidebar>
          <MenuButton $active={currentPage === "home"} onClick={() => setCurrentPage("home")}>
            Home
          </MenuButton>

          <MenuButton $active={currentPage === "mygallery"} onClick={() => setCurrentPage("mygallery")}>
            My Gallery
          </MenuButton>

          <MenuButton $active={currentPage === "publicgallery"} onClick={() => setCurrentPage("publicgallery")}>
            Public Gallery
          </MenuButton>

          <MenuButton $active={currentPage === "analyze"} onClick={() => setCurrentPage("analyze")}>
            Analyze Image
          </MenuButton>

          <LogoutButton onClick={() => setCurrentPage("logout")}>
            Logout
          </LogoutButton>
        </Sidebar>

        {/* MAIN CONTENT */}
        <MainContent>
          {currentPage === "home" && <HomePage />}
          {currentPage === "mygallery" && <MyGallery />}
          {currentPage === "publicgallery" && <PublicGallery />}
          {currentPage === "analyze" && <AnalyzeImage />}
          {currentPage === "logout" && <Logout />}
        </MainContent>

      </ContentWrapper>
    </LayoutContainer>
  );
}

/* ============ STYLES ============ */

const LayoutContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 60px;
  background: #1f2937;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  color: #fff;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

const Logo = styled.div`
  font-size: 1.4rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

const Sidebar = styled.div`
  width: 240px;
  background: #111827;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
`;

const MenuButton = styled.button<{ $active?: boolean }>`
  padding: 1rem;
  background: ${({ $active }) => ($active ? "#374151" : "transparent")};
  color: white;
  border: none;
  text-align: left;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #374151;
  }
`;

const LogoutButton = styled(MenuButton)`
  background: #b91c1c;
  margin-top: auto;

  &:hover {
    background: #7f1d1d;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f9fafb;
`;
