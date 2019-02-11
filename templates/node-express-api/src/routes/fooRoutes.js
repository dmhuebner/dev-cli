const express = require('express');

const {%firstModelLowerCase%}Routes = ({%firstModelCapitalized%}) => {
  const {%firstModelLowerCase%}Router = express.Router();

  const {%firstModelLowerCase%}Controller = require('../controllers/{%firstModelLowerCase%}Controller')({%firstModelCapitalized%});

  /*=========================================
  * Middleware for routes with :{%firstModelLowerCase%}Id param
  *=========================================*/
  {%firstModelLowerCase%}Router.use('/:{%firstModelLowerCase%}Id', (req, res, next) => {
    {%firstModelCapitalized%}.findById(req.params.{%firstModelLowerCase%}Id, (err, {%firstModelLowerCase%}) => {
      if (err) {
        res.status(500).send(err);
      } else if ({%firstModelLowerCase%}) {
        req.{%firstModelLowerCase%} = {%firstModelLowerCase%};
        next();
      } else {
        res.status(404).send('No {%firstModelLowerCase%} found');
      }
    });
  });

  /*=================
  * Routes exposed
  *=================*/
  {%firstModelLowerCase%}Router.route('/')
    .post({%firstModelLowerCase%}Controller.post)
    .get({%firstModelLowerCase%}Controller.get);

  {%firstModelLowerCase%}Router.route('/:{%firstModelLowerCase%}Id')
    .get({%firstModelLowerCase%}Controller.getOne)
    .put({%firstModelLowerCase%}Controller.put)
    .patch({%firstModelLowerCase%}Controller.patch)
    .delete({%firstModelLowerCase%}Controller.delete);

  return {%firstModelLowerCase%}Router;
};

module.exports = {%firstModelLowerCase%}Routes;
