import express,{ Application} from "express";
import { indexRoute } from "./app/routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app:Application = express();




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