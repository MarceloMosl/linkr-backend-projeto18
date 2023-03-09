import { db } from "../config/database";

export async function getHashTagsRepository() {
    return await db.query(
    `
    SELECT hastags.name 
    FROM hastags
    ORDER BY use_count DESC
    `)
}