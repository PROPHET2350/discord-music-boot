const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("shows first 10 songs in the queue"),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      await interaction.reply("There are no songs in the queue");
      return;
    }
    const queueString = queue.tracks
      .slice(0, 10)
      .map((song, i) => {
        return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
      })
      .join("\n");
    return interaction.reply(queueString);
  },
};
