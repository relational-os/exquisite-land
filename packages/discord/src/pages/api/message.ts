import { NextApiHandler } from 'next';
import { DISCORD_WEBHOOKS } from '@app/features/AddressBook';

const api: NextApiHandler = async (req, res) => {
  const discordWebhookURL = DISCORD_WEBHOOKS['relational-gorblin-builders'];

  // TODO: add authentication

  if (req.method === 'POST' && req.body.content) {
    console.log(req.body.content);

    // send POST request to webhook
    const response = await fetch(discordWebhookURL, {
      method: 'POST',
      body: JSON.stringify({
        content: req.body.content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log({ response });
  }

  return res.json({ success: true });
};

export default api;
