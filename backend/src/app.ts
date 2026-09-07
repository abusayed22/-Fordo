import express,{ Application} from "express";
import { indexRoute } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./config/env";

const app:Application = express();

app.use(cors({
    origin:[envVars.FRONTEND_URL,envVars.BETTER_AUTH_URL],
    credentials:true,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
}))


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// better-auth middleware for authentication routes TODO:
// app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/api/auth", toNodeHandler(auth))

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// app.use(cookeParser)





// route 
app.use('/api/v1',indexRoute)

app.use(notFound)

app.use(globalErrorHandler)




export default app;