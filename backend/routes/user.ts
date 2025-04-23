import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import { simpleGit } from "simple-git";
import userAuth from "../middleware/userAuth";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
const prisma = new PrismaClient();

import { z } from "zod";
import jwt from "jsonwebtoken";
import generateReadmeWithGemins from "../lib/Api";
import { getTSFiles } from "../lib/file";

const signinVal = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});
const signupVal = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(20),
  apiKey: z.string().min(1).max(50),
});
router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const userBody = req.body;
  const success = signupVal.safeParse(userBody);
  if (!success.success) {
    return res.status(403).json({ msg: "Wrong format" });
  }
  try {
    const user = await prisma.user.create({
      data: userBody,
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.status(200).json({ token: token });
  } catch (e) {
    return res.status(403).json({ msg: "User already exist" });
  }
});
router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const signinBody = req.body;
  const success = signinVal.safeParse(signinBody);
  if (!success.success) {
    return res.status(403).json({ msg: "Invalid Input" });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: signinBody.email,
        password: signinBody.password,
      },
    });
    if (!user) {
      return res.status(401).json({ msg: "User does not exist" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.status(200).json({ msg: "Signin Success", token: token });
  } catch (e) {
    return res.status(403).json({ msg: "Invalid Input" });
  }
});

router.post(
  "/repo",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const repourl = req.body.repourl;
    const git = simpleGit();
    try {
      await git.clone(repourl as string, "./repos/" + req.userId);
      const dirPath = "./repos/" + req.userId;
      const tsFiles = getTSFiles(dirPath);

      const readme = await generateReadmeWithGemins(
        user?.apiKey as string,
        tsFiles
      );

      await fs.rm(dirPath, { recursive: true, force: true });
      return res.status(200).json({ readme });
    } catch (e) {
      return res.status(403).json({ msg: "Invalid Input" });
    }
  }
);

export default router;
