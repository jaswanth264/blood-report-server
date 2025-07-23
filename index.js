// server/index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock storage for users and reports (replace with Supabase later)
let users = [];
let reports = [];

// Register user
app.post('/api/register', (req, res) => {
  const { name, age, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User exists' });
  }
  users.push({ name, age, email, password });
  res.json({ message: 'Registered successfully' });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ email, name: user.name, age: user.age }); // Simple session (replace with JWT/Supabase auth)
});

// Submit report
app.post('/api/report', (req, res) => {
  const { email, report } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });
  const existing = reports.find(r => r.email === email);
  if (existing) existing.report = report;
  else reports.push({ email, report });
  res.json({ message: 'Report saved' });
});

// Get user report
app.get('/api/report', (req, res) => {
  const email = req.query.email;
  const report = reports.find(r => r.email === email);
  if (!report) return res.status(404).json({ message: 'No report found' });
  res.json(report);
});

// Admin: get all reports
app.get('/api/admin/reports', (req, res) => {
  // In real app: require JWT & admin role
  res.json(reports);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
