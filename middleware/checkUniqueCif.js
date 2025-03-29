const {userModel} = require("../models/index");
const { handleHttpError } = require("../utils/handleError");

// Middleware para verificar si el CIF de la empresa ya está en uso
const checkUniqueCIF = async (req, res, next) => {
    try {
        const { role, company } = req.body;
        //si el rol del usuario es guest, puede contar con el cif de una empresa ya existente
        if (!company?.cif || role === "guest") {
            return next();
        }

        //si el usuario es user o admin, su empresa no puede tener el mismo cif que otra empresa de la base de datos
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
