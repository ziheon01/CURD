const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); // CORS 패키지 추가
const app = express();

app.use(express.json()); // JSON 요청 본문 파싱
app.use(cors()); // 모든 요청에 대해 CORS 허용

const PORT = 3004;
const DATA_FILE = './users.json'; // 사용자 데이터를 저장할 파일
const SECRET_KEY = 'your_secret_key'; // JWT 비밀 키

// 데이터 읽기
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return []; // 파일이 없거나 문제가 있으면 빈 배열 반환
  }
}

// 데이터 저장
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// JWT 인증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰 형태

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다' });
    }
    req.user = user;
    next();
  });
}

// **회원가입 (/register)**
app.post('/register', async (req, res) => {
  const users = readData();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, Email, and Password are required' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // 이메일 중복 체크
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);
  writeData(users);

  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name, email } });
});

// **로그인 (/login)**
app.post('/login', async (req, res) => {
  const users = readData();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // JWT 발급
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

// **Create (생성)**
app.post('/users', authenticateToken, (req, res) => {
  const users = readData();
  const newUser = { id: Date.now(), ...req.body };

  if (!newUser.name || !newUser.email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  users.push(newUser);
  writeData(users);

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

// **Read (읽기) - 전체 사용자**
app.get('/users', authenticateToken, (req, res) => {
  const users = readData();
  res.json(users);
});

// **Read (읽기) - 특정 사용자**
app.get('/users/:id', authenticateToken, (req, res) => {
  const users = readData();
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// **Update (갱신)**
app.put('/users/:id', authenticateToken, (req, res) => {
  const users = readData();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeData(users);
    res.json({ message: 'User updated successfully', user: users[index] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// **Delete (삭제)**
app.delete('/users/:id', authenticateToken, (req, res) => {
  const users = readData();
  const initialLength = users.length;
  const filteredUsers = users.filter((u) => u.id !== parseInt(req.params.id));

  if (filteredUsers.length < initialLength) {
    writeData(filteredUsers);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// 서버 실행
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
