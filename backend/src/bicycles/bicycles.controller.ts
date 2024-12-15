import { Controller, Get, Post, UseGuards, Param, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BicyclesService } from './bicycles.service';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';

@Controller('bike')
export class BicyclesController {
  constructor(private readonly bicyclesService: BicyclesService) {}

    // Fetch all bicycles
    @Get()
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
    async getBikeById(@Param('bikeId') id: string) {
        return await this.bicyclesService.findById(id);
    }

    @Patch(':bikeId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update bicycle by ID (Only for admin)' })
    @ApiParam({
        name: 'bikeId',
        description: 'The ID of the bicycle',
        example: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
    })
    @ApiBody({
        description: 'The body containing the updated bicycle details',
        type: UpdateBicycleDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Bicycle updated successfully',
        examples: {
            'application/json': {
                summary: 'Example of a successful bicycle update',
                value: {
                    id: 'b1e77dd3-9fb9-4e6c-a5c6-b6fc58f59464',
                    batteryLevel: 85,
                    latitude: 59.3294,
                    longitude: 18.0687,
                    status: 'Service',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input',
    })
    @ApiResponse({
        status: 404,
        description: 'Bicycle not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized. Authentication required',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden. Admin access required',
    })
    async updateBicycle(
        @Param('bikeId') bikeId: string,
        @Body() updateBicycleDto: UpdateBicycleDto
    ) {
        return this.bicyclesService.update(bikeId, updateBicycleDto);
    }
    

}