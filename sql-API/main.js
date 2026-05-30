const express = require("express");
const pg = require("pg");
const bcrypt = require("bcrypt");
const { pool } = require("./db");
// import { pool } from "./db.js";
// import express from "express";
// import cors from "cors";
// import bcrypt from "bcrypt";
require("dotenv").config();

const PORT = 3001;
const app = express();

app.use(express.json());

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

app.post("/api/users/", async (req, res) => {
  const { firstName, lastName, age, country, phoneNo, email, password } =
    req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (firstName , lastName, age, country, phoneNo ,email , password) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING *",
      [
        firstName.toLocaleLowerCase(),
        lastName.toLocaleLowerCase(),
        age,
        country.toLocaleLowerCase(),
        phoneNo,
        email.toLocaleLowerCase(),
        await hashPassword(password),
      ],
    );
    const user = result.rows[0];
    return res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT  id,firstName , lastName, age, country, phoneNo , created_at, email , password , is_deleted FROM users ",
    );
    const user = result.rows;
    return res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:email", async (req, res) => {
  const { firstName, phoneNo } = req.body;
  const { email } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET firstName = $1, phoneNo = $2 WHERE email = $3 RETURNING *",
      [firstName, phoneNo, email],
    );

    return res.json({
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    return res.json({
      message: "User deleted successfully",
      user: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
