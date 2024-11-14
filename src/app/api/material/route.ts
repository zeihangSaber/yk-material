import { NextResponse, type NextRequest } from 'next/server'
import { connectMongo, MaterialSchema } from '../dto/mongo'

export const revalidate = 10

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tags = searchParams.get('tags')?.split(',') as string[]
  const mongo = await connectMongo()
  const Material = mongo.models.Material || mongo.model('Material', MaterialSchema)
  let materials = []
  if (tags[0]) {
    materials = await Material.find({ tags: { $in: tags } })
  } else {
    materials = await Material.find()
  }
  return NextResponse.json({ materials })
}

export async function DELETE(request: NextRequest) {
  const { _id, tags } = await request.json()

  const mongo = await connectMongo()
  const Material = mongo.models.Material || mongo.model('Material', MaterialSchema)

  const result = await Material.findByIdAndDelete(_id)

  let materials = []
  if (tags) {
    materials = await Material.find({ tags: { $in: tags } })
  } else {
    materials = await Material.find()
  }
  return NextResponse.json({ materials, error: result ? null : 'Failed to delete material' })
}

export async function POST(request: NextRequest) {
  const { data, tags } = await request.json()

  const mongo = await connectMongo()
  const Material = mongo.models.Material || mongo.model('Material', MaterialSchema)

  const newOne = new Material()
  newOne.title = data.title
  newOne.imgUrl = data.imgUrl
  newOne.tags = data.tags

  const result = await newOne.save()

  let materials = []
  if (tags) {
    materials = await Material.find({ tags: { $in: tags } })
  } else {
    materials = await Material.find()
  }
  return NextResponse.json({ materials, error: result ? null : 'Failed to delete material' })
}
