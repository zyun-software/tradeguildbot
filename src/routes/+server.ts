import { TG_TOKEN } from '$env/static/private';
import { TelegramBot } from '$lib/server/application';
import { text } from '@sveltejs/kit';

export async function POST({ request }) {
  const token = request.headers.get('x-telegram-bot-api-secret-token') ?? '';

  if (!TG_TOKEN.includes(token)) {
    return text('Невірний токен доступу');
  }

  const data = await request.json();

  const bot = new TelegramBot(data);

  try {
    await bot.start();
  } catch (error) {
    console.error('💥 Необроблена помилка', error);
  }

  return text('виконано');
}
