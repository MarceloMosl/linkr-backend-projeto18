import joi from "joi"

export const checkUrlSchema = joi.object({
    url:joi.string().min(1).uri().required()
})