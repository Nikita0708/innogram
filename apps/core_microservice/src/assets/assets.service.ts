import { Asset, AssetRepository } from '@innogram/database';
import { BadRequestException, Injectable } from "@nestjs/common";
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from "stream";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssetsService {
  constructor(private readonly assetRepository: AssetRepository) { }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<Asset> {
    const cloudinaryUrl = await this.uploadToCloudinary(file)

    const asset = this.assetRepository.create({
      id: uuidv4(),
      file_name: file.originalname,
      file_path: cloudinaryUrl,
      file_type: file.mimetype,
      file_size: file.size,
      created_by: userId
    })

    return this.assetRepository.save(asset)
  }

  async uploadFiles(files: Express.Multer.File[], userId: string): Promise<Asset[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided')
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 media files per post')
    }

    return Promise.all(files.map(file => this.uploadFile(file, userId)))
  }

  private uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'innogram/posts',
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(error.message))
          resolve(result.secure_url)
        }
      )

      Readable.from(file.buffer).pipe(uploadStream)
    })
  }
}

