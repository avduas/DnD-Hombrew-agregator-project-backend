const pool = require("../config/db");
const { generateToken } = require("../middlewares/auth");

async function registration(req, res) {
  const { email, password, name } = req.body;

  try {
    const checkQuery = `
      SELECT * FROM public.registration
      WHERE email = $1 OR name = $2
    `;
    const checkResult = await pool.query(checkQuery, [email, name]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        message: "User with this email or nickname already exists"
      });
    }

    const insertQuery = `
      INSERT INTO public.registration (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [email, password, name]);
    const user = insertResult.rows[0];

    const token = await generateToken({
      id: user.id,
      email: user.email,
      user: user.name,
    });

    res.status(200).json({
      message: "Registration successful",
      token: token,
      user: user.name,
    });

  } catch (error) {
    console.error("Error during registration:", error);
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

    const token = await generateToken({
      id: user.id,
      email: user.email,
      user: user.name,
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: user.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { registration, login };
