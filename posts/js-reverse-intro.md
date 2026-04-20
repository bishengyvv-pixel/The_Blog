---
title: JS 逆向入门完全指南
date: 2025-01-05
category: 逆向工程
tags: ["JS逆向", "爬虫", "安全"]
summary: 从基础到实战，全面讲解 JS 逆向核心技术，包括 AST 分析、混淆还原、断点调试、Hook 技术等。
---

# JS 逆向入门完全指南

JS 逆向是爬虫工程师必备技能，能够帮助我们分析复杂网站的加密逻辑。

## 核心工具链

常用的逆向工具包括：
- Chrome 开发者工具
- Fiddler/Charles 抓包工具
- AST 分析工具
- 油猴脚本 Hook 工具

## 常见混淆还原

### 字符串加密还原
```javascript
// 混淆后的代码
function decrypt(e,t){for(var n="",o=0;o<e.length;o++)n+=String.fromCharCode(e.charCodeAt(o)^t)}
```

通过断点调试和动态分析，可以还原出原始的加密逻辑。

## 高级 Hook 技术

使用 Proxy 或重写原生方法，可以拦截加密函数的调用，获取参数和返回值：

```javascript
// Hook 加密函数
const originalEncrypt = window.encrypt
window.encrypt = function(...args) {
  console.log('加密参数:', args)
  const result = originalEncrypt.apply(this, args)
  console.log('加密结果:', result)
  return result
}
```

掌握这些技术，就能够应对绝大多数网站的各种加密防护。
