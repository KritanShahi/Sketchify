import React, { useState } from "react";
import styled from "styled-components";
import DashboardModule from "./DashboardModule";
import ImageModule from "./ImageModule";
import UserModule from "./UserModule";
import SettingsModule from "./SettingsModule";
import LogoutModule from "../pages/Logout";

export default function AdminPage() {
  const [currentModule, setCurrentModule] = useState<
    "dashboard" | "images" | "users" | "settings" | "logout"
  >("dashboard");

  const token = localStorage.getItem("access_token") || "";

  return (
    <div style={{ width: "100%", height: "100vh", background: "yellow" }}>
    <Container>
      <Sidebar>
        <TopMenu>
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
        </TopMenu>

        {/* BOTTOM LOGOUT BUTTON */}
        <BottomMenu>
          <LogoutButton
            $active={currentModule === "logout"}
            onClick={() => setCurrentModule("logout")}
          >
            Logout
          </LogoutButton>
        </BottomMenu>
      </Sidebar>

      <MainContent>
        {currentModule === "dashboard" && <DashboardModule token={token} />}
        {currentModule === "images" && <ImageModule token={token} />}
        {currentModule === "users" && <UserModule token={token} />}
        {currentModule === "settings" && <SettingsModule />}
        {currentModule === "logout" && <LogoutModule />}
      </MainContent>
    </Container>
    </div>
  );
}

// ================= Styled Components ==================

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width:100%;
  overflow:hidden;
`;

const Sidebar = styled.div`
  width: 220px;
  background: #1f2937;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 1rem;
`;

const TopMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomMenu = styled.div`
  margin-top: auto;
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

const LogoutButton = styled(SidebarButton)`
  background: #b91c1c;
  &:hover {
    background: #7f1d1d;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 2rem;
    min-width: 0;  
  overflow-y: auto;     
`;
