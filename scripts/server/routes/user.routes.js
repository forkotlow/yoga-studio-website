import { Router } from "express";
import  { upload } from "../middleware/multer.middleware.js"
import { registerUser, loginUser, logoutUser, updateAccountDetails, getCurrentUser, addCurrentMembershipToUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post( upload.fields([ { name: "avatarImage", maxCount: 1 } ]),  registerUser )
router.route("/login").post( loginUser )

//routes which reqires user login to access
router.route("/logout").post( verifyJWT , logoutUser )
router.route("/current-user").post( verifyJWT , getCurrentUser )

router.route("/membership").post( verifyJWT , addCurrentMembershipToUser )
router.route("/update-account-details").post( verifyJWT , updateAccountDetails )


export default router