import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileNamer } from './helpers/fileNamer.helper';
import { getMimeType } from './helpers/getMineType';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}
  @Get('product/:imageName')
  // findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
  //   const path = this.filesService.getStaticProductImage(imageName);
  //   res.sendFile(path);
  // }
  findProductImage(@Param('imageName') imageName: string): StreamableFile {
    const path = this.filesService.getStaticProductImage(imageName);
    const fileStream = createReadStream(path);
    const mimeType = getMimeType(path);

    return new StreamableFile(fileStream, { type: mimeType });
  }
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      // limits: 1000,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif|bmp|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      return new BadRequestException('Make sure that the file is an image');
    }
    // const secureUrl = `${file.filename}`;
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {
      secureUrl,
    };
  }
}
