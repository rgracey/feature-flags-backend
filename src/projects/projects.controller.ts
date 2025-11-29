import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, ProjectDto } from './dtos';

@ApiTags('projects')
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {

    constructor(private readonly projectsService: ProjectsService) { }

    @ApiOperation({ summary: 'Get all projects' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @ApiResponse({ status: 200, description: 'List of projects for the authenticated user.', type: [ProjectDto] })
    @Get()
    async getAllProjects(@AuthUser() user: AuthUserDto) {
        return this.projectsService.getAllProjectsForUser(user.id);
    }

    @ApiOperation({ summary: 'Get a specific project by ID' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @ApiResponse({ status: 200, description: 'The requested project.', type: ProjectDto })
    @Get(':projectId')
    async getProjectById(@AuthUser() user: AuthUserDto, @Param('projectId') projectId: string) {
        return this.projectsService.getProjectById(user.id, projectId);
    }

    @ApiOperation({ summary: 'Create a new project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @ApiResponse({ status: 201, description: 'The created project.', type: ProjectDto })
    @Post()
    async createProject(@AuthUser() user: AuthUserDto, @Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(createProjectDto.name, user.id);
    }

}
