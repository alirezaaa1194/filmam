// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const method = request.method;
//     return next.handle().pipe(
//       map((data) => {
//         if (method === 'GET') {
//           return data;
//         } else {
//           return {
//             success: true,
//             data,
//           };
//         }
//       }),
//     );
//   }
// }
