import type { NextPage } from 'next'
import Post from './doc.mdx'

const MDX: NextPage = function MDX() {
  return (
    <div className='p-10'>
      <Post />
    </div>
  )
}

export default MDX;
