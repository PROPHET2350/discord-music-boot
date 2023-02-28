const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play a song from YouTube.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a song and plays it")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("search keywords")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Plays a playlist from YT")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Plays a single song from YT")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.reply(
        "You need to be in a Voice Channel to play a song."
      );
    var queue;
    if (client.player.getQueue(interaction.guildId)) {
      queue = await client.player.getQueue(interaction.guild);
    } else {
      queue = await client.player.createQueue(interaction.guild);
    }
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return await interaction.reply("No results");
      }

      const song = result.tracks[0];

      if (queue.tracks.length === 0) {
        await queue.addTrack(song);
      }
      await queue.addTrack(song);
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0) {
        return interaction.reply(`No playlists found with ${url}`);
      }
      const playlist = result.playlist;

      await queue.addTracks(result.tracks);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        return await interaction.editReply("No results");
      }

      const song = result.tracks[0];
      if (queue.tracks.length === 0) {
        await queue.addTrack(song);
      }
      await queue.addTrack(song);
    }
    if (!queue.playing) await queue.play();
    interaction.reply("leadys and gentlemen, we got it!");
  },
};
