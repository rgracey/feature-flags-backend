import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from '../dtos';
import { FeatureFlagWithKeyAlreadyExistsError } from '../errors';
import { EvaluationService, RulesService } from 'src/rules/services';

@ApiTags('feature-flags')
@Controller({ path: 'projects/:projectId/feature-flags', version: '1' })
export class FeatureFlagsController {
    constructor(
        private readonly featureFlagsService: FeatureFlagsService,
        private readonly rulesService: RulesService,
        private readonly evaluationService: EvaluationService,
    ) { }

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

    @ApiOperation({ summary: 'Get a specific feature flag for a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get(":featureFlagKey")
    async getFeatureFlagByIdForProject(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string,
        @Param('featureFlagKey') featureFlagKey: string
    ) {
        return this.featureFlagsService.getFeatureFlagByKeyForProject(user.id, projectId, featureFlagKey);
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

    @ApiOperation({ summary: 'Update an existing feature flag' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Patch(":featureFlagKey")
    async updateFeatureFlagRules(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string,
        @Param('featureFlagKey') featureFlagKey: string,
        @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
    ) {
        return this.featureFlagsService.updateFeatureFlag(
            user.id,
            projectId,
            featureFlagKey,
            updateFeatureFlagDto
        );
    }
}
