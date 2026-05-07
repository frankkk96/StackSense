import Graph from '../components/Graph';
import { siteTitle } from '../src/data/site';

export const metadata = {
  title: `StackSense · ${siteTitle}`,
  description: 'AI / Data 系统知识图谱：每个节点是一个具体的概念、项目或语言。',
};

export default function HomePage() {
  return <Graph />;
}
