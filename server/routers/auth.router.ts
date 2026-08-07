/**
 * Auth Router - tRPC routes for authentication
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import * as authService from "../services/auth.service";

export const authRouter = router({
  /**
   * Register a new user
   */
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        username: z.string().optional(),
        department: z.string().optional(),
        year: z.number().min(1).max(4).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await authService.register(input);
        return {
          success: true,
          token: result.token,
          user: result.user,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    }),

  /**
   * Login a user
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await authService.login(input);
        return {
          success: true,
          token: result.token,
          user: result.user,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
    }),

  /**
   * Get user by ID
   */
  getUserById: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await authService.getUserById(input.userId);
      return user;
    }),

  /**
   * Get user by email
   */
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const user = await authService.getUserByEmail(input.email);
      return user;
    }),

  /**
   * Verify token
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = authService.verifyToken(input.token);
        const user = await authService.getUserById(decoded.id);
        return {
          valid: true,
          user,
        };
      } catch {
        return {
          valid: false,
          user: null,
        };
      }
    }),

  /**
   * Update profile
   */
  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        name: z.string().optional(),
        bio: z.string().optional(),
        department: z.string().optional(),
        year: z.number().optional(),
        skills: z.array(z.string()).optional(),
        techStack: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...updates } = input;
      
      // Convert arrays to JSON strings
      const processedUpdates: any = { ...updates };
      if (updates.skills) processedUpdates.skills = JSON.stringify(updates.skills);
      if (updates.techStack) processedUpdates.techStack = JSON.stringify(updates.techStack);
      if (updates.interests) processedUpdates.interests = JSON.stringify(updates.interests);

      const user = await authService.updateProfile(userId, processedUpdates);
      return {
        success: true,
        user,
      };
    }),

  /**
   * Change password
   */
  changePassword: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        currentPassword: z.string(),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await authService.changePassword(
          input.userId,
          input.currentPassword,
          input.newPassword
        );
        return {
          success: true,
          message: "Password changed successfully",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to change password",
        };
      }
    }),

  /**
   * Logout
   */
  logout: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await authService.logout(input.userId);
      return {
        success: true,
        message: "Logged out successfully",
      };
    }),
});
