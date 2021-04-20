const Discord = require("discord.js");
const ytdl = require("ytdl-core"); 

const Client = new Discord.Client;

const prefix = "/"; 

Client.on("ready" , () =>{
    console.log("bot oppérationnel");
});

Client.on("message", message => {
    if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");
            
            if(args[1] == undefined){
                message.reply("Nombre de message non ou mal défini .");
            }
            else {
                let number = parseInt(args[1]);

                if(isNaN(number)){
                    message.reply("Nombre de message non ou non défini .");
                }
                else {
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("Suppresion de " + messages.size + " messages réussi !");
                    }).catch(err => {
                        console.log("Erreur de clear : " + err);
                    });
                }
            }
        }
    }
});

var list = [];

Client.on("message",message => {
    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection => {
                let args = message.content.split (" ");
                
                if(!args[1]){
                   message.reply("Lien de la vidéo non ou mal mentionné.");
                   connection.disconnect(); 
                }
                else {

                

                let dispatcher = connection.play(ytdl(args[1], { quality: "highestaudio"}));
            
            dispatcher.on("finish", () => {
                dispatcher.destroy();
                connection.disconnect();
                });

                dispatcher.on("error", err => {
                    console.log("erreur de dispatcher : " + err);
                });
            }
            }).catch(err =>{
                message.reply("Erreur lors de la connexion : " + err);
            });
        }
        else {
            message.reply("Vous n'êtes pas connecé dans un salon vocale .");
        }
    }
});


Client.on("message",message => {
    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            let args = message.content.split(" ");

            if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                message.reply("Lien de la vidéo non ou mal mentionné.");
            
            }
            else{
                if(list.length > 0){
                    list.push(args[1]);
                    message.reply("Vidéo ajouté à la liste avec succès !");
                }
                else {
                    list.push(args[1]);
                    message.reply("Vidéo ajoué à la liste avec succès !");

                    message.member.voice.channel.join().then(connection => {
                        playMusic(connection);

                        connection.on("disconnect", () => {
                            list = [];
                        });

                    }).catch(err => {
                        message.reply("Erreur lors de la connexion : " + err);
                    })
                }
            }
        }
    }
});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality: "highestaudio"}));

    dispatcher.on("finish", () => {
        list.shift();
         dispatcher.destroy();

         if(list.length > 0){
             playMusic(connection);
         }
         else{
             connection.disconnect();
         }
    });

    dispatcher.on("error", err => {
        console.log("erreur de dispatcher :" + err);
        dispatcher.destroy();
        connection.disconnect();
    });
}

Client.on("guildMemberAdd" , member => {
    console.log("Un nouveau membre est arrivé sur le serveur bienvenue a toi ^^");
    member.guild.channels.cache.find(channel => channel.id === "830012174100725770").send(member.dispalyName + "est arrivé sur le serveur bienvenue a toi ^^\nNous sommes désormais **" + member.guild.memberCount + " sur le serveur !")
});

Client.on("guildMemberRemove" , member => {
    console.log("Un membre nous a quité");
    member.guild.channels.cache.find(channel => channel.id === "833662035963281408").send(member.dispalyName + "a quité le serveur :airplane_departure:");
});

Client.on("message", message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){

            }
            else{
                if(mention.bannable){
                    mention.ban();
                    message.channel.send(mention.displayName + "a été banni avec succès");     

                }
                else{
                    message.reply("Impossible de bannir ce membre .");
                }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné.");
            }
            else{
                if(mention.kickable){
                    mention.kick();
                    message.channel.send(mention.displayName + "a été kick avec succès.");
                }
                else {
                    message.reply("Impossible de kick ce membre.");
                }
            }
        }
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné.");
            }
            else{
                mention.roles.add("833493880229724160");
                message.channel.send(mention.displayName + " mute avec succès.");
            }
        }
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné.");
            }
            else{
                mention.roles.remove("833493880229724160");
                message.channel.send(mention.displayName + " un mute avec succès.");
            }
        }
    };

    ///ping
    if(message.content == prefix + "ping"){
        message.channel.send("pong");
    }

    if(message.content == prefix + "stat"){
        message.channel.send("**" + message.author.username + "**" + " qui a pour id  : __" + message.author.id + "__ a posté un message");
    }
});


Client.login(process.env.TOKEN);