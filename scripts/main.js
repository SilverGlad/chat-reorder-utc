// chat-reorder-utc/scripts/main.js

const MODULE_ID = "chat-reorder-utc";

function getBrasiliaTimestamp() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brasilia = new Date(utc - 3 * 3600000); // UTC-3
  return brasilia.getTime();
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enabled", {
    name: "Ativar ordenação UTC-3 no chat",
    hint: "Recria mensagens automaticamente com atraso para garantir ordenação real baseada no horário de Brasília (UTC-3).",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.on("preCreateChatMessage", async (msg, data, options, userId) => {
  const enabled = game.settings.get(MODULE_ID, "enabled");
  if (!enabled) return;

  if (getProperty(data, `flags.${MODULE_ID}.recreated`)) return;

  const timestamp = getBrasiliaTimestamp();

  const clone = foundry.utils.deepClone(data);
  setProperty(clone, `flags.${MODULE_ID}.recreated`, true);
  setProperty(clone, `flags.${MODULE_ID}.timestamp`, timestamp);

  await new Promise(resolve => setTimeout(resolve, 200));
  await ChatMessage.create(clone);

  return false; // cancela a original
});
