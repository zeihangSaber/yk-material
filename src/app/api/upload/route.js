import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import mime from 'mime'
import dayjs from 'dayjs'

export async function POST(req, res) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'File is required.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (e) {
    if (e.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(e)
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
    }
  }

  // 写入文件
  const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`
  const filename = file.name.replace(/\.[^/.]+$/, '')
  const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`
  await writeFile(`${uploadDir}/${uniqueFilename}`, buffer)

  // 清除缓存
  revalidatePath('/', 'layout')

  return NextResponse.json({ fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res })
}
