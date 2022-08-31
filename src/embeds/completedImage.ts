import { EmbedBuilder, Message } from 'discord.js'
import { Bot } from '../bot'
import { BotEmbed } from '../types'

interface EmbedArgs {
    message: Message,
    imageData: string
}

export default function(bot: Bot, args: EmbedArgs): BotEmbed {
    console.log(bot, args)

    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#6aaa64')
                .setTitle('Stable Confusion')
                .setDescription('Your image is ready.')
                .setImage('https://i.imgur.com/B2AHqpO.png')
                .setThumbnail('https://i.imgur.com/ENzx65A.gif')
                .setTimestamp()
        ]
    }
}
