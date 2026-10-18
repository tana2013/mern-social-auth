import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // Note the explicit extension required for pure ESM modules

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) { res.status(400).json({ message: 'User already exists' }); return; }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const user = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) { res.status(400).json({ message: 'Invalid credentials' }); return; }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return; }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
