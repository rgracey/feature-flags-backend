import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { CreateFeatureFlagDto } from '../dtos';
import { FeatureFlagWithKeyAlreadyExistsError } from '../errors';

@ApiTags('feature-flags')
@Controller({ path: 'projects/:projectId/feature-flags', version: '1' })
export class FeatureFlagsController {
    constructor(private readonly featureFlagsService: FeatureFlagsService) { }

    @ApiOperation({ summary: 'Get all feature flags for a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get()
    async getFeatureFlagsForProject(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string
    ) {
        return this.featureFlagsService.getFeatureFlagsForProject(user.id, projectId);
    }

    @ApiOperation({ summary: 'Create a new feature flag for a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post()
    async createFeatureFlagForProject(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string,
        @Body() createFeatureFlagDto: CreateFeatureFlagDto,
    ) {
        try {
            return await this.featureFlagsService.createFeatureFlagForProject(user.id, projectId, createFeatureFlagDto);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof FeatureFlagWithKeyAlreadyExistsError) {
                throw new BadRequestException(error.message);
            }
        }
    }

}
