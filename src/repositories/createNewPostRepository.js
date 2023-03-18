import { db } from "../config/database.js";

export async function CreateNewPostRepository(user_id, url, postDescription) {
  let hashTagsWord = [];

  const newPost = await db.query(
  `
      INSERT INTO posts (user_id,headline,post_url)
      VALUES ($1,$2,$3) 
      RETURNING *;
  `,
    [user_id, postDescription, url]
  );

  console.log(newPost.rows[0]);
  try {

    let postDescriptionWords = postDescription.split(" ");

    for (let i = 0; i < postDescriptionWords.length; i++) {
      if (postDescriptionWords[i].startsWith("#")) {
        hashTagsWord.push(postDescriptionWords[i].substring(1));
      }
    }
    for (let i = 0; i < hashTagsWord.length; i++) {
      const existHashTag = await db.query(
        `
        SELECT * FROM hastags
        WHERE name=$1
        `,
        [hashTagsWord[i]]
      );

      if (!existHashTag) {
        await db.query(
          `
        INSERT INTO hastags (name,post_id)
        VALUES ($1,$2)
            `,
          [hashTagsWord[i], newPost.rows[0].id]
        );
      } else {
        await db.query(
          `
            UPDATE hastags
            SET use_count = use_count +1
            WHERE name=$1
            `,
          [hashTagsWord[i]]
        );
      }
    }
  } catch (error) {
    return error.message;
  }
}
