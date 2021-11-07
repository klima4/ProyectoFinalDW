//instrucciones para el bot
const { Telegraf } = require('telegraf')
const bot = new Telegraf('2007768394:AAGxyT_BhjEs9MuRyWH7vlHTcNId3h3x4Jw') //declaramos el bot con el token creado 

//indicamos el mensaje de inicio para que el usuario PRESIONE START para que inicie el bot
bot.help(ctx => {
    const helpMessage = `
    /start - Iniciar bot
    `

    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "Profesor"
    })
})

//indicamos que se iniciel el bot al presionar el comando start 
bot.command('start', ctx => {
    sendStartMessage(ctx);
})

//se hacen las peticiones por medio de una respectiva funcion sendStartMessage
function sendStartMessage (ctx) {
    const startMessage = "Bienvenido al Sistema De Educación Nacional Guatemalteca SENG"
}

//enviamos un mensaje luego de la bienvenida que muestre nuestros datos, y otras opciones qe pueden servirle al usuario
bot.telegram.sendMessage(ctx.chat.id, startMessage, { //se envia un mensaje al bot y se inicia
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

//gestion de envio de correo
bot.command('correo', ctx => {
    correo (ctx);
})

//luego se hacen las peticiones por medio de una respectiva funcion
function correo(ctx)  {
    bot.telegram.sendMessage(ctx.chat.id,`${ctx.chat.text}`);  
}

//solicitamos el correo del usuario para poder brindarle sus datos
bot.action('info', ctx => {
    ctx.answerCbQuery();
    ctx.reply(`Para ver tus datos envia 'correo (tu correo)'`);

})

//despliegue de menu de opciones al usuario
bot.action('menu', ctx => {
    ctx.answerCbQuery();
	
	//creamos un constante Menu mensaje la cual se mostrará en el bot
    const menuMessage = "Selecciona una opción"
    bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
		//al obtener el mensaje mandamos la respuesta
        reply_markup: {
            keyboard: [
                [
                    { text: "Frase del dia :)" },
                    { text: "Información sobre desarrollo y tecnología" }
                 
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
//cuando el bot reciba 'Frase del dia' indica una frase
bot.hears('Frase del dia', async (ctx) => {
    const quote = await fetchQuote('frase')
    ctx.reply(quote);
})

//cuando el bot recibe el siguiente mensaje envia por medio dela variable la informacion asignada
bot.hears('información sobre desarrollo y tecnología', async (ctx) => {
    const quote = await fetchQuote('info')
    ctx.reply(quote);
})

//cuando recibe el mesnaje salir el bot finaliza y envia un mensaje de despedida
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
const buscaDatos =async (ctx, correo) =>{ //busqueda de datos usando la variable de correo
    try{
         const respuesta = await axios.get('localhost:800/api/educacion',{data:{correo}}) //obtiene la direcion y e correo
         console.log(respuesta.data) //se imprime la respuesta y los datos almacenados en la variable data

         const data = respuesta.data; //la variable data es igual a la respuesta resultado de los datos del usuario en la base de datos
         ctx.reply(`
         Nombre: ${data.nombre}
Cursos: ${data.cursosList}
         `);
    }
	//si har error mostrar que no hay conexion
  catch(err){
      console.log(err)
      return  ctx.reply(JSON.stringify('Lo sentimos no hay conexion'));
  }

  
}
//cuando el bot recibe un mensaje cargar la informacion mediante el uso de una constante y un switch case
bot.on('text', ctx => {
    
    const mensaje = ctx.update.message.text.toLowerCase();
 
 
    const comando = mensaje.split(' ');
 
    switch (comando[0]) {
        case 'correo':
             buscaDatos(ctx, comando[1])
            break;
    
        default:
         ctx.reply('No te entendi') //si hay error indicarlo
            break;
    }
 
    console.log(comando)
 
 
 
 })
 





bot.launch();