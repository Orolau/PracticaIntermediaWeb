const {userModel} = require("../models/index");
const { handleHttpError } = require("../utils/handleError");

const checkUniqueCIF = async (req, res, next) => {
    try {
        const { role, company } = req.body;
        if (!company?.cif || role === "guest") {
            return next();
        }

        const existingUser = await userModel.findOne({
            "company.cif": company.cif,
            role: { $in: ["user", "admin"] },
        });

        if (existingUser) {
            return handleHttpError(res, "CIF_ALREADY_IN_USE", 409);
        }

        next();
    } catch (error) {
        console.error("Error in checkUniqueCIF middleware:", error);
        handleHttpError(res, "INTERNAL_SERVER_ERROR", 500);
    }
};

module.exports = checkUniqueCIF;
