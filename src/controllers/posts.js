import { db } from "../config/database.js";

export async function editPost(req, res) {
    
    const currentSession = res.locals.session;
    const user = currentSession.rows[0].user_id;
	const { id } = req.params;
    const {headline} = req.body

    try{

    const chosenPost = await db.query(
        `SELECT * FROM posts WHERE "id" =$1`,
        [id]
    );

    if (chosenPost.rowCount == 0) return res.status(404).send("Id does not exist");

    if (chosenPost.rows[0].user_id !== user) return res.status(401).send("Id does not belong to this user");

    const refactoredPost = await db.query(
        `UPDATE posts SET headline=$1 WHERE id=$2 RETURNING *`,
        [headline, id]
    );
    return res.status(200).send(refactoredPost.rows[0].headline);

    }catch(err){
        return res.status(500).send(err);
    }
}

export async function deletePost(req, res) {
    const { id } = req.params;
	const currentSession = res.locals.session;
    const user = currentSession.rows[0].user_id;

    try{
        const chosenPost = await db.query(
            `SELECT * FROM posts WHERE "id" =$1`,
            [id]
        );
        if (chosenPost.rowCount == 0) return res.status(404).send("Id does not exist");

        if (chosenPost.rows[0].user_id !== user) return res.status(401).send("Id does not belong to this user");

		await db.query (`DELETE FROM posts WHERE id =$1`,[id])

        return res.status(204).send("Ok");
    }catch(err){
        return res.status(500).send(err);
    }
}

export async function createPost(req, res) {
    const currentSession = res.locals.session;
    const user = currentSession.rows[0].user_id;
    const { link, description } = req.body;

    try {
        const post = await db.query(
            `INSERT INTO posts (user_id, headline, post_url) VALUES ($1, $2, $3) RETURNING *`,
            [user, description ? description : null, link]
        );

        if (description && description.includes("#")) {
            let hashtags = description.match(/#\w+/g);
            hashtags.forEach(async (hashtag) => {

                const tag = await db.query(
                    `INSERT INTO hashtags (name, use_count) 
                    VALUES ($1, 1) 
                    ON CONFLICT (name) DO UPDATE 
                    SET use_count = hashtags.use_count + 1 
                    RETURNING id, name;`,
                    [hashtag]
                );

                await db.query(
                    `INSERT INTO posts_hashtags (hashtag_id, post_id) 
                    VALUES ($1, $2)`,
                    [tag.rows[0].id, post.rows[0].id]
                );
            });
        }

        return res.status(200).send(post.rows[0]);
    } catch (err) {
        return res.status(500).send(err);
    }
}





