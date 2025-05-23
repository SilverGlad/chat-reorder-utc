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
    hint: "Recria mensagens automaticamente com horário UTC-3 para ordenação correta.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.on("preCreateChatMessage", (msg, data, options, userId) => {
  const enabled = game.settings.get(MODULE_ID, "enabled");
  if (!enabled) return;

  if (foundry.utils.getProperty(data, `flags.${MODULE_ID}.recreated`)) return;

  console.log(`[${MODULE_ID}] Interceptando mensagem`, data);

  const clone = foundry.utils.deepClone(data);
  const timestamp = getBrasiliaTimestamp();
  foundry.utils.setProperty(clone, `flags.${MODULE_ID}.recreated`, true);
  foundry.utils.setProperty(clone, `flags.${MODULE_ID}.timestamp`, timestamp);

  setTimeout(() => {
    console.log(`[${MODULE_ID}] Mensagem recriada com timestamp UTC-3`, timestamp);
    ChatMessage.create(clone);
  }, 200);

  return false; // bloqueia a original
});
