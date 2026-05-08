import Graph from '@/components/Graph/Graph';
import { siteTitle } from '@/data/site';
import { DEFAULT_LOCALE } from '@/data/types';

export const metadata = {
  title: `StackSense · ${siteTitle[DEFAULT_LOCALE]}`,
  description:
    DEFAULT_LOCALE === 'zh'
      ? 'AI / Data 系统知识图谱：每个节点是一个具体的概念、项目或语言。'
      : 'AI / Data / Systems knowledge graph — every node is a concrete concept, project, or language.',
};

export default function HomePage() {
  return <Graph />;
}
