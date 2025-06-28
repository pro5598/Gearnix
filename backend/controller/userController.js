const Users = require("../model/userSchemas");

const getAllEmployee = async (req, res) => {
  console.log("Get Alls");
  try {
    const users = await Users.findAll();
    if (users.length === 0) {
      res
        .status(200)
        .send({ data: users, message: "Successfully fetched data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error while fetching");
  }
};

const saveAllEmployee = async (req, res) => {
  console.log(req.body);

  const { username, userID, email, password } = req.body;
  try {
    const user = await Users.findOne({
      where: { userID: userID },
    });

    if (user == null) {
      await Users.create(req.body);
      return res.status(201).json({ message: "Users Added Successfully" });
    }
    return res.status(500).json({ messgae: "user is already present" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllEmployee,
  saveAllEmployee,
};