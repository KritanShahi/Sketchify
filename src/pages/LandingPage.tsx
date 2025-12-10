// LandingPage.tsx
import React from "react";
import styled from "styled-components";

// ---------------- Styled Components ----------------
const Container = styled.div`
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: #f9fafb;
`;

// Navbar
const Navbar = styled.nav`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: #7c3aed;
`;

const NavLinks = styled.div`
  a {
    margin-left: 1.5rem;
    color: #4b5563;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #7c3aed;
    }
  }
`;

// Hero Section
const HeroSection = styled.section`
  background-color: #7c3aed;
  color: #fff;
  text-align: center;
  padding: 6rem 2rem;
`;

const HeroTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;

  @media(min-width: 768px){
    font-size: 3.5rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;

  @media(min-width: 768px){
    font-size: 1.25rem;
  }
`;

const HeroButton = styled.a`
  background-color: #fff;
  color: #7c3aed;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e5e7eb;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 2.5rem;
  margin-top: 3rem;
  @media(min-width: 768px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 12px rgba(0,0,0,0.15);
  }
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: bold;
`;

// CTA Section (instead of Upload/Login)
const CTASection = styled.section`
  background: linear-gradient(90deg, #7c3aed, #9333ea);
  color: #fff;
  text-align: center;
  padding: 6rem 2rem;
  border-radius: 1rem;
  max-width: 900px;
  margin: 4rem auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const CTAButton = styled.a`
  background-color: #fff;
  color: #7c3aed;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e5e7eb;
    transform: translateY(-2px);
  }
`;

// Footer
const Footer = styled.footer`
  background-color: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
`;

// ---------------- Landing Page Component ----------------
const LandingPage: React.FC = () => {
  return (
    <Container>
      {/* Navbar */}
      <Navbar>
        <NavContent>
          <Logo>Sketchify</Logo>
          <NavLinks>
            <a href="#features">Features</a>
            <a href="#cta">Get Started</a>
          </NavLinks>
        </NavContent>
      </Navbar>

      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Transform your images into stunning pencil sketches</HeroTitle>
        <HeroText>Upload your photos and let Sketchify create beautiful sketches in seconds!</HeroText>
        <HeroButton href="/signup">Get Started</HeroButton>
      </HeroSection>

      {/* Features */}
      <FeaturesSection id="features">
        <SectionTitle>Why Choose Sketchify?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem'}}>Fast & Easy</h4>
            <p>Upload any image and get a pencil sketch in seconds without any hassle.</p>
          </FeatureCard>
          <FeatureCard>
            <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem'}}>High Quality</h4>
            <p>Our algorithm generates realistic and clean pencil sketches from your photos.</p>
          </FeatureCard>
          <FeatureCard>
            <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem'}}>AI Powered</h4>
            <p>Powered by a CNN model that learns to convert images into beautiful sketches.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* CTA Section */}
      <CTASection id="cta">
        <SectionTitle>Start Sketching Today</SectionTitle>
        <p style={{margin: '1.5rem 0'}}>
          Login or create an account and turn your photos into beautiful pencil sketches instantly.
        </p>
        <CTAButton href="/login">Login</CTAButton>
      </CTASection>

      {/* Footer */}
      <Footer>
        &copy; 2025 Sketchify. All rights reserved.
      </Footer>
    </Container>
  );
};

export default LandingPage;
