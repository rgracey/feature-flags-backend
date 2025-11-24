import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { CreateFeatureFlagDto, EvaluationContextDto, EvaluationResultDto, UpdateFeatureFlagDto } from '../dtos';
import { FeatureFlagWithKeyAlreadyExistsError } from '../errors';
import { EvaluationService } from '../services';

@ApiTags('feature-flags')
@Controller({ path: 'projects/:projectId/feature-flags', version: '1' })
export class FeatureFlagsController {
    constructor(
        private readonly featureFlagsService: FeatureFlagsService,
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
        return this.featureFlagsService.updateFeatureFlag(user.id, projectId, featureFlagKey, updateFeatureFlagDto);
    }

    @ApiOperation({ summary: 'Evaluate a feature flag for a given set of attributes' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard) // TODO - needs client or API key auth
    @Post(":featureFlagKey/evaluate")
    @ApiResponse({ status: 200, description: 'The result of the feature flag evaluation.', type: EvaluationResultDto })
    async evaluateFeatureFlag(
        @AuthUser() user: AuthUserDto,
        @Body() evaluationContext: EvaluationContextDto,
        @Param('projectId') projectId: string,
        @Param('featureFlagKey') featureFlagKey: string
    ) {
        return this.evaluationService.evaluateFeatureFlag(
            user.id,
            projectId,
            featureFlagKey,
            evaluationContext
        );
    }

}
