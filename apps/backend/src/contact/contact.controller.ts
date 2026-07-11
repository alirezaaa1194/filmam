import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  AnswerContactDto,
  CreateContactDto,
  DeleteContactsDto,
  GetAllContactsDto,
  RejectContactDto,
} from './dto/contact.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() body: CreateContactDto) {
    return await this.contactService.createContact(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteContacts(@Body() body: DeleteContactsDto) {
    return await this.contactService.deleteContacts(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/answer/:contactId')
  async answerContact(
    @Param('contactId') contactId: number,
    @Body() body: AnswerContactDto,
  ) {
    return await this.contactService.answerContact(contactId, body);
  }

  @ApiBearerAuth()
  @Put('admin/reject/:contactId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async rejectContact(
    @Body() body: RejectContactDto,
    @Param('contactId') contactId: number,
  ) {
    return await this.contactService.rejectContact(contactId, body);
  }

  @ApiBearerAuth()
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllContacts(@Query() query: GetAllContactsDto) {
    return await this.contactService.getAllContacts(query);
  }

  @ApiBearerAuth()
  @Get('admin/:contactId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCommentDetailAdmin(@Param('contactId') contactId: number) {
    return await this.contactService.getContactDetail(contactId);
  }
}
