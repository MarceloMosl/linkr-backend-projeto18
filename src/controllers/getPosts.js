import { db } from "../config/database.js";

export async function getPosts (req, res) {
    const currentSession = res.locals.session;
    const user = currentSession.rows[0].user_id;

    try{
        
    const promise = await db.query(`
  SELECT
      p.id,
      p.user_id,
      u.username,
      u.user_url,
      p.headline,
      array_agg(z.name) AS hashtags_name,
      array_agg(h.id) AS hashtags_id,
      p.post_url,
      COUNT(l.id) AS total_likes,
      EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) AS usuario_logado_like
  FROM
      posts p
  INNER JOIN
      users u ON p.user_id = u.id
  LEFT JOIN
      likes l ON p.id = l.post_id
  LEFT JOIN
      posts_hastags h ON p.id = h.post_id
  LEFT JOIN
      hastags z ON z.id = h.hastag_id
  GROUP BY
      p.id,
      u.id;`,[user]);

        res.send(promise.rows.slice(0,20));

    }catch(err){
        res.status(500).send(err.message);
    }
    
  };