const handleHttpError = (res, message, code= 403) =>{
    console.log(message)
    res.status(code).send(message)
}
module.exports = { handleHttpError }