import { db } from "../configs/database.connection.js";

export async function validateToken(req, res, next) {
	const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

	if (!token) return res.status(401).send("invalid token");

	try {
		const currentSession = await db.query(
			`SELECT * FROM sessions WHERE "token" = $1`,
			[token]
		);

		if (currentSession.rows.length === 1) {
			res.locals.session = currentSession;
			next();
		} else {
			return res.status(401).send("Invalid token");
		}
	} catch (err) {
		return res.status(500).send(err);
	}
}