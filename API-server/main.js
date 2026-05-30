const express = require("express");
const app = express();
const PORT = 3001;
app.use(express.json());

let users = [];

//middleware
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next(); 
});

// HTTPS request
app.get("/api/users/", (req, res) => {
  res.json(users);
});

app.post("/api/users/", (req, res) => {
  const user = req.body;
  users.push(user);
  console.log("Received data:", users);

  res.json({
    message: "Data received successfully",
    users: users,
  });
});

app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // console.log(Number(req.params.id))
  const updatedData = req.body;
  users = users.map((user) =>
    Number(user.id) === id ? { ...user, ...updatedData } : user,
  );
  res.json(users);
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const oldLength = users.length;

  users = users.filter((user) => Number(user.id) !== id);

  if (users.length === oldLength) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "User deleted successfully",
    users,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
