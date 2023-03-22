import { db } from "../config/database.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
	const currentSession = res.locals.session;
	const user = currentSession.rows[0].user_id;

	try {
		const posts = await db.query(
			`
        SELECT
            p.id,
            p.user_id,
            u.username,
            u.user_url,
            p.headline,
            array_agg(z.name) AS hashtags_name,
            array_agg(hashtag_id),
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
            posts_hashtags h ON p.id = h.post_id
        LEFT JOIN
            hashtags z ON z.id = h.hashtag_id
        GROUP BY
            p.id,
            u.id
        ORDER BY
            p.id DESC;
    `,
			[user]
		);
		try {
			for (const post of posts.rows) {
				const meta = await urlMetadata(post.post_url);
				post.title = meta.title;
				post.image = meta.image;
				post.description = meta.description;
			}
		} catch (err) {
			res.status(500).send(err.message);
		}

		res.send(posts.rows.slice(0, 20));
	} catch (err) {
		res.status(500).send(err.message);
	}
}
