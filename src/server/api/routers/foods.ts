import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { embed } from "ai";
import { openaiEmbeddingsModel } from "@/server/ai";
import { upstashIndex } from "@/server/ai/upstash";
import { nanoid } from "nanoid";

export const foodsRouter = createTRPCRouter({
  searchFood: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { embedding } = await embed({
        model: openaiEmbeddingsModel,
        value: input.query,
      });

      const results = await upstashIndex.query({
        vector: embedding,
        topK: 10,
        includeMetadata: true,
      });

      const foundFoods: {
        id: string;
        name: string;
        calories: number;
        type: "fruit" | "meat" | "pastry" | "dairy" | "other";
      }[] = [];

      for (const result of results) {
        if (result.metadata) {
          foundFoods.push({
            id: result.id as string,
            name: result.metadata.name,
            calories: result.metadata.calories,
            type: result.metadata.type,
          });
        }
      }

      return foundFoods;
    }),
  createFood: publicProcedure
    .input(
      z.object({
        name: z.string(),
        calories: z.number(),
        type: z.enum(["fruit", "meat", "pastry", "dairy", "other"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { embedding } = await embed({
        model: openaiEmbeddingsModel,
        value: input.name,
      });

      const id = nanoid();

      await upstashIndex.upsert({
        id,
        vector: embedding,
        metadata: {
          name: input.name,
          calories: input.calories,
          type: input.type,
        },
      });

      return {
        id,
      };
    }),
});
