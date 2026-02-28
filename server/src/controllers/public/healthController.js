async function getHealth(req, res) {
    res.json({ status: "good health", message: "service is running" });
}

module.exports = {
    getHealth
};