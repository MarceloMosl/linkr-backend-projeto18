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

    const { id, password: hash } = existe.rows[0];

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
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export { signUp, login };
