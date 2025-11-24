import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnvironmentsService } from './environments.service';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { CreateEnvironmentDto } from './dtos';

@ApiTags('environments')
@Controller({ path: 'projects/:projectId/environments', version: '1' })
export class EnvironmentsController {
    constructor(
        private readonly environmentsService: EnvironmentsService,
    ) { }

    @ApiOperation({ summary: 'Create a new environment for a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post()
    async createEnvironmentForProject(
        @AuthUser() user: AuthUserDto,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() createEnvironmentDto: CreateEnvironmentDto,
    ) {
        return this.environmentsService.createEnvironmentForProject(user.id, projectId, createEnvironmentDto);
    }


    @ApiOperation({ summary: 'Get all environments for a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get()
    async getAllEnvironmentsForProject(
        @AuthUser() user: AuthUserDto,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.environmentsService.getAllEnvironmentsForProject(user.id, projectId);
    }
}
