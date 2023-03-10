import { db } from "../config/database.js";

export async function getUserPosts(req, res) {
  const { id } = req.params;

  try {
    const findPosts = await db.query(`select * from posts WHERE user_id = $1`, [
      id,
    ]);

    const findUser = await db.query(`select * from users WHERE id = $1`, [id]);

    if (findUser.rows.length === 0) return res.sendStatus(404);

    return res.send([findPosts.rows, findUser.rows]);
  } catch (error) {
    return res.send(error);
  }
}

export async function postUsers(req, res) {
  const { username } = req.body;

  const promise = await db.query(`SELECT * FROM users WHERE username LIKE $1`, [
    username,
  ]);

  res.send(promise.rows);
}
