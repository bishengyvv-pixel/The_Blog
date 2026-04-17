export interface AboutInfoCard {
  ascii: string
  label: string
  value: string
}

export const INFO_CARDS: AboutInfoCard[] = [
  {
    ascii: '┌───────────┐\n│  > skills        │\n└───────────┘',
    label: 'stack',
    value: 'React · TypeScript · K8s · Ceph',
  },
  {
    ascii: '┌───────────┐\n│  ★ role          │\n└───────────┘',
    label: 'identity',
    value: 'Full-Stack & DevOps Architect',
  },
  {
    ascii: '┌───────────┐\n│  ✉ contact       │\n└───────────┘',
    label: 'reach me',
    value: 'GitHub · Email',
  },
  {
    ascii: '┌───────────┐\n│  ◈ philosophy    │\n└───────────┘',
    label: 'motto',
    value: 'Code as poetry, deploy as rhythm',
  },
]
