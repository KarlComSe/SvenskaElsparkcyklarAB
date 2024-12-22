import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TravelService } from './travel.service';
import { StartRentingDto, TravelResponseDto, EndTravelDto } from './dto/renting.dto';

@ApiTags('Bike Rentals')  
@Controller('rental')
export class TravelController {
    constructor(
        private readonly travelService: TravelService,
    ) { }

    // Fetch all travels
    @Get()
    async getAllTravels() {
        return await this.travelService.findAll();
    }


    // Fetch one travel by ID
    @Get(':id')
    async getTravelById(@Param('id') id: number) {
        return await this.travelService.findById(id);
    }

    // Start a bike rental
    @Post('bike/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Start renting a bike',
        description: 'Initiates a bike travel for the authenticated user. The bike must be available for travel.'
    })
    @ApiResponse({
        status: 201,
        description: 'Bike travel started successfully',
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
        @Param('bikeId') bikeId: string,
        @Req() req: any
    ) {
        const userId = req.user.githubId;
        return this.travelService.startRentingBike(bikeId, userId);
    }

    // End a bike travel
    @Post('end')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'End a bike travel',
        description: 'Ends the travel, calculates cost, and makes the bike available again'
    })
    @ApiResponse({
        status: 201,
        description: 'Travel ended successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - Travel not found or already ended'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized'
    })
    async endTravel(@Body() endTravelDto: EndTravelDto) {
        return this.travelService.endTravel(endTravelDto.travelId);
    }
}