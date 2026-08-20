import express,{ Application} from "express";
import { indexRoute } from "./app/routes";

const app:Application = express();




// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());




// brand route 
app.use('/api/v1',indexRoute)




export default app;