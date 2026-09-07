

import app from './app'
import { envVars } from './config/env';




const bootstrap = async() => {
  try{
    app.listen(envVars.PORT ,() => {
      console.log(`Server is running on http://localhost:${envVars.PORT||5000}`);
    })
  }catch(err){
    console.log("Failed to start Server:",err)
  }
}


bootstrap()