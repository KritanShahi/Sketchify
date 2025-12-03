import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styled from "styled-components";




export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  /*
const handleLogin = async (e: any) => {
  e.preventDefault();

  if (!username || !password) {
    alert("Enter username & password");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
      username,
      password,
    });

    console.log(res.data); // Check what backend returns

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    // Decode JWT **after receiving it**
    const decoded: any = jwt_decode(res.data.access);
    console.log(decoded); // See the claims

    alert(res.data.message || "Login successful");

    // Navigate based on role
    if (decoded.is_staff || decoded.is_superuser) {
      navigate("/admin/home"); // admin dashboard
    } else {
      navigate("/home"); // regular user
    }
  } catch (err: any) {
    if (err.response && err.response.data) {
      alert(JSON.stringify(err.response.data));
    } else {
      alert("Login failed: " + err.message);
    }
  } finally {
    setLoading(false);
  }
};
*/const handleLogin = async (e: any) => {
  e.preventDefault();

  if (!username || !password) {
    alert("Enter username & password");
    return; // no stray 's'
  }

  setLoading(true);
try {
  const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);

  alert(res.data.message || "Login successful");

  // Use backend flag instead of decoding JWT
  if (res.data.is_superuser) {
    navigate("/admin/home"); // admin dashboard
  } else {
    navigate("/home"); // regular user
  }
  console.log(res.data);


} catch (err: any) {
  alert("Login failed: " + (err.response?.data || err.message));
}

};



  return (
    <FullPageContainer>
      <Card>
        <Title>Login</Title>

        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <Text>
          Forgot Password?{" "}
          <StyledLink to="/forgot-password">Click Here</StyledLink>
        </Text>
        <Text>
          Don't have an account?{" "}
          <StyledLink to="/signup">Signup</StyledLink>
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
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
    border-radius: 1.5rem;s
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
