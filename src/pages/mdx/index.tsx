import type { NextPage } from 'next'
import Post from './doc.mdx'

console.log(Post);

const MDX: NextPage = function MDX() {
  return (
    <div className='p-10'>
      <Post />
    </div>
  )
}

export default MDX;
