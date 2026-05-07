import Graph from '../components/Graph';
import { getAllSummaries } from '../lib/content';
import { siteTitle } from '../src/data/site';

export const metadata = {
  title: `StackSense · ${siteTitle}`,
  description:
    'AI / Data 系统的 6 层抽象 + 横切的编程语言：一张可探索的知识图谱。',
};

export default function HomePage() {
  const summaries = getAllSummaries();
  return <Graph chapters={summaries} />;
}
