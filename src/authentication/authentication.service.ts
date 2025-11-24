import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new user with email and password.
     * @param email the email of the user to register
     * @param password the plaintext password of the user to register
     * @returns the newly created user if successful
     */
    async registerEmailPassword(email: string, password: string) {
        const existingUser = await this.usersService.findUserByEmail(email);

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const passwordHash = await this.hashPassword(password);

        const newUser = await this.usersService.createUser({
            email,
            passwordHash,
        });

        return this.issueTokens(newUser.id);
    }

    /**
     * Authenticate a user by their email and password and issue tokens.
     * @param email the email of the user to authenticate
     * @param password the plaintext password of the user to authenticate
     * @returns an access and refresh token for the user
     */
    async authenticateEmailPassword(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return null;
        }

        return this.issueTokens(user.id);
    }

    /**
     * Hash a password
     * @param password the plaintext password to hash
     * @returns the hashed password
     */
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    /**
     * Verify a plaintext password against a hashed password.
     * @param password the plaintext password to verify
     * @param hash the hashed password to verify against
     * @returns true if the passwords match, false otherwise
     */
    private async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Create access and refresh tokens for a user.
     * @param userId the ID of the user to use for the "sub" claim
     * @returns usable access and refresh tokens for a user
     */
    private async issueTokens(userId: string) {
        return {
            accessToken: await this.generateAccessToken(userId),
            refreshToken: await this.generateRefreshToken(userId),
        };
    }

    /**
     * Generate an access token for a user.
     * @param userId the ID of the user to use for the "sub" claim in the access token
     * @returns the access token for the user
     */
    private async generateAccessToken(userId: string): Promise<string> {
        const payload = { sub: userId, type: 'access' };
        return this.jwtService.signAsync(payload, { expiresIn: 60 * 15 }); // 15 minutes
    }

    /**
     * Generate a refresh token for a user.
     * @param userId the ID of the user to use for the "sub" claim in the refresh token
     * @returns the refresh token for the user
     */
    private async generateRefreshToken(userId: string): Promise<string> {
        const payload = { sub: userId, type: 'refresh' };
        return this.jwtService.signAsync(payload, { expiresIn: 60 * 60 * 24 * 7 }); // 7 days
    }
}
