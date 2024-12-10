import React, { useState } from "react";
import "./styles/App.css";
import UserList from "./UserList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:3004/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setIsLoggedIn(true);
        alert("로그인 성공!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:3004/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("회원가입 성공!");
        setShowRegister(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>사용자 관리 시스템</h1>
        {!isLoggedIn && (
          <div>
            <form onSubmit={handleLogin} className="auth-form">
              <input type="email" name="email" placeholder="이메일" required />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                required
              />
              <button type="submit">로그인</button>
              <button
                type="button"
                onClick={() => setShowRegister(!showRegister)}
              >
                회원가입
              </button>
            </form>
            {showRegister && (
              <form onSubmit={handleRegister} className="register-form">
                <input
                  type="text"
                  name="name"
                  placeholder="이름"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="이메일"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  required
                />
                <button type="submit">회원가입</button>
              </form>
            )}
          </div>
        )}
        {isLoggedIn && (
          <UserList
            token={token}
            setIsLoggedIn={setIsLoggedIn}
            setUsers={setUsers}
            users={users}
          />
        )}
      </header>
    </div>
  );
}

export default App;
