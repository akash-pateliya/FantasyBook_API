const environment = require("../env/environment");
// Google sheet npm package
const { GoogleSpreadsheet } = require('google-spreadsheet');
// File handling package
const fs = require('fs');
// spreadsheet key is the long id in the sheets URL
const RESPONSES_SHEET_ID = environment.spreadsheetId;
// Create a new document
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);

var appRouter = function (app) {
  app.get("/", function (req, res) {
    const result = {
      "/": "/",
    };
    res.status(200).send(result);
  });

app.get("/getdata",async function (req, res) {
        await doc.useServiceAccountAuth({
            client_email: environment.client_email,
            private_key: environment.private_key
        });
    
        // load the documents info
        await doc.loadInfo();
    
        // Index of the sheet
        let sheet = doc.sheetsByIndex[0];
    
        // Get all the rows
        let rows = await sheet.getRows();
        
        result = [];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const obj = {
                MatchNo : Number(row.MatchNo),
                MatchDateTime: row.MatchDateTime,
                Tour: row.Tour,
                Round: row.Round,
                Investment: Number(row.Investment),
                Winnings: Number(row.Winnings),
                ProfitOrLoss: Number(row.ProfitOrLoss),
            }
            result.push(obj);
        };
    res.status(200).send(result);
  });
};


module.exports = appRouter;
