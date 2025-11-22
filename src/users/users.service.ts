import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';

/**
 * Service for managing users.
 */
@Injectable()
export class UsersService {
    constructor(
         @InjectRepository(User)
        private readonly usersRepository: EntityRepository<User>,
        private readonly entityManager: EntityManager,
    ) { }

    /**
     * Find a user by their email address.
     * @param email the email of the user to find
     * @returns the user found with the email specified, false otherwise
     */
    async findUserByEmail(email: string) {
        return this.usersRepository.findOne({ email });
    }

    /**
     * Create a new user.
     * @param data the data of the user to create
     * @returns the newly created user
     */
    async createUser(data: { email: string; passwordHash: string }): Promise<User> {
        const user = this.usersRepository.create(data);
        await this.entityManager.persistAndFlush(user);
        return user;
    }
}
