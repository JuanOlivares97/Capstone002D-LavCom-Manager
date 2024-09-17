function showHome(req, res) {
    try {
        res.render('reports/home')
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    showHome
}