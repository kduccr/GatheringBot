
const axios = require("axios");
const preferences = require("../preferences.json")
const config = require("../config.json");

module.exports = {
    name: 'buscar',
    description: "Search a guild member for fame.",
    execute(message, args){
        if (message.content.toLowerCase().startsWith("!buscar")) {
            message.delete();
        }
        var memberList = []
        message.guild.members.cache.forEach(member => memberList.push(member.nickname));
        if (!memberList.includes(args[1])){
            try {
                message.channel.send("Buscando " + args[1]).then(sentMessage => {
                    sentMessage.delete({timeout: 10000});
                });
                let register = async () => {
                    let reponseGetPlayer = await axios.get(preferences.playerPath + args[1]);
                    let player = reponseGetPlayer.data;
                    let reponseGetPlayerDetail = await axios.get(preferences.playerDetailPath + player.players[0].Id);
                    let playerDetail = reponseGetPlayerDetail.data;
                    if (playerDetail.LifetimeStatistics.PvE.Total >= 0 && playerDetail.KillFame >= 0) {
                        message.member.roles.add(preferences.aprovado)
                        message.member.setNickname(player.players[0].Name);
                        message.channel.send(args[1] + " aprovado(a).").then(sentMessage => {
                            sentMessage.delete({timeout: 10000});
                        });    
                    }else{
                        message.channel.send("Você não possui a fama mínima necessária para se juntar à guild.").then(sentMessage => {
                            sentMessage.delete({timeout: 10000});
                        });
                    }
                };
                register(); 
            } catch (error) {
                console.log(error)
            }
        }else{
            message.channel.send(`Registro Negado. ${args[1]} já está em nossos registros.`).then(sentMessage => {
                sentMessage.delete({timeout: 10000});
            });
        }
    }
}