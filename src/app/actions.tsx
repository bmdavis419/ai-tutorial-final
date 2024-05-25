'use server';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import type { ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { SystemMessage } from '@/components/chat/SystemMessage';
import { z } from 'zod';
import { CreateFood } from '@/components/foods/CreateFood';
import { SearchFood } from '@/components/foods/SearchFood';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState<typeof AI>();

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        const nMessages: {
          role: 'user' | 'assistant';
          content: string;
        }[] = [...history.get(), { role: 'assistant', content }];

        history.done(nMessages)
      }

      return <SystemMessage message={content} />
    },
    tools: {
      addFood: {
        description: "Add a food to the user's database of foods",
        parameters: z.object({}),
        generate: async () => {
          return <CreateFood />
        }
      },
      searchFood: {
        description: "Search for a food in the user's database of foods",
        parameters: z.object({
          name: z.string(),
        }),
        generate: async ({ name }) => {
          return <SearchFood name={name} />
        }
      }
    }
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[], {
  continueConversation: typeof continueConversation;
}>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});