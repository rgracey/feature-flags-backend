import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from '../dtos';
import { FeatureFlagNotFound, FeatureFlagWithKeyAlreadyExistsError } from '../errors';
import { EvaluationService, RulesService } from 'src/rules/services';
import { EvaluationContextDto, EvaluationResultDto } from 'src/rules';

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
        // TODO - this endpoint will be removed in favour of separate client (client and server) initialisation endpoints
        const featureFlag = await this.featureFlagsService.getFeatureFlagByKeyForProject(
            user.id,
            projectId,
            featureFlagKey
        );

        if (!featureFlag) {
            throw new FeatureFlagNotFound(featureFlagKey);
        }

        // Getting rules DOES NOT enforce any authorisation
        const rules = await this.rulesService.getRules(featureFlag.id);

        console.log('Evaluating feature flag with rules:', rules);

        return this.evaluationService.evaluate(evaluationContext, rules);
    }

}
