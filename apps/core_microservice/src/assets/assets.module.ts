import { CloudinaryModule } from "@/cloudinary/cloudinary.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssetsController } from "./assets.controller";
import { AssetsService } from "./assets.service";
import { Asset } from "@/database/entities/asset.entity";
import { AuthModule } from "@/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), CloudinaryModule, AuthModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService]
})
export class AssetsModule { }