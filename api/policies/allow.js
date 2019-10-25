module.exports = async function (req, res, proceed) {
    res.header("Access-Control-Allow-Origin", "http://localhost:1337");
    res.header("Access-Control-Allow-Credentials", "true");
    return proceed();
}