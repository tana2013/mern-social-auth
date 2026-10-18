import type { NextFunction, Request, Response } from "express";

export interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: Record<string, { message: string }>;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Processing Error.";

    // A. Catch Mongoose Validation Errors (e.g. invalid lengths or custom error messages)
    if (err.name === "ValidationError" && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
    }

    // B. Catch Mongoose Duplicate Key Index Errors (e.g. non-unique StoreName / Email registrations)
    if (err.code === 11000 && err.keyValue) {
        statusCode = 400;
        const duplicatedField = Object.keys(err.keyValue)[0];
        // CUSTOM FRIENDLY MESSAGES FOR UNIQUE FIELDS
        if (duplicatedField === "storeName") {
            message = "This Store Name is already taken! Please choose another one.";
        } else if (duplicatedField === "email") {
            message = "This email address is already registered to a user account.";
        } else if (duplicatedField === "businessEmail") {
            message = "This business email is already registered to a vendor profile.";
        } else {
            message = `Duplicate Error: The provided value for ${duplicatedField} is already taken.`;
        }
        // message = `Duplicate Error: An account parameter matching that value already exists for standard index identifier [${duplicatedField}].`;
    }

    // C. Catch Mongoose Cast Errors (e.g. malformed MongoDB Object IDs inside routing query loops)
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Resource Data Format Exception: Provided query hex reference ID key format is invalid.";
    }

    // D. Catch Multer File Upload System Restrictions
    if (err.message.includes("File too large")) {
        statusCode = 400;
        message = "Upload Restriction Exception: File size target is too massive! Limit ceiling cap is strictly 5MB.";
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
