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

  const fetchMaterial = async () => {
    const res = await fetch(`/api/material?tags=${myTags.join(',')}`)
    const { materials } = await res.json()
    setMaterials(materials)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/tags`)
      const { tags } = await res.json()
      setTags(tags)
      console.log('🚀 ~ fetchData ~ res:', tags)
    }
    fetchData()
    fetchMaterial()
  }, [])

  const onChange = (val: string[]) => {
    setTags(val)
    fetchMaterial()
  }

  return (
    <div className="layout">
      <div className="left">
        <Checkbox.Group onChange={onChange}>
          <Space style={{ width: '100%' }} direction="vertical">
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
      <div className="right">
        <Space size={[30, 20]} wrap>
          {myMaterials.map((item) => {
            return (
              <Card
                key={item._id}
                hoverable
                style={{ width: 240, height: 300 }}
                cover={<Image alt="" fallback={fallback} src={item.imgUrl} />}
              >
                <Meta description={item.title} />
              </Card>
            )
          })}
        </Space>
      </div>
    </div>
  )
}
