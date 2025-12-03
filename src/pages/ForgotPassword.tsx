import { Link } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e: any) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    // Here you can call your backend API for password reset
    setTimeout(() => {
      alert(`Password reset link sent to ${email}`);
      setLoading(false);
      setEmail("");
    }, 1000);
  };

  return (
    <FullPageContainer>
      <Card>
        <Title>Reset Password</Title>

        <Form onSubmit={handleReset}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Form>

        <Text>
          Remember your password?{" "}
          <StyledLink to="/">Back to Login</StyledLink>
        </Text>
      </Card>
    </FullPageContainer>
  );
}

// =================== Styled Components ===================

const FullPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
`;

const Card = styled.div`
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 900;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Input = styled.input`
  width: 90%;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const Button = styled.button`
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: #10b981;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #6ee7b7;
    cursor: not-allowed;
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  color: #4b5563;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
