import { db } from "../config/database.js";


export function CreateNewPost(req,res) {
    // const {} = res.locals
    console.log(res.sendStatus(201))
    return res.sendStatus(201)

}

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



