const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song"),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) {
      await interaction.reply("There are no songs in the queue");
      return;
    }

    const currentSong = queue.current;
    queue.skip();
    return interaction.reply("skip song successfully");
  },
};
