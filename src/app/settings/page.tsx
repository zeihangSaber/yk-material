/* eslint-disable @next/next/no-img-element */
'use client'

import { Button, Card, Input, Space, Tag, message, Upload, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { GetProp, UploadProps, InputRef } from 'antd'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export default function Settings() {
  const input = useRef<InputRef>(null)
  const title = useRef<InputRef>(null)
  const [myTags, setTags] = useState<string[]>([])
  const [selTags, setSelTags] = useState<string[]>([])
  // const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const beforeUpload = (file: FileType) => {
    console.log('🚀 ~ beforeUpload ~ file:', file)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleTagChange = (val: string[]) => {
    setSelTags(val)
  }

  const submit = async () => {
    const titleVal = title.current?.input?.value

    if (!titleVal) {
      message.error('请输入标题')
      return
    }

    if (!imageUrl) {
      message.error('请上传图片')
      return
    }
    const res = await fetch(`/api/material`, {
      method: 'POST',
      body: JSON.stringify({ data: { title: titleVal, tags: selTags, imgUrl: imageUrl } }),
    })
    const { error } = await res.json()
    if (error) {
      message.error(error)
      return
    }
    message.success('创建成功')
    setSelTags([])
    setImageUrl('')
  }

  const handleChange: UploadProps['onChange'] = (info) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.fileUrl)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/tags`, {
        method: 'GET',
      })
      const { tags } = await res.json()
      setTags(tags)
    }
    fetchData()
  }, [])

  const addTag = async () => {
    const val = input.current?.input?.value
    if (!val) return
    const res = await fetch(`/api/tags`, {
      method: 'POST',
      body: JSON.stringify({ name: val }),
    })
    const { tags, error } = await res.json()
    if (error) {
      console.error(error)
      return
    }
    setTags(tags)
  }

  return (
    <div style={{ backgroundColor: 'rgb(240, 242, 245)', height: '100%', padding: 40 }}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="标签">
          <Space style={{ marginBottom: 10 }}>
            {myTags.map((tag) => {
              return <Tag key={tag}>{tag}</Tag>
            })}
          </Space>

          <Space.Compact style={{ width: '100%' }}>
            <Input ref={input} placeholder="请输入标签" />
            <Button type="primary" onClick={addTag}>
              添加标签
            </Button>
          </Space.Compact>
        </Card>

        <Card title="添加素材">
          <Space style={{ width: '100%' }} direction="vertical">
            <Input ref={title} placeholder="请输入标题" />

            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择标签"
              onChange={handleTagChange}
              options={myTags.map((tag) => ({ label: tag, value: tag }))}
            />

            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              action={`/api/upload`}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>

            <Button onClick={submit} color="primary" variant="solid">
              创建素材
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
