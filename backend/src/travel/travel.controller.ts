import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TravelService } from './travel.service';
import { StartRentingDto, TravelResponseDto } from './dto/renting.dto';

@Controller('travel')
export class TravelController {
    constructor(
    private readonly travelService: TravelService,
    ) {}

    @Get()
    async getAllTravels() {
        return await this.travelService.findAll();
    }


    @Get(':id')
    async getTravelById(@Param('id') id: number) {
        return await this.travelService.findById(id);
    }


    @Post('start')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
    summary: 'Start renting a bike',
    description: 'Initiates a bike rental for the authenticated user. The bike must be available for rental.'
    })
    @ApiResponse({ 
    status: 201, 
    description: 'Bike rental started successfully',
    type: TravelResponseDto 
    })
    @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Bike not found or not available for renting' 
    })
    @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - User not authenticated' 
    })
    async startRentingBike(
    @Body() startRentingDto: StartRentingDto,
    @Req() req: any
    ) {
    const userId = req.user.githubId;
    return this.travelService.startRentingBike(startRentingDto.bikeId, userId);
    }
}