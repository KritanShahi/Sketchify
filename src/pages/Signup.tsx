import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateSignup = () => {
    // Trim whitespace
    const u = username.trim();
    const e = email.trim();
    const p = password.trim();

    // Username validations
    if (!u) return "Username is required.";
    if (u.length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(u))
      return "Username can only contain letters, numbers, and _.";
    
    // Email validation
    if (!e) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e)) return "Please enter a valid email.";

    // Password validation
    if (!p) return "Password is required.";
    if (p.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p))
      return "Password must include letters and numbers.";

    return null; // no errors
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    const errorMsg = validateSignup();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
        username,
        email,
        password,
      });

      alert(res.data.message || "Account created successfully!");
      navigate("/");
    } catch (err: any) {
      if (err.response?.data) {
        const error = err.response.data;
        const firstKey = Object.keys(error)[0];
        const msg = error[firstKey][0];
        alert(msg);
      } else {
        alert("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullPageContainer>
      <Card>
        <Title>Create Account</Title>

        <Form onSubmit={handleSignup}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Form>

        <Text>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </Text>

        <SmallText>
          By signing up, you agree to our Terms & Conditions.
        </SmallText>
      </Card>
    </FullPageContainer>
  );
}



const FullPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4f46e5, #3b82f6); /* full blue-purple gradient */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #ffffff; /* pure white card */
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* smooth scaling on small screens */
  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
    border-radius: 1.5rem;
  }
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
  transition: 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const Button = styled.button`
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: #6366f1;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: 0.3s;

  &:hover {
    background: #4f46e5;
  }

  &:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
  }
`;

const Text = styled.p`
  margin-top: 1.5rem;
  color: #4b5563;
  text-align: center;
`;

const SmallText = styled.p`
  margin-top: 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
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
