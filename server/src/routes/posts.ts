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

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: "DESC" },
    });
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};
const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOne(
      { identifier, slug },
      {
        relations: ["sub"],
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        error: "No post was found with the requested identifier",
      });
    }
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

const router = Router();

router.post("/", auth, createPost);
router.get("/", getPosts);
router.get("/:identifier/:slug", getPost);

export default router;
