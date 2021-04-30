import { Request, Response, Router } from "express";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import auth from "../middlewares/authMiddleware";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;
  if (title.trim() === "") {
    return res.status(400).json({ title: "Title can't be empty" });
  }

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post saved successfully", post });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

const router = Router();

router.post("/", auth, createPost);

export default router;
