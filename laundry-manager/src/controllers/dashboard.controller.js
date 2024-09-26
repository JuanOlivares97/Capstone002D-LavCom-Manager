function renderHome(req, res) {
    try {
        return res.render("dashboard/home");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

 module.exports = {
    renderHome
}