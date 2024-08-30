import { mutation } from "./_generated/server";
import { v } from "convex/values";

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const addSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    
    const samplePlayers = Array.from({ length: 50 }, (_, i) => ({
      name: `Player ${i + 1}`,
      email: `player${i + 1}@example.com`,
      registrationDate: formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)),
      totalScore: Math.floor(Math.random() * 10000),
      isActive: Math.random() > 0.2,
    }));
    
    for (const player of samplePlayers) {
      await ctx.db.insert("players", player);
    }

    const sampleGames = Array.from({ length: 50 }, (_, i) => ({
      title: `Game ${i + 1}`,
      description: `Description for Game ${i + 1}`,
      releaseDate: formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 30)),
    }));
    
    for (const game of sampleGames) {
      await ctx.db.insert("games", game);
    }

    const players = await ctx.db.query("players").collect();
    const games = await ctx.db.query("games").collect();

    if (players.length === 0 || games.length === 0) {
      return { message: "Failed to fetch players or games." };
    }

    const sampleScores = Array.from({ length: 50 }, (_, i) => ({
      playerId: players[i % players.length]._id,
      gameId: games[i % games.length]._id,
      score: Math.floor(Math.random() * 10000),
      achievedDate: formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 10)),
    }));
    
    for (const score of sampleScores) {
      await ctx.db.insert("scores", score);
    }

    const sampleAchievements = Array.from({ length: 50 }, (_, i) => ({
      playerId: players[i % players.length]._id,
      gameId: games[i % games.length]._id,
      achievementTitle: `Achievement ${i + 1}`,
      achievementDate: formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 5)),
    }));
    
    for (const achievement of sampleAchievements) {
      await ctx.db.insert("achievements", achievement);
    }

    return { message: "Success" };
  },
});