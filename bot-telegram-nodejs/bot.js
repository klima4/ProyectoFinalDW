//instrucciones para el bot
const { Telegraf } = require('telegraf')
const bot = new Telegraf('2007768394:AAGxyT_BhjEs9MuRyWH7vlHTcNId3h3x4Jw') //declaramos el bot con el token creado 

bot.help(ctx => {
    const helpMessage = `
    /start - Iniciar bot
    `

    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "Profesor"
    })
})

//inicializacion de bot
bot.command('start', ctx => {
    sendStartMessage(ctx);
})

//se hacen las peticiones por medio de una respectiva funcion
function sendStartMessage (ctx) {
    const startMessage = "Te damos la Bienvenida a este bot, sera un gusto atenderte, por motivos de seguridad y confidencialidad verificaremos que eres parte de nuestra Institucion Educatica";
}

bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "Esta es nuestra página :)", url: "localhost:800"}
            ],
            [
                {text: "Visualizar datos", callback_data: 'info'}  
            ],
          
            [
                {text: "Otros", callback_data: 'menu'}
            ]
        ]
    }
})

//gestion de correo
bot.command('correo', ctx => {
    correo (ctx);
})

//se hacen las peticiones por medio de una respectiva funcion
function correo(ctx)  {
    bot.telegram.sendMessage(ctx.chat.id,`${ctx.chat.text}`);  
}

//información acerca de nuestro bot
bot.action('info', ctx => {
    ctx.answerCbQuery();
    ctx.reply(`Para ver tus datos envia 'correo (tu correo)'`);

})

//despliegue de menu
bot.action('menu', ctx => {
    ctx.answerCbQuery();

    const menuMessage = "Selecciona una opción"
    bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Frase del dia :)" },
                    { text: "información sobre desarrollo y tecnología" }
                 
                ],
                [
                    { text: "Salir" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    
})
bot.hears('Frase del dia', async (ctx) => {
    const quote = await fetchQuote('frase')
    ctx.reply(quote);
})


bot.hears('información sobre desarrollo y tecnología', async (ctx) => {
    const quote = await fetchQuote('info')
    ctx.reply(quote);
})

bot.hears('Salir', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Adiós, te veo luego", {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

async function fetchQuote(type) {
    const res = await axios.get('localhost:800/menu' + type);
    return res.data.quote;
}

//busqueda de datos
const buscaDatos =async (ctx, correo) =>{
    try{
         const respuesta = await axios.get('localhost:800/api/educacion',{data:{correo}})
         console.log(respuesta.data)

         const data = respuesta.data;
         ctx.reply(`
         Nombre: ${data.nombre}
Cursos: ${data.cursosList}
         `);
    }
  catch(err){
      console.log(err)
      return  ctx.reply(JSON.stringify('Lo sentimos no hay conexion'));
  }

  
}

bot.on('text', ctx => {
    
    const mensaje = ctx.update.message.text.toLowerCase();
 
 
    const comando = mensaje.split(' ');
 
    switch (comando[0]) {
        case 'correo':
             buscaDatos(ctx, comando[1])
            break;
    
        default:
         ctx.reply('No te entendi')
            break;
    }
 
    console.log(comando)
 
 
 
 })
 





bot.launch();