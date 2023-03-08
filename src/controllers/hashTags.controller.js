import { getHashTagsRepository } from "../repositories/hashTagsRepository"

export async function showHashTags(req,res) {
    const hashTagsList = getHashTagsRepository()

    return res.status(200).send(hashTagsList.rows[0])
}