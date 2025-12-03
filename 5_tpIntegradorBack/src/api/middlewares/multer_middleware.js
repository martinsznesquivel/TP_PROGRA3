import multer from "multer";
import { __dirname, join } from "../utils/index.js";
import path from "path";
import { randomUUID } from "crypto";
import { callbackify } from "util";
import { error } from "console";

const storageConfig = multer.diskStorage({
    destination:(req, file, callback) => {
         callback(null, join(__dirname, "src/public/img")
        )
    }
    ,filename:(req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const nombreFichero = randomUUID() + ext;
        callback(null, nombreFichero)
    }
})

const fileFilterConfig = (req, file, callback) => {
    const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg"]
    const tipo = file.mimetype
    if (!tiposPermitidos.includes(tipo)){
        callback(new Error("tipo de archivo no permitido"))
    }
    callback(null, true)
}

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError){
        return res.status(400).json({
            error : err.code,
            message : err.message
        });
    }
    if (err){
        return res.status(400).json({
            error : err.message
        });
    }
    return res.status(500).json({
        error : err.message
    })
}

export const multerUploader = multer ({
    storage : storageConfig,
    limits : {fileSize: 5 * 1024 * 1024},
    fileFilter : fileFilterConfig,


})
