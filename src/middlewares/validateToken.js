import { db } from "../config/database.js";

export async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  

  if (!token) return res.status(401).send("Envie o Token");

  try {
    const currentSession = await db.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );

    if (currentSession.rows.length === 1) {
      res.locals.session = currentSession;

      next();
    } else {
      return res.status(401).send(`token inexistente ${token}`);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
