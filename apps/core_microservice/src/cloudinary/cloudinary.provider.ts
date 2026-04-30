import { v2 as cloudinary } from 'cloudinary';
import { CoreConfigService } from '../common/config/core-config.service';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [CoreConfigService],
  useFactory: (config: CoreConfigService) => {
    return cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    });
  },
};
