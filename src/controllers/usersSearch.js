import { db } from "../config/database.js";

export async function searchUser(req, res) {
  const { authorization } = req.headers;
  const { username } = req.body;

  if (!authorization) return res.sendStatus(401);

  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const tokenActive = await db.query(
    "SELECT * FROM sessions WHERE token = $1",
    [token]
  );

  if (tokenActive.rows.length === 0) return res.sendStatus(401);

  try {
    const findUser = await db.query(
      `SELECT * FROM users WHERE username = $1`,
      username
    );

    if (findUser.rows.length === 0) return res.sendStatus(404);

    return res.send(findUser.rows[0]);
  } catch (error) {
    return res.send(error);
  }
}
