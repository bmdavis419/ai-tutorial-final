import { env } from "@/env";
import { Index } from "@upstash/vector";

export type FoodMetadata = {
  name: string;
  calories: number;
  type: "fruit" | "meat" | "pastry" | "dairy" | "other";
};

export const upstashIndex = new Index<FoodMetadata>({
  url: env.UPSTASH_URL,
  token: env.UPSTASH_TOKEN,
});
