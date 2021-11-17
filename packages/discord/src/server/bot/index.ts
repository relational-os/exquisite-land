require('dotenv').config();
import prisma from '../helpers/prisma';
import Discord, {
  Intents,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed
} from 'discord.js';
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
  ]
});
// import { ethers, Transaction } from 'ethers';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import dayjs, { OpUnitType } from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import isProd from '../helpers/isProd';
// import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
// dayjs.extend(relativeTime);

// const PROVIDERS = {
//   ethereum: getJsonRpcProvider('mainnet'),
//   rinkeby: getJsonRpcProvider('rinkeby'),
//   mumbai: getJsonRpcProvider('polygon-mumbai'),
//   polygon: getJsonRpcProvider('polygon-mainnet')
// };

const embed = () => new MessageEmbed();
const attach = (attachment: any, name: any) =>
  new MessageAttachment(attachment, name);

client.on('messageCreate', async (message) => {
  console.log('messageCreate: message', message);
  if (!message.content.startsWith('!init')) return;
  await message.channel.send({
    embeds: [
      new MessageEmbed()
        .setColor('#5500ff')
        .setTitle('Link your wallet to Exquisite Land')
        .setDescription(
          'Tap the button below to link your Ethereum wallet address to your Discord profile. Land owners will be able to access private channels after linking their wallet.'
        )
    ],
    components: [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId('link-wallet')
          .setLabel('Link Wallet')
          .setStyle('PRIMARY')
      ])
    ]
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'link-wallet') {
    const user = await prisma.user.upsert({
      where: { discordId: interaction.user.id },
      create: {
        discordId: interaction.user.id,
        discordUsername: interaction.user.username,
        discordDiscriminator: interaction.user.discriminator,
        discordAvatar: interaction.user.avatarURL() as string
      },
      update: {}
    });
    await interaction.reply({
      ephemeral: true,
      content: `Please visit https://exquisite-roles.up.railway.app/link?id=${user.id} and tap Connect Wallet.`
    });
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
client.on('ready', () => {
  console.log('ready!');
});

function sendMessageWithImage(content: string, imageUrl: string) {
  // channel: terra-masu
  const channel = client.channels.cache.get('888518144346427392');
  if (channel) {
    if (channel.type == 'GUILD_TEXT') {
      // let testurl =
      // 'http://localhost:3001/api/tiles/terramasu/7/7/image?scale=500';
      // @ts-ignore
      return channel.send({
        content: content,
        embed: embed().setImage('attachment://tile.png'),
        files: [attach(imageUrl, 'tile.png')]
      });
    }
  }
}

function sendMessage(content: string) {
  // fails if client.on(ready) hasn't fired yet

  const CHANNEL_ID = '888518144346427392';

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    console.log({ channel });
    if (channel.type == 'GUILD_TEXT') {
      // @ts-ignore
      return channel.send(content);
    }
  }
}

export { sendMessage, sendMessageWithImage };
