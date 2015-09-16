global.__controllers = __base + '/controllers';

module.exports = function(app){

  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  /* add example routers */
  app.use('/example', require('./example'));


};
