import { CreateNewPostRepository } from "../repositories/createNewPostRepository.js"
import { checkUrlSchema } from "../schemas/urls.schema.js";

export default function ValidateNewPost(req,res,next) {
   const {url,postDescription} = req.body
   const currentSession = res.locals.session
   const user_id = currentSession.rows[0].user_id
   
   
   if (!url) return res.status(422).send("There was an error publishing your link: URL is required");

   const { error } = checkUrlSchema.validate({url:url});

   if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(422).send(errorMessages);
    }

    
    const newPost = CreateNewPostRepository(user_id,url,postDescription)

    if(!newPost) return res.status(422).send("There was an error publishing your link")

    next()

}