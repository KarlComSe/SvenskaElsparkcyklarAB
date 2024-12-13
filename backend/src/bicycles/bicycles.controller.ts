import { Controller, Get, Post, UseGuards, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BicyclesService } from './bicycles.service';

@Controller('bike')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

    // Fetch all bicycles
    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all bicycles (Only for admin)' })
    @ApiResponse({
        status: 200,
        description: 'List of bicycles',
        examples: {
            'application/json': {
                summary: 'Example of a list of bicycles',
                value: [
                    {
                        id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
                        batteryLevel: 100,
                        latitude: 59.3293,
                        longitude: 18.0686,
                        status: 'Available',
                        createdAt: '2024-12-01T05:01:01.000Z',
                        updatedAt: '2024-12-07T18:30:30.000Z',
                    },
                ],
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Authentication required',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden. Admin access required',
    })
    async getAllBicycles() {
        return await this.bicyclesService.findAll();
}

    @Post('create')
    // Create a bike
    async createABike() {
        console.log("skapa cykel");

        return await this.bicyclesService.createBike();
    }

    @Get(':bikeId')
    // Get a bike
    async getBikeById(@Param('id') id: string) {
        return await this.bicyclesService.findById(id);
    }

}