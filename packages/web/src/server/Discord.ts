import { DISCORD_WEBHOOKS } from '@app/features/AddressBook';

export type DiscordMessage = {
  id: string;
  content: string;
  author: { id: string; avatar: string; username: string };
  timestamp: Date;
  attachments: { url: string }[];
};
export type DiscordMessages = DiscordMessage[];

export const getMessagesForChannelName = async (channelName: string) => {
  const channelID = TEXT_CHANNELS[channelName];
  if (!channelID) {
    throw new Error(`Unknown channel name: ${channelName}`);
  }
  const messages = await getMessagesForChannel(channelID);
  return messages;
};

export const getMessagesForChannel = async (channelID: string) => {
  console.log(`Fetching messages for channel ${channelID}`);
  console.log(process.env.DISCORD_CLIENT_TOKEN);
  const messages: DiscordMessages = await fetch(
    `https://discord.com/api/v8/channels/${channelID}/messages`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
      }
    }
  ).then((res) => res.json());
  messages.reverse();
  return messages;
};

export const sendMessage = async (
  channel: string,
  as: string,
  content: string,
  embeds: any[] = []
) => {
  // TODO: make this less hacky and less hardcoded
  let targetURL;
  if (channel === 'bot-testing' && as === 'xqst') {
    targetURL = DISCORD_WEBHOOKS['xqst']['bot-testing'];
  }
  if (channel === 'bot-testing' && as === 'gorblin') {
    targetURL = DISCORD_WEBHOOKS['gorblin']['bot-testing'];
  }
  if (channel === 'admin-chat' && as === 'xqst') {
    targetURL = DISCORD_WEBHOOKS['xqst']['admin-chat'];
  }
  if (channel === 'terra-masu' && as === 'xqst') {
    targetURL = DISCORD_WEBHOOKS['xqst']['terra-masu'];
  }
  if (channel === 'terra-masu' && as === 'gorblin') {
    targetURL = DISCORD_WEBHOOKS['gorblin']['terra-masu'];
  }

  if (!targetURL) {
    throw new Error(`Unknown channel/as combo: ${channel}/${as}`);
  }

  return await fetch(targetURL, {
    method: 'POST',
    body: JSON.stringify({
      content: content,
      embeds: embeds
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    // responsds with a 204 on happy state
    return res.status == 204;
  });
};

export const TEXT_CHANNELS: { [key: string]: string } = {
  // Public Channels
  announcements: '895477350257549363',
  lobby: '888519468320456754',
  'link-wallet': '888503581211234346',
  'help-me': '895476066049720420',
  bugs: '899694916681228289',

  // Canvases
  'terra-masu': '888518144346427392'
};
