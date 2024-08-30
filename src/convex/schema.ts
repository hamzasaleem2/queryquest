import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    name: v.string(),
    email: v.string(),
    registrationDate: v.string(),
    totalScore: v.number(),
    isActive: v.boolean(),
  }),

  games: defineTable({
    title: v.string(),
    description: v.string(),
    releaseDate: v.string(),
  }),

  scores: defineTable({
    playerId: v.id("players"),
    gameId: v.id("games"),
    score: v.number(),
    achievedDate: v.string(),
  }).index("by_player_and_game", ["playerId", "gameId"]),
  
  achievements: defineTable({
    playerId: v.id("players"),
    gameId: v.id("games"),
    achievementTitle: v.string(),
    achievementDate: v.string(),
  }).index("by_player_and_date", ["playerId", "achievementDate"]),
});
