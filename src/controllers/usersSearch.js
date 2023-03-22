import { db } from "../config/database.js";

export async function getUserPosts(req, res) {
  const { id } = req.params;

  try {
    const userId = res.locals.session;

    const promise = await db.query(
      `SELECT
  p.id,
  p.user_id,
  u.username,
  u.user_url,
  p.headline,
  array_agg(z.name) AS hashtags_name,
  array_agg(h.id) AS hashtags_id,
  p.post_url,
  COUNT(l.id) AS total_likes,
  EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId.rows[0].user_id}) AS usuario_liked
FROM
  posts p
INNER JOIN
  users u ON p.user_id = u.id
LEFT JOIN
  likes l ON p.id = l.post_id
LEFT JOIN
  posts_hashtags h ON p.id = h.post_id
LEFT JOIN
  hashtags z ON z.id = h.hashtag_id
WHERE 
  u.id = ${id}
GROUP BY
  p.id,
  u.id;`
    );

    if (promise.rows.length === 0) {
      const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      return res.send(user.rows);
    }

    return res.send(promise.rows);
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
