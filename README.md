# 前言

本示例主要用于调研 mdx 语法的使用，和 remark、rehype、codehike 等插件的使用。

## nextjs 支持 mdx

参考：https://www.mdxjs.cn/getting-started/next

## 如何自定义组件

参考：https://mdxjs.com/packages/react/

```md
<!-- doc.mdx -->
# Hello MDX

<Ding />
```

```tsx
import type { NextPage } from 'next'
import Post from './doc.mdx'

const components = {
  Ding: (props: any) => <button {...props}>Ding</button>
}

const MDX: NextPage = function MDX() {
  return (
    <Post components={components} />
  )
}

export default MDX;
```

## Tailwindcss

参考：https://www.tailwindcss.cn/docs/guides/nextjs

## codehike 使用

参考：https://codehike.org/docs/installation

### codehike 代码焦点使用示例

参考：https://codehike.org/demo/code

### codehike 注释示例

参考：https://codehike.org/demo/meta-annotations

### 通过 // 来使用代码焦点和注释

参考：https://codehike.org/demo/comment-annotations

### codehike 文件名示例

参考：https://codehike.org/demo/filenames

### 带步骤的动态代码演示

参考：https://codehike.org/demo/spotlight

### 幻灯片演示（收费）

参考：https://codehike.org/demo/slideshow

### 更多

参考：https://codehike.org/docs/ch-slideshow
