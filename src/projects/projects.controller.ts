import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dtos';

@ApiTags('projects')
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {

    constructor(private readonly projectsService: ProjectsService) { }

    @ApiOperation({ summary: 'Get all projects' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get()
    async getAllProjects(@AuthUser() user: AuthUserDto) {
        return this.projectsService.getAllProjectsForUser(user.id);
    }

    @ApiOperation({ summary: 'Create a new project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post()
    async createProject(@AuthUser() user: AuthUserDto, @Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(createProjectDto.name, user.id);
    }

}
