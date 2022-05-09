module.exports = (app)=>{
    //importar a configuração do database
    var conexao = require('../config/database')
    //executar a conexao
    conexao()
    //importar o modelo mygrid
    var mygrid = require('../models/mygrid')

    //abrir o formulário
    app.get('/mygrid',async(req,res)=>{
        var resultado = await mygrid.find()
        console.log(resultado)
/*
        resultado.sort(function(a,b){
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
*/

        console.log(resultado)

        res.render('mygrid.ejs',{dados:resultado})
        //console.log(resultado)
    })


    //gravar as informações do formulário no banco de dados
    app.post('/mygrid',(req,res)=>{
        var documento = new mygrid({
            titulo:req.body.titulo,
            texto:req.body.texto
        }).save()
        .then(()=>{ res.redirect('/mygrid')})
        .catch(()=>{res.send('Não foi possível gravar')})
    })

    app.get("/vizualizar_mygrid", async function (req,res) {
        let id = req.query.id
        let action = req.query.action
        let ver = await mygrid.findOne({_id:id})

        if (action == "update") {
            res.render("update.ejs",{dados:ver})
        }

        else if (action = "delete"){
            res.render("excluir.ejs",{dados:ver})
        }

        else{
            res.send("ação não encontrada")
        }
    
        
    })

    app.post("/excluir_mygrid",async function (req,res) {
        let id = req.query.id
    
        /*Localizar e Excluir */
    
        let excluir = await mygrid.findOneAndRemove({_id:id})
    
        /*Redirecionar de volta */
    
        res.redirect("/mygrid") 
    })

    app.post("/alterar_mygrid",async function (req,res) {
        let id = req.query.id

        let dados = req.body

        //console.log(`\nid: ${id} \n dados: ${dados}`)
    
        /*Localizar e atualizar */
    
        let aletrar = await mygrid.findOneAndUpdate({_id:id},{titulo:dados.titulo,texto:dados.texto})
    
        /*Redirecionar de volta */
    
        res.redirect("/mygrid") 
    })
    
}


