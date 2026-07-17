import { StateGraph, END, START } from '@langchain/langgraph';
import { AgentState } from './schema';
import { 
  research_trends, 
  plan_calendar, 
  write_posts, 
  validate_posts, 
  retry_failed_posts, 
  MAX_RETRIES 
} from './nodes';

const agentStateChannels = {
  brandConfig: {
    value: (x: any, y: any) => y ?? x,
    default: () => null,
  },
  currentDate: {
    value: (x: any, y: any) => y ?? x,
    default: () => '',
  },
  startDate: {
    value: (x: any, y: any) => y ?? x,
    default: () => '',
  },
  trends: {
    value: (x: any, y: any) => y ?? x,
    default: () => [],
  },
  calendarDays: {
    value: (x: any, y: any) => y ?? x,
    default: () => [],
  },
  dayPosts: {
    value: (x: Record<string, any>, y: Record<string, any>) => ({ ...x, ...y }),
    default: () => ({}),
  },
  validationErrors: {
    value: (x: Record<string, string[]>, y: Record<string, string[]>) => y ?? x, // overwrite with latest validation
    default: () => ({}),
  },
  retryCount: {
    value: (x: Record<string, number>, y: Record<string, number>) => ({ ...x, ...y }),
    default: () => ({}),
  }
};

export const workflow = new StateGraph<AgentState>({ channels: agentStateChannels as any })
  .addNode('research_trends', research_trends)
  .addNode('plan_calendar', plan_calendar)
  .addNode('write_posts', write_posts)
  .addNode('validate_posts', validate_posts)
  .addNode('retry_failed_posts', retry_failed_posts)
  
  .addEdge(START, 'research_trends')
  .addEdge('research_trends', 'plan_calendar')
  .addEdge('plan_calendar', 'write_posts')
  .addEdge('write_posts', 'validate_posts')
  
  .addConditionalEdges(
    'validate_posts',
    (state: AgentState) => {
      // Check if there are validation errors and if any failing day hasn't exhausted its retries
      const hasRetryableErrors = Object.keys(state.validationErrors).some(
        (day) => (state.retryCount[day] ?? 0) < MAX_RETRIES
      );
      
      return hasRetryableErrors ? 'retry_failed_posts' : 'end';
    },
    { retry_failed_posts: 'retry_failed_posts', end: END }
  )
  
  .addEdge('retry_failed_posts', 'validate_posts');

export const compiledGraph = workflow.compile();
