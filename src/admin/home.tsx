import React, { useState } from "react";
import styled from "styled-components";
import DashboardModule from "./DashboardModule";
import ImageModule from "./ImageModule";
import UserModule from "./UserModule";
import SettingsModule from "./SettingsModule";

export default function AdminPage() {
  const [currentModule, setCurrentModule] = useState<
    "dashboard" | "images" | "users" | "settings"
  >("dashboard");

  const token = localStorage.getItem("access_token") || ""; 
  console.log("Token from localStorage =", token,token.length); // DEBUG

  return (
    <Container>
      <Sidebar>
        <SidebarButton
          $active={currentModule === "dashboard"}
          onClick={() => setCurrentModule("dashboard")}
        >
          Dashboard
        </SidebarButton>
        <SidebarButton
          $active={currentModule === "images"}
          onClick={() => setCurrentModule("images")}
        >
          Images
        </SidebarButton>
        <SidebarButton
          $active={currentModule === "users"}
          onClick={() => setCurrentModule("users")}
        >
          Users
        </SidebarButton>
        <SidebarButton
          $active={currentModule === "settings"}
          onClick={() => setCurrentModule("settings")}
        >
          Settings
        </SidebarButton>
      </Sidebar>

      <MainContent>
        {currentModule === "dashboard" && <DashboardModule token={token} />}

        {/* FIXED — Always render ImageModule so logs show */}
        {currentModule === "images" && <ImageModule token={token} />}

        {currentModule === "users" && <UserModule token={token} />}
        {currentModule === "settings" && <SettingsModule />}
      </MainContent>
    </Container>
  );
}

// ================= Styled Components ==================

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background: #1f2937;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
`;

const SidebarButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#111827" : "transparent")};
  color: white;
  border: none;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #111827;
  }
`;

const MainContent = styled.div`
  flex: 1;
  width: 83vw;
  min-height: 100vh;
  background: #ffffff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;
