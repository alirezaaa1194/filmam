import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let detail = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      detail = typeof res === 'string' ? res : res.message || detail;
    } else if (exception instanceof Error) {
      detail = exception.message;
    }

    response.status(status).json({
      success: false,
      errors: [
        {
          status,
          detail,
        },
      ],
    });
  }
}
