import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CountryService } from './country.service';
import {
  CreateCountryDto,
  DeleteCountriesDto,
  GetAllCountriesDto,
} from './dto/country.dto';
import { MessageResponseDto } from '../common/dto/response.dto';
import { CountryResponseDto, PaginatedCountriesDto } from './dto/country.response.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOkResponse({ type: PaginatedCountriesDto })
  @Get('all')
  async getAllCountries(@Query() query: GetAllCountriesDto) {
    return await this.countryService.getAllCountries(query);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CountryResponseDto })
  @Get('admin/:countryId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCountry(@Param('countryId', ParseIntPipe) countryId: number) {
    return await this.countryService.getCountryDetailAdmin(countryId);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: MessageResponseDto })
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createCountry(@Body() body: CreateCountryDto) {
    return await this.countryService.createCountry(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteCountries(@Body() body: DeleteCountriesDto) {
    return await this.countryService.deleteCountries(body.country_ids);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: MessageResponseDto })
  @Put('admin/:countryId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateCountry(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Body() body: CreateCountryDto,
  ) {
    return await this.countryService.updateCountry(countryId, body);
  }
}
