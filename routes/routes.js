const { MongoClient } = require("mongodb");
const { StatusCodes } = require("http-status-codes");

var appRouter = function (app) {
  const uri =
    "mongodb+srv://root:root@fantasybook.qxgk4.mongodb.net/FantasyBook?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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
            return -1;
          }
          if (a.MatchNo > b.MatchNo) {
            return 1;
          }
          return 0;
        }
        await client
          .db("FantasyBook")
          .collection("records")
          .find()
          .toArray(function (error, result) {
            if (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
            result.sort(compare);
            res.status(StatusCodes.OK).send(result);
          });
        r;
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
        await client
          .db("FantasyBook")
          .collection("records")
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
          .collection("records")
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

  app.post("/update-lib-tour", function (req, res) {});

  app.post("/delete-lib-tour", function (req, res) {});
};

module.exports = appRouter;
