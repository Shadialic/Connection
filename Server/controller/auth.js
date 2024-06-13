import UserDb from "../model/userModel.js";
import bcrypt from "bcryptjs";

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
  console.log("pepepe");
  try {
    console.log(req.body, "=-3-3-=3-");
    const { userName, email, password } = req.body;
    const exist = UserDb.findOne({
      where: {
        email: email,
      },
    });
    if(exist){
        res.json({message:'Email alredy exist'})
    }

    // Check for missing fields
    if (!userName || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const image = req.file ? req.file.filename : null;
    console.log(image, "-------------");

    // Create a new user with Sequelize
    const newUser = await UserDb.create({
      username: userName,
      email: email,
      password: hashedPassword,
      picture: image || undefined,
    });
    console.log(newUser, "newuser");

    // Send the created user as the response
    res.json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Export the functions
export { postUser };
