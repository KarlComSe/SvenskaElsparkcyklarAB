import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TravelService } from './travel.service';
import { StartRentingDto, TravelResponseDto, EndTravelDto } from './dto/renting.dto';

@ApiTags('Bike Rentals')
@Controller('rental')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get('customer/:customerId')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all travels for a customer',
    description: 'Returns all travels for a specific customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Travels found',
    type: [TravelResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No travels found for this customer',
  })
  async getTravelsForCustomer(@Param('customerId') customerId: string) {
    return await this.travelService.findTravelsForCustomer(customerId);
  }

  @Get('bike/:bikeId/active')
  @ApiOperation({
    summary: 'Get active travel for a bike',
    description:
      'Returns the active travel information including renter details for a specific bike',
  })
  @ApiResponse({
    status: 200,
    description: 'Active travel found',
    type: TravelResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active travel found for this bike',
  })
  async getActiveTravelForBike(@Param('bikeId') bikeId: string) {
    return await this.travelService.findActiveTravelForBike(bikeId);
  }
  @Post('bike/:bikeId/end-active')
  @ApiOperation({
    summary: 'End active travel for specific bike',
    description: 'Ends the currently active travel for the specified bike',
  })
  @ApiResponse({
    status: 201,
    description: 'Travel ended successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No active travel found for this bike',
  })
  async endActiveBikeTravel(@Param('bikeId') bikeId: string) {
    return await this.travelService.endActiveTravelForBike(bikeId);
  }

  // Start a bike rental
  @Post('bike/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Start renting a bike',
    description:
      'Initiates a bike travel for the authenticated user. The bike must be available for travel.',
  })
  @ApiResponse({
    status: 201,
    description: 'Bike travel started successfully',
    type: TravelResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Bike not found or not available for renting',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  async startRentingBike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.githubId;
    return this.travelService.startRentingBike(id, userId);
  }

  // End a bike travel
  @Post(':id/end')
  // removing the guard for now, the bike software should be able to end a travel.
  // we could implement a guard that authenticates the bike somehow
  // we could also expand on this, making it even more complex, like checking that it is the user whom initlized the rental that is ending it
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'End a bike travel',
    description: 'Ends the travel, calculates cost, and makes the bike available again',
  })
  @ApiResponse({
    status: 201,
    description: 'Travel ended successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Travel not found or already ended',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async endTravel(@Param('id') travelId: number) {
    return this.travelService.endTravel(travelId);
  }

  // Fetch one travel by ID
  @Get(':id')
  async getTravelById(@Param('id') id: number) {
    return await this.travelService.findById(id);
  }

  // Fetch all travels
  @Get()
  async getAllTravels() {
    return await this.travelService.findAll();
  }
}
