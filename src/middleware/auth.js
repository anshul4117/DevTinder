const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send({ message: "Admin not authorized" });
    } else {
        next();
    }
}
module.exports = {
    adminAuth,
}
