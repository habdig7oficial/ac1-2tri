//importar o pacote multer
const multer = require('multer')

let limit = 1000000

//configurar o armazenamento
const armazenamento = multer.diskStorage(
    {
        //pasta de destino
        destination:(req,file,cb)=>{
            cb(null,'./uploads/')
        },
        //nome do arquivo
        filename:(req,file,cb)=>{
            cb(null,Date.now()+file.originalname)
        }
    }
)

var upload = multer({
    storage: armazenamento,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/svg"
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error("Tipo de arquivo inválido"))
        }
    },
    limits: { fileSize: limit }

}).single("imagem")    

module.exports = {upload, limit}