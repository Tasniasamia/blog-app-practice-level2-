import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middleware/auth";

const route=Router();

route.post('/',auth(userRole.ADMIN,userRole.USER),postController.createPost);
route.get('/',postController.getAllPost);
route.get('/my-posts',auth(userRole.ADMIN,userRole.USER),postController.getMyPost)
route.patch("/:postId",auth(userRole.ADMIN,userRole.USER),postController.updatePost);
route.delete("/:postId",auth(userRole.ADMIN,userRole.USER),postController.deletePost);

export const postRouter:Router=route;