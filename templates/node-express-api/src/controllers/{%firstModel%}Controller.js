const {%firstModel%}Controller = ({%firstModel[capitalized]%}) => {

  const post = (req, res) => {
    const {%firstModel%} = new {%firstModel[capitalized]%}(req.body);

    if (!req.body.someText) {
      res.status(400);
      res.send('Bad Request');
    } else {
      {%firstModel%}.save((err) => {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201);
          res.send({%firstModel%});
        }
      });
    }
  };

  const get = (req, res) => {
    const query = {};

    /* Add valid query string to query object */
    if (req.query.someBoolean) {
      query.someBoolean = req.query.someBoolean;
    }

    // Check if query string is valid if there is one
    if (JSON.stringify(req.query) !== JSON.stringify(query)) {
      res.status(400).send('Bad Request: Invalid query string');
    } else {
      {%firstModel[capitalized]%}.find(query, (err, {%firstModel%}s) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({%firstModel%}s);
        }
      });
    }
  };

  const getOne = (req, res) => {
    // The middleware in the {%firstModel%}Route already adds the {%firstModel%} to the request
    res.status(200).json(req.{%firstModel%});
  };

  const put = (req, res) => {
    req.{%firstModel%}.someText = req.body.someText;
    req.{%firstModel%}.anotherThing = req.body.anotherThing;
    req.{%firstModel%}.someBoolean = req.body.someBoolean;

    req.{%firstModel%}.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.{%firstModel%});
      }
    });
  };

  const patch = (req, res) => {
    // Remove _id from request body if it is there as we will not be updating it
    if (req.body._id) {
      delete req.body._id;
    }
    for (let prop in req.body) {
      req.{%firstModel%}[prop] = req.body[prop];
    }

    req.{%firstModel%}.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.{%firstModel%});
      }
    });
  };

  const delete{%firstModel[capitalized]%} = (req, res) => {
    req.{%firstModel%}.remove((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(204);
      }
    });
  };

  return {
    post: post,
    get: get,
    getOne: getOne,
    put: put,
    patch: patch,
    delete: delete{%firstModel[capitalized]%}
  };
};

module.exports = {%firstModel%}Controller;
