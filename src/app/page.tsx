'use client'

import { Image, Checkbox, Space, Card } from 'antd'
import { useEffect, useState } from 'react'
import './page.css'

const { Meta } = Card
const fallback = '/fallback.png'

export default function Home() {
  const [myTags, setTags] = useState<string[]>([])
  const [myMaterials, setMaterials] = useState<
    {
      title: string
      _id: string
      imgUrl: string
      tags: string[]
    }[]
  >([])
  const [isMobile, setIsMobile] = useState(false)

  const fetchMaterial = async (selTags: string[] = []) => {
    const res = await fetch(`/api/material?tags=${selTags.join(',')}`)
    const { materials } = await res.json()
    setMaterials(materials)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/tags`)
      const { tags } = await res.json()
      setTags(tags)
    }
    fetchData()
    fetchMaterial()
    if (window.innerWidth < 800) {
      setIsMobile(true)
    }
  }, [])

  const onChange = async (val: string[]) => {
    console.log('🦊 ~ file: page.tsx:40 ~ onChange ~ val:', val)
    fetchMaterial(val)
  }

  return (
    <div
      className="layout"
      style={{
        flexDirection: isMobile ? 'column' : 'unset',
        flexWrap: 'wrap',
      }}
    >
      <div
        className="left"
        style={{
          height: isMobile ? 100 : 'unset',
          width: isMobile ? '100vw' : 200,
          padding: isMobile ? 10 : '30px 0 0 30px',
        }}
      >
        <Checkbox.Group onChange={onChange}>
          <Space
            style={{ width: '100%' }}
            direction={isMobile ? 'horizontal' : 'vertical'}
          >
            {myTags.map((tag) => {
              return (
                <Checkbox key={tag} value={tag}>
                  {tag}
                </Checkbox>
              )
            })}
          </Space>
        </Checkbox.Group>
      </div>

      <div className="right" style={{ padding: isMobile ? 10 : 30 }}>
        <Space
          style={{
            width: '100%',
          }}
          size={[30, 20]}
          direction={isMobile ? 'vertical' : 'horizontal'}
          wrap={!isMobile}
        >
          {myMaterials.map((item) => {
            return (
              <Card
                key={item._id}
                hoverable
                style={{
                  width: isMobile ? '100%' : 240,
                  height: isMobile ? 'unset' : 320,
                }}
              >
                <div className="cardBox">
                  <Image
                    alt=""
                    height={isMobile ? 300 : 240}
                    // width={200}
                    fallback={fallback}
                    src={item.imgUrl}
                  />
                  <Meta style={{ marginTop: 10 }} description={item.title} />
                </div>
              </Card>
            )
          })}
        </Space>
      </div>
    </div>
  )
}
