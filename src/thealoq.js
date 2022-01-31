const { Client, Intents, Message, MessageEmbed, MessageActionRow, MessageButton, Collection } = require('discord.js');
const client = new Client({ intents: Object.values(Intents.FLAGS).reduce((p, c) => p + c, 0) });
const config = require("./config.json")
const mongoose = require("mongoose");
const Data = require("./models/channel")

client.on('ready', async () => {
    client.user.setPresence({ activities: [{ name: config.footer }, { name: config.footer2 }], status: 'idle' });
});

mongoose.connect(config.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Mongoya Bağlandı")).catch(e => console.error(e));

client.login(config.token).then(e => console.log(`${client.user.username} Bağlandı`)).catch(e => console.error(e));

client.on("messageCreate", async (message) => {
    const filter = i => i.user.id === message.member.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000, userLimit: 1 });
    collector.on('collect', async b => {
        if (b.isButton()) {
             if(b.customId === "Delete") {
                let ChannlData = await Data.findOne({ GuildId: message.guild.id, UserId: message.member.id })
                message.guild.channels.cache.get(ChannlData.ChannelId).delete().then(msg => 
                    msg.reply("Başariyla Silindi")
                ).catch(e => { console.error({ }) })
                await Data.deleteOne({ GuildId: message.guild.id, UserId: message.member.id })
            }

            if (b.customId === "TwoSize") {
                await message.guild.channels.create(`🔈${message.member.user.username} Odasi`, {
                    type: "GUILD_VOICE",
                    parent: config.kategori,
                    userLimit: "2",
                    permissionOverwrites: [
                        {
                            id: message.member.id,
                            allow: ['VIEW_CHANNEL']
                        },
                    ],
                }).then(msg => {
                    new Data({
                        GuildId: message.guild.id,
                        UserId: message.member.id,
                        ChannelId: msg.id
                    }).save()
                    message.channel.send({ content: 'Başariyla Odaniz Oluştu!', ephemeral: true })
                });
            }
            if (b.customId === "FourSize") {
                await message.guild.channels.create(`🔈${message.member.user.username} Odasi`, {
                    type: "GUILD_VOICE",
                    parent: config.kategori,
                    userLimit: "4",

                    permissionOverwrites: [
                        {
                            id: message.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                    ],
                }).then(msg => {
                    new Data({
                        GuildId: message.guild.id,
                        UserId: message.member.id,
                        ChannelId: msg.id
                    }).save()
                    message.channel.send({ content: 'Başariyla Odaniz Oluştu!', ephemeral: true })
                });
            }
            if (b.customId === "SixSize") {
                await message.guild.channels.create(`🔈${message.member.user.username} Odasi`, {
                    type: "GUILD_VOICE",
                    parent: config.kategori,
                    userLimit: "6",

                    permissionOverwrites: [
                        {
                            id: message.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                    ],
                }).then(msg => {
                    new Data({
                        GuildId: message.guild.id,
                        UserId: message.member.id,
                        ChannelId: msg.id
                    }).save()
                    message.channel.send({ content: 'Başariyla Odaniz Oluştu!', ephemeral: true })
                });
            }
            if (b.customId === "iptal") {
                message.delete();
                message.channel.send('İşlem iptal edildi')
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    });
            }
        }
        collector.stop()
        b.message.delete().catch(e => { console.error({}) })
    })
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('Delete')
                .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "moon")}`)
                .setLabel("Kanalınizi Silmek İstiyor Musunuz")
                .setStyle('SUCCESS'))
        .addComponents(
            new MessageButton()
                .setCustomId('iptal')
                .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "x_")}`)
                .setLabel("İptal")
                .setStyle('DANGER'))
    if (message.author.bot) return
    if (message.content.toLowerCase() == "!Oda") {
        let ChannlData = await Data.findOne({ GuildId: message.guild.id, UserId: message.member.id })
        if (ChannlData) {
            return message.reply({ content: "Zaten Odaniz Bulunyor", components: [row] })
        } else {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('TwoSize')
                        .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "Two")}`)
                        .setLabel("Kişilik")
                        .setStyle('SUCCESS'))
                .addComponents(
                    new MessageButton()
                        .setCustomId('FourSize')
                        .setLabel("Kişilik")
                        .setStyle('SUCCESS')
                        .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "Four")}`))
                .addComponents(
                    new MessageButton()
                        .setCustomId('SixSize')
                        .setLabel("Kişilik")
                        .setStyle('SUCCESS')
                        .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "Six")}`))
                .addComponents(
                    new MessageButton()
                        .setCustomId('iptal')
                        .setEmoji(`${client.emojis.cache.find(thealoq => thealoq.name === "x_")}`)
                        .setLabel("İptal")
                        .setStyle('DANGER'))
           message.reply({ content: "Lütfen Kaç Kişilik Olucağini Seçin", components: [row] })
            
        }


      


    }

})
