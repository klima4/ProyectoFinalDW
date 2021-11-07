// //instrucciones para el bot
const { Telegraf } = require('telegraf')
const bot = new Telegraf('2007768394:AAGxyT_BhjEs9MuRyWH7vlHTcNId3h3x4Jw') //declaramos el bot con el token creado 


bot.start((ctx) => ctx.reply('Bienvenido, proyecto DW')) //mensaje de respuesta
bot.launch() //inicializacion del bot respuestas

bot.settings((ctx) =>{
    ctx.reply('comand custond prueba')
})

//comando personallizado
bot.command(['alumnos', 'Alumnos '], (ctx) =>{
    ctx.reply('Los alumnos del sistema son los siguientes')
})

//palabras
bot.hears(['Hola','hola'], ctx =>{
    ctx.reply('Bienvenido al sistema de consultas')
})

bot.on('text', ctx =>{
    ctx.reply('text message')
})

bot.on('sticker', ctx =>{
    ctx.reply('sticker message :)')
})