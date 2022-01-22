const { MongoClient } = require("mongodb");
const { StatusCodes } = require("http-status-codes");

var appRouter = function (app) {
  app.get("/", function (req, res) {
    const result = {
      "/": "/",
    };
    res.status(200).send(result);
  });

  app.get("/get-data", async function (req, res) {
    try {
      const uri =
        "mongodb+srv://root:root@fantasybook.qxgk4.mongodb.net/FantasyBook?retryWrites=true&w=majority";
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect(async (error) => {
        if (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        function compare( a, b ) {
          if ( a.MatchNo < b.MatchNo ){
            return -1;
          }
          if ( a.MatchNo > b.MatchNo ){
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
      const uri =
        "mongodb+srv://root:root@fantasybook.qxgk4.mongodb.net/FantasyBook?retryWrites=true&w=majority";
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
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
      const uri =
        "mongodb+srv://root:root@fantasybook.qxgk4.mongodb.net/FantasyBook?retryWrites=true&w=majority";
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
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
};

module.exports = appRouter;
