const express = require('express');

const {%firstModel%}Routes = ({%firstModel[capitalized]%}) => {
  const {%firstModel%}Router = express.Router();

  const {%firstModel%}Controller = require('../controllers/{%firstModel%}Controller')({%firstModel[capitalized]%});

  /*=========================================
  * Middleware for routes with :{%firstModel%}Id param
  *=========================================*/
  {%firstModel%}Router.use('/:{%firstModel%}Id', (req, res, next) => {
    {%firstModel[capitalized]%}.findById(req.params.{%firstModel%}Id, (err, {%firstModel%}) => {
      if (err) {
        res.status(500).send(err);
      } else if ({%firstModel%}) {
        req.{%firstModel%} = {%firstModel%};
        next();
      } else {
        res.status(404).send('No {%firstModel%} found');
      }
    });
  });

  /*=================
  * Routes exposed
  *=================*/
  {%firstModel%}Router.route('/')
    .post({%firstModel%}Controller.post)
    .get({%firstModel%}Controller.get);

  {%firstModel%}Router.route('/:{%firstModel%}Id')
    .get({%firstModel%}Controller.getOne)
    .put({%firstModel%}Controller.put)
    .patch({%firstModel%}Controller.patch)
    .delete({%firstModel%}Controller.delete);

  return {%firstModel%}Router;
};

module.exports = {%firstModel%}Routes;
