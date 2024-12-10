import React, { useEffect, useState } from 'react';
import './styles/UserList.css';

function UserList({ token, setToken }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3004/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        alert('사용자 목록을 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:3004/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert('삭제 성공!');
        fetchUsers();
      } else {
        alert('삭제 실패: 권한이 없거나 잘못된 요청입니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3004/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });

      if (response.ok) {
        alert('수정 성공!');
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('수정 실패: 권한이 없거나 잘못된 요청입니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setToken("");
    alert('로그아웃 되었습니다.');
  };

  return (
    <div>
      <h2>사용자 목록</h2>
      <button onClick={handleLogout}>로그아웃</button>
      {users.map((user) => (
        <div key={user.id}>
          {editingUser === user.id ? (
            <div>
              <input
                type="text"
                placeholder="이름"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="email"
                placeholder="이메일"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <button onClick={() => handleEdit(user.id)}>저장</button>
              <button onClick={() => setEditingUser(null)}>취소</button>
            </div>
          ) : (
            <div>
              <p>
                <b>이름:</b> {user.name} <b>이메일:</b> {user.email}
              </p>
              <button onClick={() => {
                setEditingUser(user.id);
                setEditName(user.name);
                setEditEmail(user.email);
              }}>수정</button>
              <button onClick={() => handleDelete(user.id)}>삭제</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserList;
