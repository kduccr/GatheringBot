const Discord = require("discord.js");
const client = new Discord.Client();
const preferences = require("./preferences.json")
const config = require("./config.json");


function checkAgree(dados) {

    if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return;
    if (dados.d.message_id != preferences.ruleMessageId) return;

    let servidor = client.guilds.cache.get(preferences.server);
    let membro = servidor.members.cache.get(dados.d.user_id);

    if (dados.t === "MESSAGE_REACTION_ADD") {
        if (dados.d.emoji.name === "✅") {
            if (membro.roles.cache.has(preferences.concorda)) return;
            membro.roles.add(preferences.concorda);
            membro.roles.remove(preferences.aprovado);
        }
    }
}

const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`Bot iniciado com ${client.users.cache.size - 1} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidor.`);
});

client.on('raw', async dados => {
    checkAgree(dados);
})

client.on('message', message => {
    let args = message.content.substring(config.prefix.length).split(" ");
    switch (args[0].toLowerCase()) {

        case "registrar":
            client.commands.get('registrar').execute(message, args);
            break;

        case "buscar":
            
            client.commands.get('buscar').execute(message, args);
            break;
    }
});

client.login(config.token);