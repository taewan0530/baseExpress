
// get - example
module.exports.index = function (req, res, next) {
    res.render('example/index',{
        _warp:'index',
        title:'example'
    });
}

// post - example
module.exports.create = function (req, res, next) {

}

// get - example/new
module.exports.new = function (req, res, next) {

}

// get - example/:id
module.exports.show = function (req, res, next) {

}

// get - example/:id/edit
module.exports.edit = function (req, res, next) {

}

// patch||put - example/:id
module.exports.update = function (req, res, next) {

}

// delete - example/:id
module.exports.destroy = function (req, res, next) {

}
