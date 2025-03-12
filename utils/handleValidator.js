const {validationResult} = require("express-validator");
const { handleHttpError } = require("./handleError");

const validateResults = (req, res, next) => {
    try{
        validationResult(req).throw()
        return next();
    }catch(err){
        res.status(422);
        res.send({errors: err.array()})
    }
}
module.exports = validateResults;