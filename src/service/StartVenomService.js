const express = require("express")
const {
    Configuration,
    OpenAIApi
} = require("openai")

const {
    create
} = require('venom-bot')

class StartVenomService {
    async execute() {
        const configuration = new Configuration({
            organization: process.env.ORGANIZATION_ID,
            apiKey: process.env.OPENAI_KEY,
        });

        const openai = new OpenAIApi(configuration);

        const getDavinciResponse = async (clientText) => {
            const options = {
                model: "text-davinci-003", // Modelo GPT a ser usado
                prompt: clientText, // Texto enviado pelo usuário
                temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
                max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
            }

            try {
                const response = await openai.createCompletion(options)
                let botResponse = ""
                response.data.choices.forEach(({
                    text
                }) => {
                    botResponse += text
                })
                return `MestreSupremo 🤖\n\n ${botResponse.trim()}`
            } catch (e) {
                return `❌ OpenAI Response Error: ${e.response.data.error.message}`
            }
        }

        const getDalleResponse = async (clientText) => {
            const options = {
                prompt: clientText, // Descrição da imagem
                n: 1, // Número de imagens a serem geradas
                size: "1024x1024", // Tamanho da imagem
            }

            try {
                const response = await openai.createImage(options);
                return response.data.data[0].url
            } catch (e) {
                return `❌ OpenAI Response Error: ${e.response.data.error.message}`
            }
        }

        const commands = (client, message) => {
            console.log("message", message);
            if (message.sender.name === 'Kaio') return;
            // console.log("New Message: '", message.body, "'\nfrom:", message.sender.name);

            const iaCommands = {
                davinci3: "MestreSupremo",
                dalle: "/img"
            }

            let firstWord = message.body.substring(0, message.body.indexOf(" "));
            console.log("firstWord:", firstWord);

            // if (firstWord.include("MestreSupremo"))
            // {
            //     const question = message.body.substring(message.body.indexOf(" "));
            //     getDavinciResponse(question).then((response) => {
            //         /*
            //             * Faremos uma validação no message.from
            //             * para caso a gente envie um comando
            //             * a response não seja enviada para
            //             * nosso próprio número e sim para 
            //             * a pessoa ou grupo para o qual eu enviei
            //             */
            //         client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
            //     })
            // }
            switch (firstWord) {
                case iaCommands.davinci3:
                    const question = message.body.substring(message.body.indexOf(" "));
                    getDavinciResponse(question).then((response) => {
                        /*
                         * Faremos uma validação no message.from
                         * para caso a gente envie um comando
                         * a response não seja enviada para
                         * nosso próprio número e sim para 
                         * a pessoa ou grupo para o qual eu enviei
                         */
                        client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
                    })
                    break;

                case iaCommands.dalle:
                    const imgDescription = message.body.substring(message.body.indexOf(" "));
                    getDalleResponse(imgDescription, message).then((imgUrl) => {
                        client.sendImage(
                            message.from === process.env.PHONE_NUMBER ? message.to : message.from,
                            imgUrl,
                            imgDescription,
                            'Imagem gerada pela IA DALL-E 🤖'
                        )
                    })
                    break;
            }
        }

        async function start(client) {
            console.log("START BOT 🤖");
            client.onAnyMessage((message) => commands(client, message));
        }

        let qrCode = "";
        
        create({
            session: 'chat-gpt',
            multidevice: true
        }).then((client) => {
            start(client); 
            return {
                success: true,
                qrCode: qrCode,
            };
        }
        ).catch((erro) => {
            console.log("Erro ao executar o Venom: ", erro);
            return {erro: erro}
        });
    }
}

module.exports = new StartVenomService()