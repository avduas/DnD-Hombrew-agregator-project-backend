const pool = require("../config/db");
const { generateToken } = require("../middlewares/auth");

async function registration(req, res) {
  const { email, password } = req.body;

  try {
    const queryText = `
        INSERT INTO public.registration (email, password)
        VALUES ($1, $2)
        RETURNING *
        `;
    const result = await pool.query(queryText, [email, password]);

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving new user:", error);
    res.status(500).send("Internal server error");
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const queryText = `SELECT * FROM public.registration WHERE email = $1`;
    const result = await pool.query(queryText, [email]);

    if (result.rows.length == 0) {
      return res.status(401).json({ message: "Invalid password or email" });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateToken({ id : user.id, email: user.email})

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { registration, login };
