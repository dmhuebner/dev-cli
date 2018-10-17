const express = require('express');

const fooRoutes = (Foo) => {
  const fooRouter = express.Router();

  const fooController = require('../controllers/fooController')(Foo);

  /*=========================================
  * Middleware for routes with :fooId param
  *=========================================*/
  fooRouter.use('/:fooId', (req, res, next) => {
    Foo.findById(req.params.fooId, (err, foo) => {
      if (err) {
        res.status(500).send(err);
      } else if (foo) {
        req.foo = foo;
        next();
      } else {
        res.status(404).send('No foo found');
      }
    });
  });

  /*=================
  * Routes exposed
  *=================*/
  fooRouter.route('/')
    .post(fooController.post)
    .get(fooController.get);

  fooRouter.route('/:fooId')
    .get(fooController.getOne)
    .put(fooController.put)
    .patch(fooController.patch)
    .delete(fooController.delete);

  return fooRouter;
};

module.exports = fooRoutes;