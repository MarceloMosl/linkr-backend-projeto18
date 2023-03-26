import { db } from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

async function signUp(req, res) {
  const { username, email, password, user_url } = req.body;

  const jaExiste = await db.query(`SELECT * FROM users WHERE email = $1;`, [
    email,
  ]);
  if (jaExiste.rowCount > 0)
    return res.status(409).send("Cliente já cadastrado no sistema!");

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    await db.query(
      `INSERT INTO users 
        (username, email, password, user_url) 
        VALUES ($1, $2, $3, $4);`,
      [username, email, hashPassword, user_url]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const token = uuidV4();

  try {
    const existe = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);

    if (existe.rowCount === 0)
      return res.status(401).send("Email ou Senha incorreta!");

    const { id, password: hash, user_url } = existe.rows[0];

    const senhaCorreta = bcrypt.compareSync(password, hash);

    if (!senhaCorreta) {
      return res.status(401).send("Email ou Senha incorreta!");
    }

    const sessaoAberta = await db.query(
      `SELECT * FROM sessions WHERE user_id=$1;`,
      [id]
    );

    if (sessaoAberta.rowCount >= 1) {
      await db.query(`UPDATE sessions SET token = $1 WHERE user_id = $2;`, [
        token,
        id,
      ]);
    } else {
      await db.query(
        ` INSERT INTO sessions(user_id, token)
                VALUES ($1, $2)
            `,
        [id, token]
      );
    }
    return res.status(200).send({id, token, user_url });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

async function follow(req, res) {
  const { id } = req.params
  const currentSession = res.locals.session;
  const token= currentSession.rows[0].token;

  
  const userSession= await db.query(`SELECT user_id FROM sessions WHERE token = $1;`, [
    token
  ]
  );
  
  const user_id= userSession.rows[0].user_id;


  try {
    await db.query(`INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)`, [user_id, id])

    return res.sendStatus(200)

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

}

async function unfollow (req, res){
  const { id } = req.params
  const currentSession = res.locals.session;
  const token= currentSession.rows[0].token;

  
  const userSession= await db.query(`SELECT user_id FROM sessions WHERE token = $1;`, [
    token
  ]
  );
  
  const user_id= userSession.rows[0].user_id;


  try {
    await db.query(`DELETE FROM friends WHERE user_id = $1 AND friend_id = $2`, [user_id, id])

    return res.sendStatus(200)

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

}

async function followed(req, res) {
  const currentSession = res.locals.session;
  const token = currentSession.rows[0].token;
  const { id } = req.params


  const user = await db.query(
    `SELECT user_id FROM users JOIN sessions ON user_id= sessions.user_id WHERE sessions.token= $1`,
    [token]
  );

  try {
    const user_id = user.rows[0].user_id;


    const result = await db.query(`SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2`, 
      [user_id, id]
    );

    return res.status(200).send(result.rows[0])
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}






export { signUp, login, follow, unfollow, followed };
