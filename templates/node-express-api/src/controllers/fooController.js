const fooController = (Foo) => {

  const post = (req, res) => {
    const foo = new Foo(req.body);

    if (!req.body.someText) {
      res.status(400);
      res.send('Bad Request');
    } else {
      foo.save((err) => {
        if (err) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201);
          res.send(foo);
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
      Foo.find(query, (err, foos) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(foos);
        }
      });
    }
  };

  const getOne = (req, res) => {
    // The middleware in the fooRoute already adds the foo to the request
    res.status(200).json(req.foo);
  };

  const put = (req, res) => {
    req.foo.someText = req.body.someText;
    req.foo.anotherThing = req.body.anotherThing;
    req.foo.someBoolean = req.body.someBoolean;

    req.foo.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.foo);
      }
    });
  };

  const patch = (req, res) => {
    // Remove _id from request body if it is there as we will not be updating it
    if (req.body._id) {
      delete req.body._id;
    }
    for (let prop in req.body) {
      req.foo[prop] = req.body[prop];
    }

    req.foo.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(req.foo);
      }
    });
  };

  const deleteFoo = (req, res) => {
    req.foo.remove((err) => {
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
    delete: deleteFoo
  };
};

module.exports = fooController;