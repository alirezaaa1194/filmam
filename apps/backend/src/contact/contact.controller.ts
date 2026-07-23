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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CountResponseDto } from '../common/dto/response.dto';
import { ContactResponseDto, PaginatedContactsDto } from './dto/contact.response.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiCreatedResponse({ type: ContactResponseDto })
  @Post()
  async createContact(@Body() body: CreateContactDto) {
    return await this.contactService.createContact(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('admin')
  async deleteContacts(@Body() body: DeleteContactsDto) {
    return await this.contactService.deleteContacts(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ContactResponseDto })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('admin/answer/:contactId')
  async answerContact(
    @Param('contactId') contactId: number,
    @Body() body: AnswerContactDto,
  ) {
    return await this.contactService.answerContact(contactId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ContactResponseDto })
  @Put('admin/reject/:contactId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async rejectContact(
    @Body() body: RejectContactDto,
    @Param('contactId') contactId: number,
  ) {
    return await this.contactService.rejectContact(contactId, body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: PaginatedContactsDto })
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllContacts(@Query() query: GetAllContactsDto) {
    return await this.contactService.getAllContacts(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: ContactResponseDto })
  @Get('admin/:contactId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCommentDetailAdmin(@Param('contactId') contactId: number) {
    return await this.contactService.getContactDetail(contactId);
  }
}
