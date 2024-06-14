import UserDb from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/Jwt/secretoken..js";

// const LoadUser = async (req, res) => {
//     try {
//       // const result = await pool.query('SELECT * FROM users');
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   };

const postUser = async (req, res) => {
  try {
    console.log(req.body, "=-3-3-=3-");
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    const exist = await UserDb.findOne({
      where: {
        email: email,
      },
    });
    if (exist) {
      return res.json({ message: "Email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file ? req.file.filename : null;
    const newUser = await UserDb.create({
      username: userName,
      email: email,
      password: hashedPassword,
      picture: image || undefined,
    });
    console.log(newUser, "newuser");

    // Send the created user as the response
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const LoadUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body.formData;
    const exist = await UserDb.findOne({
      where: { email },
    });
    if (exist) {
      if (password && exist.password) {
        const compared = await bcrypt.compare(password,exist.password);
        if (compared) {
          const token = createSecretToken(exist.id, exist.userName, exist.email); 
          res.status(200).json({
            userData: exist,
            status: true,
            err: null,
            token,
          });
        } else {
          res.json({ alert: "Incorrect password!" });
        }
      } else {
        res.json({ alert: "Password is missing!" });
      }
    } else {
      res.json({ alert: "Email not found!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ alert: "Server error!" });
  }
};

// Export the functions
export { postUser,LoadUser };
