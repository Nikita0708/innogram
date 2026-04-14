import { BadRequestException, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AssetsService } from "./assets.service";
import { JwtAuthGuard } from "@/guards/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CurrentUser, CurrentUser as CurrentUserType } from '../decorators/current-user.decorator';
import { HTTP_STATUS } from "@/constants/error-messages";

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload media files (max 10)' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Files uploaded successfully' })
  @ApiResponse({ status: HTTP_STATUS.UNAUTHORIZED, description: 'Invalid or missing token' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^(image|video)\//)) {
        return cb(new BadRequestException('Only images and videos are allowed'), false)
      }
      cb(null, true)
    }
  }))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @CurrentUser() user: CurrentUserType) {
    return this.assetsService.uploadFiles(files, user.id)
  }
}