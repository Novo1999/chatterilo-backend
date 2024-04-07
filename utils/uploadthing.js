import { createUploadthing } from 'uploadthing/express'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '1MB',
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log('upload completed', data)
  }),
}
