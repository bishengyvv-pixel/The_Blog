import { useEffect } from 'react'

const SITE_NAME = 'The_Blog'

export function useSEO(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description ?? '个人技术博客，记录学习历程，沉淀技术知识，覆盖前端、运维、JS 逆向、Python 等领域。'

    return () => {
      document.title = SITE_NAME
    }
  }, [title, description])
}
