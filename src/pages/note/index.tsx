import { MouseEventHandler, useState } from 'react';
import type { NextPage } from 'next'
import { Dropdown, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { EditorDiv } from '../../components/EditorDiv';
import { MDX } from '../../components/MDX';
import { InfiniteDiv } from '../../components/InfiniteDiv';
import World from '../../components/World';
import styles from './index.module.css';

type ComponentProps = {
  x: number
  y: number
  key: number | string
}

type Components = {
  [key: string]: {
    defaultSize: {
      width: number
      height: number
      x: number
      y: number
    }
    component: React.FC | React.Component
    
  }
}
const components: Components = {

}

type Items = {
  [key: string]: {
    label: string
    props?: Record<string, any>
    component: (props: ComponentProps) => JSX.Element
  }
}

const itemData: Items = {
  image: {
    label: '创建图片',
    props: {},
    component: ({ x, y, key }: ComponentProps) => (
      <EditorDiv className='absolute' width={400} height={300} x={x} y={y} key={key}>
        <img className='w-full h-full object-cover' draggable="false" src='https://tse1-mm.cn.bing.net/th/id/OIP-C.YK82ERPLS3QDwtk23LtY3QHaEo?pid=ImgDet&rs=1' />
      </EditorDiv>
    )
  },
  MDX: {
    label: '创建 MDX',
    component: ({ x, y, key }: ComponentProps) => (
      <EditorDiv className='absolute' width={400} height={300} x={x} y={y} key={key}>
        <MDX />
      </EditorDiv>
    )
  },
  code: {
    label: '创建代码块',
    component: ({ x, y, key }: ComponentProps) => (
      <EditorDiv className='absolute' width={300} height={400} x={x} y={y} key={key}>
        <code>this is a code!</code>
      </EditorDiv>
    )
  }
}

const menuItems: ItemType[] = [
  { label: '创建', key: 'create', children: Object.entries(itemData).map(([key, option]) => ({ key, label: option.label })) },
  { label: '删除', key: 'delete' }
]

const Note: NextPage = function Note() {

  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
  const [addPosition, setAddPosition] = useState({ x: 0, y: 0 });

  const [items, setItems] = useState<JSX.Element[]>([]);

  const addItem = function(event: { keyPath: string[] }) {
    const { keyPath } = event;
    const [type, action] = keyPath.reverse();

    switch (type) {
      case 'create':
        items.push(itemData[action].component({ ...addPosition, key: items.length }))
        setItems([...items])
        break
      case 'delete':
        break
    }
  }

  const onContextMenuHandler:MouseEventHandler<HTMLDivElement> = function (e) {
    setAddPosition({ x: e.pageX + -currentPosition.x, y: e.pageY + -currentPosition.y });
  }

  return (
    <World className='w-screen h-screen'>
      <Dropdown overlay={<Menu items={menuItems} onClick={addItem as any} />} trigger={["contextMenu"]}>
        <div className='absolute w-full h-full' onContextMenu={onContextMenuHandler}>
        </div>
      </Dropdown>
      <InfiniteDiv onMoved={position => setCurrentPosition(position)}>
        {items}
      </InfiniteDiv>
    </World>
  )
}

export default Note;
