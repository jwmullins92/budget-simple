// Wraps async functions to catch and handle errors on routes

const catchAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

module.exports = catchAsync