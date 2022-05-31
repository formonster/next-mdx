import React, { useEffect, useState } from "react";
import { Input } from 'antd';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { remarkCodeHike } from "@code-hike/mdx";
import styles from './index.module.css';

const { TextArea } = Input;

const theme = require("shiki/themes/github-dark.json");

export type MDXProps = {
  defaultContent?: string
  content?: string
}

const components = {
  h1: (props: any) => <h1 style={{ fontSize: '30px', fontWeight: 'bold' }} {...props} />
}

export const MDX: React.FC<MDXProps> = ({ defaultContent, children }) => {
  
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult<Record<string, unknown>>>()
  const [isEdit, setIsEdit] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const [content, setContent] = useState(defaultContent || '')
  
  useEffect(() => {
    createSource();
  }, [content])

  async function createSource() {
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [
          [remarkCodeHike, { theme, lineNumbers: false }],
        ],
      }
    });
    setMdxSource(mdxSource)
  }

  return (
    <div className='w-full h-full relative'>
      <TextArea onFocus={() => setShowPreview(true)} onBlur={() => setShowPreview(false)} onChange={e => setContent(e.target.value)} className='w-full h-full' value={content} />
      {isEdit && showPreview && mdxSource && (
        <div className='absolute left-full top-0 w-full h-full bg-white shadow-md'>
          <MDXRemote {...mdxSource} components={components} />
        </div>
      )}
    </div>
  );
};
