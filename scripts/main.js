// chat-reorder-utc/scripts/main.js

const MODULE_ID = "chat-reorder-utc";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enabled", {
    name: "Ativar ordenação UTC-3 no chat",
    hint: "Recria mensagens automaticamente com atraso para garantir ordenação real baseada em UTC-3.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.on("createChatMessage", async (msg) => {
  const enabled = game.settings.get(MODULE_ID, "enabled");
  if (!enabled) return;

  // Evita loop de recriação
  if (msg.getFlag(MODULE_ID, "recreated")) return;

  const delayMs = 500; // atraso leve para mudar timestamp

  const data = {
    user: msg.user,
    speaker: msg.speaker,
    content: msg.content,
    flavor: msg.flavor,
    type: msg.type,
    roll: msg.roll ? msg.roll.toJSON() : undefined,
    rolls: msg.rolls?.map(r => r.toJSON()) || [],
    flags: {
      ...msg.flags,
      [MODULE_ID]: { recreated: true }
    }
  };

  await new Promise(resolve => setTimeout(resolve, delayMs));
  await msg.delete();
  await ChatMessage.create(data);
});
