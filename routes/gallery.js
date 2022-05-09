const multer = require('multer')
const limit = require('../config/multer').limit
const fs = require("fs")

module.exports = (app)=>{

    //importar o config database
    var database = require('../config/database')
    //importar o model gallery
    var gallery = require('../models/gallery')

    //exibir o formulario gallery.ejs
    app.get('/gallery',async(req,res)=>{
        let id = req.query.id
        //conectar com o database
        database()
        //executar a busca de documentos da coleção gallery
        var documentos = await gallery.find().sort({_id:id})

        documentos.sort(function(a,b){
            if (a.enviado > b.enviado){
                return -1;
            }

            else if (a.enviado < b.enviado){
                return 1;
            }

            else if(a.enviado == b.enviado){
                return 0;
            }

            else{
                return console.error("err");
            }
        })
        
        res.render('gallery.ejs',{dados:documentos})
    })

    //importar a config do multer
    var upload = require('../config/multer').upload
    //upload do arquivo
    app.post('/gallery',(req,res)=>{
        //upload das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send(`O arquivo é maior que ${limit}kb`)
            }else if(err){
                res.send('Tipo de Arquivo inválido')
            }else{
                //conectar ao database
                database()
                //gravar o nome do arquivo na coleção gallery
                var documento = await new gallery({
                arquivo:req.file.filename
                }).save()
                res.redirect('/gallery')

            }
        })
    })


    app.get("/alterar_gallery", async function (req,res) {
        let id = req.query.id

        /*let action = req.query.action*/

        let ver = await gallery.findOne({_id:id})


        res.render("gallery_alterar.ejs",{dados:ver})
    })

    app.get("/excluir_gallery", async function (req,res) {
        let id = req.query.id

        /*let action = req.query.action*/

        let ver = await gallery.findOne({_id:id})


        res.render("gallery_excluir.ejs",{dados:ver})
    })




    app.post('/alterar_gallery',(req,res)=>{


        let id = req.query.id

        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send(`O arquivo é maior que ${limit}kb`)
            }else if(err){
                res.send('Tipo de Arquivo inválido')
            }else{
                //conectar ao database
                database()

                /*excluir o arquivo anterior */

                try{
                    fs.unlinkSync(`uploads/${req.body.anterior}`)
                }
        
                catch(err){
                    console.error(err)
                }
        
                //gravar o nome do arquivo na coleção gallery
                var documento = await gallery.findOneAndUpdate(
                {_id:id},
                {arquivo:req.file.filename}
                
                )
                //res.redirect('/gallery')

            }
        })

        res.redirect('/gallery')        
    })

    app.post("/excluir_gallery",async function (req,res) {
        let id = req.query.id
    
        /*Localizar e Excluir */
        
        console.log(`uploads/${req.body.anterior}`)

        try{
            fs.unlinkSync(`uploads/${req.body.anterior}`)
        }

        catch(err){
            console.error(err)
        }




        let excluir = await gallery.findOneAndRemove({_id:id})
    
        /*Redirecionar de volta */
    
        res.redirect("/gallery",) 
    })

    
}