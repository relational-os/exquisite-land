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
      content: `Please visit ${process.env.HOST}/link?id=${user.id} and tap Connect Wallet.`
    });
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
client.once('ready', () => {
  console.log('ready!');
});

function sendMessageWithImage(
  channelId: string,
  content: string,
  imageUrl: string
) {
  const channel = client.channels.cache.get(channelId);
  if (channel) {
    if (channel.type == 'GUILD_TEXT') {
      // @ts-ignore
      return channel.send({
        content: content,
        embed: embed().setImage('attachment://tile.png'),
        files: [attach(imageUrl, 'tile.png')]
      });
    }
  }
}

function sendMessage(channelId: string, content: string) {
  const channel = client.channels.cache.get(channelId);
  if (channel) {
    console.log({ channel });
    if (channel.type == 'GUILD_TEXT') {
      // @ts-ignore
      return channel.send(content);
    }
  }
}

export { sendMessage, sendMessageWithImage };
