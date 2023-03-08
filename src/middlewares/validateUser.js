export default function validateUser (signSchema) {
    
    return (req, res, next)=> {
       
        const {error}= signSchema.validate (req.body, {abortEarly: false})
        if (error) return res.status(422).send(error.message)  

        next();
    }
}




