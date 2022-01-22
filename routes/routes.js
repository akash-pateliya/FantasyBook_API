const environment = require("../src/env/environment");
// Google sheet npm package
const { GoogleSpreadsheet } = require("google-spreadsheet");
// File handling package
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
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

  app.get("/get-data", async function (req, res) {
    try {
      await doc.useServiceAccountAuth({
        client_email: environment.client_email,
        private_key: environment.private_key,
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
          MatchNo: Number(row.MatchNo),
          MatchDateTime: row.MatchDateTime,
          Tour: row.Tour,
          Round: row.Round,
          Investment: Number(row.Investment),
          Winnings: Number(row.Winnings),
          ProfitOrLoss: Number(row.ProfitOrLoss),
        };
        result.push(obj);
      }
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.post("/add-data", async function (req, res) {
    try {
      await doc.useServiceAccountAuth({
        client_email: environment.client_email,
        private_key: environment.private_key,
      });

      // load the documents info
      await doc.loadInfo();

      // Index of the sheet
      let sheet = doc.sheetsByIndex[0];
      await sheet.addRow(req.body);
      res.status(StatusCodes.OK).send({ status: true });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.post("/delete-data", async function (req, res) {
    try {
      await doc.useServiceAccountAuth({
        client_email: environment.client_email,
        private_key: environment.private_key,
      });

      // load the documents info
      await doc.loadInfo();

      // Index of the sheet
      let sheet = doc.sheetsByIndex[0];

      // Get all the rows
      let rows = await sheet.getRows();

      let result = null;
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row[req.body.keyValue] == req.body.thisValue) {
          result = await rows[index].delete();
          break;
        }
      }
      res.status(StatusCodes.OK).send({ status: true });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });
};

module.exports = appRouter;
