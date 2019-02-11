const {%firstModelLowerCase%}Controller = ({%firstModelCapitalized%}) => {

  const post = (req, res) => {
    const {%firstModelLowerCase%} = new {%firstModelCapitalized%}(req.body);

    if (!req.body.someText) {
      res.status(400);
      res.send('Bad Request');
    } else {
      {%firstModelLowerCase%}.save((err) => {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201);
          res.send({%firstModelLowerCase%});
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
      {%firstModelCapitalized%}.find(query, (err, {%firstModelLowerCase%}s) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({%firstModelLowerCase%}s);
        }
      });
    }
  };

  const getOne = (req, res) => {
    // The middleware in the {%firstModelLowerCase%}Route already adds the {%firstModelLowerCase%} to the request
    res.status(200).json(req.{%firstModelLowerCase%});
  };

  const put = (req, res) => {
    req.{%firstModelLowerCase%}.someText = req.body.someText;
    req.{%firstModelLowerCase%}.anotherThing = req.body.anotherThing;
    req.{%firstModelLowerCase%}.someBoolean = req.body.someBoolean;

    req.{%firstModelLowerCase%}.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.{%firstModelLowerCase%});
      }
    });
  };

  const patch = (req, res) => {
    // Remove _id from request body if it is there as we will not be updating it
    if (req.body._id) {
      delete req.body._id;
    }
    for (let prop in req.body) {
      req.{%firstModelLowerCase%}[prop] = req.body[prop];
    }

    req.{%firstModelLowerCase%}.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.{%firstModelLowerCase%});
      }
    });
  };

  const delete{%firstModelCapitalized%} = (req, res) => {
    req.{%firstModelLowerCase%}.remove((err) => {
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
    delete: delete{%firstModelCapitalized%}
  };
};

module.exports = {%firstModelLowerCase%}Controller;
