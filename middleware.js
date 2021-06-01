const clearQuery = (req, res, next) => {
    console.log(req.url)
    next()
}

module.exports = clearQuery