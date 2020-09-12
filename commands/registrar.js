
const axios = require("axios");
const preferences = require("../preferences.json");

module.exports = {
    name: 'registrar',
    description: "Register a guild member into discord.",
    execute(message, args){
        if (message.content.toLowerCase().startsWith("!registrar")) {  
            message.delete();
        }        
        try {            
            let register = async () => {
                let reponseGetPlayer = await axios.get(preferences.playerPath + args[1]);
                let player = reponseGetPlayer.data;
                console.log(player.players[0])
                if (player.players[0].GuildName === preferences.guild) {
                    message.channel.send("Registrando " + args[1]).then(sentMessage => {
                        sentMessage.delete({timeout: 7500})
                    })
                    message.member.roles.add(preferences.guildRole)
                    message.member.roles.remove(preferences.concorda)
                    message.member.setNickname(player.players[0].Name)
                    message.channel.send(args[1] + " registrado(a).").then(sentMessage => {
                        sentMessage.delete({timeout: 7500})
                    })
                }else{
                    message.channel.send("Você não pertence à guild.").then(sentMessage => {
                        sentMessage.delete({timeout: 7500})
                    })
                }
            };
            register();    
        } catch (error) {
            console.error(error)
        }        
    }
}