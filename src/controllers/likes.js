import { db } from "../config/database.js";

export async function likePost(req, res) {
  const { post_id, token } = req.body;

  const promise = await db.query(`SELECT * FROM SESSIONS WHERE token = $1`, [
    token,
  ]);

  const postLiked = await db.query(
    `SELECT * FROM Likes WHERE post_id = $1 AND user_id = $2`,
    [post_id, promise.rows[0].user_id]
  );

  if (postLiked.rows.length !== 0) {
    await db.query(`DELETE FROM LIKES WHERE id = $1`, [postLiked.rows[0].id]);

    return res.sendStatus(201);
  }

  try {
    await db.query(`INSERT INTO LIKES (post_id, user_id) values ($1, $2)`, [
      post_id,
      promise.rows[0].user_id,
    ]);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}
