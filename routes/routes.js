const { MongoClient } = require("mongodb");
const { StatusCodes } = require("http-status-codes");
const { moment } = require("moment");

var appRouter = function (app) {
  // const mongoCollectionName = getMongoCollectionName();
  const mongoCollectionName = "FEB-2022";
  const uri =
    "mongodb+srv://root:root@fantasybook.qxgk4.mongodb.net/FantasyBook?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  function getMongoCollectionName() {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const date = moment().utcOffset("+05:30").format("MMM Do YY");
    console.log(date);
    const currentMonth = monthNames[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    return `${currentMonth}-${currentYear}`;
  }

  app.get("/", function (req, res) {
    const result = {
      "/": "/",
    };
    res.status(200).send(result);
  });

  app.get("/get-data", async function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        function compare(a, b) {
          if (a.MatchNo < b.MatchNo) {
            return 1;
          }
          if (a.MatchNo > b.MatchNo) {
            return -1;
          }
          return 0;
        }
        await client
          .db("FantasyBook")
          .collection(mongoCollectionName)
          .find()
          .toArray(function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            result.sort(compare);
            res.status(StatusCodes.OK).send(result);
          });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.post("/add-data", async function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        if (req.body.MatchNo == null) {
          req.body.MatchNo = 1;
        }
        req.body.MatchNo = Number(req.body.MatchNo);
        req.body.Investment = Number(req.body.Investment);
        req.body.Winnings = Number(req.body.Winnings);
        req.body.ProfitOrLoss = Number(req.body.ProfitOrLoss);
        await client
          .db("FantasyBook")
          .collection(mongoCollectionName)
          .insertOne(req.body, function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            res.status(StatusCodes.OK).send(result);
          });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.post("/delete-data", async function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        await client
          .db("FantasyBook")
          .collection(mongoCollectionName)
          .deleteOne({ MatchNo: req.body.thisValue }, function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            res.status(StatusCodes.OK).send(result);
          });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.post("/update-data", async function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        await client
          .db("FantasyBook")
          .collection(mongoCollectionName)
          .updateOne(
            { MatchNo: req.body.MatchNo },
            {
              $set: {
                MatchDateTime: req.body.MatchDateTime,
                Tour: req.body.Tour,
                Round: req.body.Round,
                Investment: req.body.Investment,
                Winnings: req.body.Winnings,
                ProfitOrLoss: req.body.ProfitOrLoss,
              },
            },
            function (error, result) {
              if (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
              }
              res.status(StatusCodes.OK).send(result);
            }
          );
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  app.get("/get-lib-tour", function (req, res) {
    client.connect(async (error) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
      }
      await client
        .db("FantasyBook")
        .collection("lib-tour")
        .find()
        .toArray(function (error, result) {
          if (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
          }
          console.log(result);
          resultArr = [];
          result.forEach((data) => {
            console.log(data);
            resultArr.push(data.Tour);
          });
          res.status(StatusCodes.OK).send(resultArr);
        });
      r;
    });
  });

  app.post("/add-lib-tour", function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        await client
          .db("FantasyBook")
          .collection("lib-tour")
          .insertOne(req.body, function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            res.status(StatusCodes.OK).send(result);
          });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

  // app.post("/update-lib-tour", function (req, res) {
  //   try {
  //     client.connect(async (error) => {
  //       if (error) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  //       }
  //       const myquery = { MatchNo: req.body.KeyValue };
  //       const newvalues = { $set: req.body.updatedValue };
  //       await client
  //         .db("FantasyBook")
  //         .collection("lib-tour")
  //         .updateOne(myquery, newvalues, function (error, result) {
  //           if (error) {
  //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  //           }
  //           res.status(StatusCodes.OK).send(result);
  //         });
  //     });
  //   } catch (error) {
  //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  //   }
  // });

  app.post("/delete-lib-tour", function (req, res) {
    try {
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        await client
          .db("FantasyBook")
          .collection("lib-tour")
          .deleteOne({ Tour: req.body.Tour }, function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            res.status(StatusCodes.OK).send(result);
          });
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });
};

module.exports = appRouter;
