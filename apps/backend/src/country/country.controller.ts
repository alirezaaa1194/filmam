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
import { ApiBearerAuth } from '@nestjs/swagger';
import { CountryService } from './country.service';
import {
  CreateCountryDto,
  DeleteCountriesDto,
  GetAllCountriesDto,
} from './dto/country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
  @Get('all')
  async getAllCountries(@Query() query: GetAllCountriesDto) {
    return await this.countryService.getAllCountries(query);
  }

  @ApiBearerAuth()
  @Get('admin/:countryId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getCountry(@Param('countryId', ParseIntPipe) countryId: number) {
    return await this.countryService.getCountryDetailAdmin(countryId);
  }

  @ApiBearerAuth()
  @Post('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createCountry(@Body() body: CreateCountryDto) {
    return await this.countryService.createCountry(body);
  }

  @ApiBearerAuth()
  @Delete('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteCountries(@Body() body: DeleteCountriesDto) {
    return await this.countryService.deleteCountries(body.country_ids);
  }

  @ApiBearerAuth()
  @Put('admin/:countryId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateCountry(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Body() body: CreateCountryDto,
  ) {
    return await this.countryService.updateCountry(countryId, body);
  }
}
