const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jose = require("jose"); // Import the jose library
const dotenv = require("dotenv");
const summarizeText = require('./summarize')
dotenv.config()

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

console.log(process.env.HANKO_API_URL)
// Middleware for Hanko authentication
// app.use(async (req, res, next) => {


//   // const token = req.headers.hanko;
//   const token = req.cookies.hanko;
//   // console.log(token2)
//   // const token = req.cookies.hanko; // Get the Hanko token from the cookies
//   console.log("token", token)

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // Fetch the JWKS from Hanko API
//   // const jwksUri = `${process.env.HANKO_API_URL}/.well-known/jwks.json`;
//   // const JWKS = jose.createRemoteJWKSet(
//   //   new URL(`${jwksUri}`)
//   // );
//   const hankoApi = process.env.HANKO_API_URL

//   const JWKS = jose.createRemoteJWKSet(
//     new URL(`${hankoApi}/.well-known/jwks.json`)
//   );
//   // const JWKS = await jose.JWKS.asKeyStore(jwksUri);
//   console.log(JWKS)
//   try {
//     // Verify the token using the JWKS
//     console.log("aya 1")
//     const verifiedJWT = await jose.jwtVerify(token, JWKS);

//     console.log("aya 2")
//     // console.log(verifiedJWT)
//     req.auth = verifiedJWT; // Attach the authentication data to the request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// });

async function Middleware(req, res, next) {


  const token = req.cookies.hanko;
const token2= req.cookies;
  console.log("token", token,token2)

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

 
  const hankoApi = process.env.HANKO_API_URL

  const JWKS = jose.createRemoteJWKSet(
    new URL(`${hankoApi}/.well-known/jwks.json`)
  );
  
  console.log(JWKS)
  try {
    // Verify the token using the JWKS
    console.log("aya 1")
    const verifiedJWT = await jose.jwtVerify(token, JWKS);

    console.log("aya 2")
    // console.log(verifiedJWT)
    req.auth = verifiedJWT; // Attach the authentication data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

app.get("/protected", (req, res) => {
  // Only users with a valid Hanko token will reach this route
  if (req.auth) {
    console.log(req.auth)
    res.sendStatus(200);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/summarize", (req, res) => {


  // if (req.auth) {
    console.log(JSON.stringify(req.cookies))
    const text = req.body.text_to_summarize;
    console.log(text)
    summarizeText(text)
      .then(response => {
        res.send(response); // Send the summary text as a response to the client
      })
      .catch(error => {
        console.log(error.message);
      });
  // }else{
  //   res.status(401).json({ error: "Unauthorized" });
  // }
  // get the text_to_summarize property from the request body

});


app.get('/', (req, res) => {
  res.send("hello");
})









app.listen(3000, () => {
  console.log("Server started at 3000");
});
