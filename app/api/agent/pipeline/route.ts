import { NextRequest } from 'next/server';
import { compiledGraph } from '@/lib/langgraph/graph';
import { BrandConfig } from '@/lib/types';
import { AgentState } from '@/lib/langgraph/schema';

export async function POST(req: NextRequest) {
  const { brandConfig } = await req.json() as { brandConfig: BrandConfig };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const initialState: Partial<AgentState> = {
          brandConfig,
          currentDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          startDate: new Date().toISOString().split('T')[0],
          dayPosts: {},
          validationErrors: {},
          retryCount: {}
        };

        const streamEvents = await compiledGraph.stream(initialState as any);

        for await (const event of streamEvents) {
          const eventRecord = event as Record<string, any>;
          // Event key is the node name that just completed
          const nodeName = Object.keys(eventRecord)[0];
          
          const payload = JSON.stringify({
            node: nodeName,
            state: eventRecord[nodeName]
          });
          
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        }
        
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (error: any) {
        console.error('Pipeline error:', error);
        controller.enqueue(encoder.encode(`data: {"error": "${error.message}"}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
