import { NextResponse, type NextRequest } from 'next/server'
import { connectMongo, TagSchema } from '../dto/mongo'

export const revalidate = 10

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  const mongo = await connectMongo()
  const Tags = mongo.models.Tag || mongo.model('Tag', TagSchema)
  const newTag = new Tags()
  newTag.name = name
  try {
    await newTag.save()
  } catch {
    return NextResponse.json({ error: 'the tag already exists' })
  }
  const tags = await Tags.find()
  return NextResponse.json({ tags: tags.map((tag) => tag.name) })
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json()
  const mongo = await connectMongo()
  const Tags = mongo.models.Tag || mongo.model('Tag', TagSchema)
  try {
    await Tags.findOneAndDelete({ name }) // 根据名称删除标签
    const tags = await Tags.find() // 获取所有剩余的标签
    return NextResponse.json({ tags: tags.map((tag) => tag.name) })
  } catch {
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}

export async function GET() {
  const mongo = await connectMongo()
  const Tags = mongo.models.Tag || mongo.model('Tag', TagSchema)
  const tags = await Tags.find()
  return NextResponse.json({ tags: tags.map((tag) => tag.name) })
}
