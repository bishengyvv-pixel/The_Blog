import type { LucideIcon } from 'lucide-react'
import {
  Binary,
  Blocks,
  Bot,
  BrainCircuit,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FlaskConical,
  Folder,
  Globe,
  Hammer,
  Network,
  Rocket,
  Search,
  Server,
  Shield,
  Smartphone,
  Terminal,
  Waypoints,
  Workflow,
  Wrench,
} from 'lucide-react'

export type CategoryMeta = {
  icon: LucideIcon
  description: string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  前端: {
    icon: Code2,
    description: 'React、CSS、组件设计与性能优化',
  },
  后端: {
    icon: Server,
    description: '接口设计、服务治理、缓存与并发控制',
  },
  运维: {
    icon: Wrench,
    description: '服务器配置、部署发布、监控与故障处理',
  },
  DevOps: {
    icon: Hammer,
    description: '自动化流程、CI/CD、环境管理与交付效率',
  },
  云原生: {
    icon: Container,
    description: 'Docker、Kubernetes、服务编排与弹性部署',
  },
  工程化: {
    icon: Blocks,
    description: '构建工具、包管理、规范落地与提效方案',
  },
  架构: {
    icon: Workflow,
    description: '系统拆分、模块协作、可扩展性与稳定性',
  },
  数据库: {
    icon: Database,
    description: '表结构设计、索引优化、事务与查询分析',
  },
  网络: {
    icon: Network,
    description: 'HTTP、TCP/IP、代理、抓包与链路排查',
  },
  网络安全: {
    icon: Shield,
    description: '攻防基础、漏洞分析、权限边界与防护策略',
  },
  JS逆向: {
    icon: Search,
    description: '浏览器调试、混淆分析、协议还原与脚本对抗',
  },
  'JS 逆向': {
    icon: Search,
    description: '浏览器调试、混淆分析、协议还原与脚本对抗',
  },
  Python: {
    icon: Terminal,
    description: '爬虫、自动化、数据处理与脚本工具',
  },
  Go: {
    icon: Globe,
    description: '并发服务、网络编程、工程实践与工具开发',
  },
  Java: {
    icon: Cpu,
    description: '企业应用、JVM 生态、中间件与服务端开发',
  },
  Rust: {
    icon: Binary,
    description: '系统编程、内存安全、性能优化与工具链探索',
  },
  AI: {
    icon: BrainCircuit,
    description: '大模型应用、推理流程、智能体与提示工程',
  },
  AIGC: {
    icon: Bot,
    description: '内容生成、工作流编排、多模态与创作实践',
  },
  移动端: {
    icon: Smartphone,
    description: 'iOS、Android、跨端方案与体验优化',
  },
  测试: {
    icon: FlaskConical,
    description: '单测、集成测试、端到端测试与质量保障',
  },
  性能优化: {
    icon: Rocket,
    description: '首屏、渲染、缓存、压测与性能瓶颈分析',
  },
  Linux: {
    icon: Terminal,
    description: '命令行、系统调优、服务管理与故障排查',
  },
  数据分析: {
    icon: Cloud,
    description: '数据清洗、可视化、指标分析与自动报表',
  },
  算法: {
    icon: Waypoints,
    description: '数据结构、算法思维、题解与复杂度分析',
  },
}

export function getCategoryMeta(name: string): CategoryMeta | undefined {
  return CATEGORY_META[name]
}

export function getCategoryIcon(name: string): LucideIcon {
  return getCategoryMeta(name)?.icon ?? Folder
}

export function getCategoryDescription(name: string): string {
  return getCategoryMeta(name)?.description ?? '技术文章'
}
