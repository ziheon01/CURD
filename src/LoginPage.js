import React, { useState } from 'react';

function LoginPage({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3003/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        alert('로그인 성공!');
      } else {
        alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;
