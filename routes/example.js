var express = require('express');
var router = express.Router();

var example = require(__controllers + '/example');


router.route('/')
    .get(example.index)
    .post(example.create)

router.route('/new')
    .get(example.new)

router.route('/:id')
    .get(example.show)
    .patch(example.update)//or put
    .delete(example.destroy)

router.route('/:id/edit')
    .get(example.edit)


module.exports = router;