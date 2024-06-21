import { Router } from "express";
import path from "path";

const router = Router();

const __dirname = path.resolve(path.dirname(''));
const static_path = path.join( __dirname,"./scripts/client/public");

router.get("/" , (req,res,next)=>{
    res.sendFile(path.join( __dirname,"./scripts/client/public","index.html"))
} )

router.get("/signup" , (req,res,next)=>{
    res.sendFile(path.join( __dirname,"./scripts/client/public","signup.html"))
} )

export default router
