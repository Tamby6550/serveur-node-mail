const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  region: 'us-east-2',
});



const app = express();
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3353;


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// These id's and secrets should come from .env file.
const CLIENT_ID = '501158639303-fd2ss9dhrg4o0g0ag23pc3jlu2la6v5m.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04X8jeCFWHKhHCgYIARAAGAQSNwF-L9IrXN_e4Loo0Qi3ndlIA8Ihlhtex4Sm_1JBmtd5q4r6REUB2roOWUZTTZrVqCpz6nAx12E';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


async function sendMail(file,nomfile,nom) {
  const arrayNom=nom.split("_");
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'recensement301@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Recensement <recensement301@gmail.com>',
      to: 'recensement301@gmail.com',
      subject: 'Recensement',
      text: 'Liste recensements',
      html: '<h2>Faritany :'+arrayNom[0]+', Faritra :'+arrayNom[1]+', Kaominina :'+arrayNom[2]+', <i> Export n°'+arrayNom[3]+'</i></h2>',
      attachments: [
        {
          filename:nomfile,
          content: file
        }]
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}


app.get("/", function (req, res) {
  res.json({ status: "RASOLONDRAIBE Tamby Arimsia" });
});

app.post("/send", function (req, res) {

  const file = req.files.fichier;
  const filename = req.files.fichier.name+'.xlsx';
  const nameP = req.files.fichier.name;
    sendMail(file.data,filename,nameP)
    .then((result) => {
      res.status(200).send( "Mail bien envoyé !");
    })
    .catch((error) => {res.status(500).send("Erreur d'envoi, Verifier votre connexion");}); 
});
// git add .
// git commit -am "test herokus"
// git push heroku master