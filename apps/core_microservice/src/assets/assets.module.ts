import { AssetRepository } from '@innogram/database';
import { CloudinaryModule } from "@/cloudinary/cloudinary.module";
import { Module } from "@nestjs/common";
import { DataSource } from 'typeorm';
import { AssetsController } from "./assets.controller";
import { AssetsService } from "./assets.service";
import { AuthModule } from "@/auth/auth.module";

@Module({
  imports: [CloudinaryModule, AuthModule],
  controllers: [AssetsController],
  providers: [
    { provide: AssetRepository, useFactory: (ds: DataSource) => new AssetRepository(ds), inject: [DataSource] },
    AssetsService,
  ],
  exports: [AssetsService],
})
export class AssetsModule { }