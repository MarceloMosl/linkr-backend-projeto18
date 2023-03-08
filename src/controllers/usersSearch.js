import { db } from "../config/database.js";

export async function getUserPosts(req, res) {
  const { id } = req.params;

  try {
    const findPosts = await db.query(`select * from posts WHERE user_id = $1`, [
      id,
    ]);

    const findUser = await db.query(`select * from users WHERE id = $1`, [id]);

    if (findPosts.rows.length === 0) return res.sendStatus(404);

    return res.send([findPosts.rows, findUser.rows]);
  } catch (error) {
    return res.send(error);
  }
}
