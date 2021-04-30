import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import { Sub } from "../entities/Sub";
import User from "../entities/User";
import auth from "../middlewares/authMiddleware";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name cannot be empty.";
    if (isEmpty(title)) errors.title = "Title cannot be empty.";

    const sub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = "Sub name is already taken.";

    if (Object.keys(errors).length > 0) throw errors;
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, title, description, user });
    await sub.save();
    return res
      .status(200)
      .json({ success: true, message: "Sub created successfully", sub });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message ?? "",
    });
  }
};

const router = Router();

router.post("/", auth, createSub);

export default router;
