import dotenv from "dotenv"
import connectDB from "./server/db/connectDb.js";
import { app } from "./app.js";

dotenv.config({ path: './env' })

connectDB().then( () => {
        app.listen(process.env.PORT || 8080)
        console.log("Server is Running Successfully")
    }).catch( (error) => {
        console.error("\n\n ## Connection to MongoDB...FAILED")
})

app.get("/",(req,res)=>{
        res.send("Welcome!!")
})

app.get("/userRegistration", (req,res) =>  { 
    res.send("User is Registered")
} )


/*
;( async() => {
    try {
        await mongoose.connect( 'mongodb+srv://forkotlow:yoga_database_1234@cluster0.auzxsxy.mongodb.net/yogastudio' )
        console.log("Successfully Connected to Database !!!");

        app.listen(process.env.PORT)
        console.log("##### listening on port:", process.env.PORT );

    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1)
    }

    })()

    
    app.listen(process.env.PORT)

    app.get("/", (req,res) =>  { 
        res.send("Hello World")
    } )

    app.get("/userRegistration", (req,res) =>  { 
        res.send("User is Registered")
    } )
*/
    