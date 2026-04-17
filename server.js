import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

const formatErrorResponse = (res, error) => {
    console.error('API Error:', error);
    const message = error.message || '';

    if (message.includes("Can't reach database") || message.includes("prisma") || message.includes("database server") || message.includes("ECONNREFUSED")) {
        return res.status(500).json({ error: "Can't reach server. Try again in a few moments." });
    }
    if (message.includes("Unique constraint failed")) {
        return res.status(400).json({ error: "This record already exists." });
    }
    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
};

// --- Auth Routes ---
app.post('/api/auth/setup', async (req, res) => {
    try {
        const adminCount = await prisma.member.count({ where: { role: 'ADMIN' } });
        if (adminCount > 0) return res.status(400).json({ error: 'Admin already exists' });

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.member.create({
            data: {
                email: 'admin@ecopulse.org',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'ADMIN'
            }
        });
        res.json({ message: 'Initial admin created!', email: admin.email, password: 'admin123' });
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.member.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

// --- Change Password ---
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        if (newPassword.length < 4) {
            return res.status(400).json({ error: 'New password must be at least 4 characters' });
        }

        const user = await prisma.member.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.member.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

// --- Members API ---
app.get('/api/members', authenticateToken, async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            select: { id: true, name: true, email: true, role: true, position: true, activityHistory: true, birthdays: true, contactInfo: true, fieldOfStudy: true, yearOfStudy: true, registrationNumber: true, createdAt: true },
        });
        res.json(members);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.post('/api/members', authenticateToken, async (req, res) => {
    try {
        const { password, role, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password || 'member123', 10);
        const newMember = await prisma.member.create({
            data: { ...rest, role: 'MEMBER', password: hashedPassword }
        });
        const { password: _, ...memberWithoutPassword } = newMember;
        res.json(memberWithoutPassword);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.get('/api/members/:id', authenticateToken, async (req, res) => {
    try {
        const member = await prisma.member.findUnique({ where: { id: req.params.id } });
        if (!member) return res.status(404).json({ error: 'Member not found' });
        const { password: _, ...memberWithoutPassword } = member;
        res.json(memberWithoutPassword);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.put('/api/members/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to edit this profile' });
        }

        const updateData = { ...req.body };

        // Prevent standard members from changing their role, email, or registrationNumber
        if (req.user.role !== 'ADMIN') {
            delete updateData.role;
            delete updateData.email;
            delete updateData.registrationNumber;
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const updatedMember = await prisma.member.update({
            where: { id: req.params.id },
            data: updateData
        });
        const { password: _, ...memberWithoutPassword } = updatedMember;
        res.json(memberWithoutPassword);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.delete('/api/members/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.idea.updateMany({
            where: { memberId: req.params.id },
            data: { memberId: null }
        });
        await prisma.member.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

// --- Ideas API ---
app.get('/api/ideas', authenticateToken, async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({
            include: {
                member: { select: { name: true, email: true } },
                collaborators: { select: { id: true, name: true } }
            }
        });
        res.json(ideas);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.post('/api/ideas', authenticateToken, async (req, res) => {
    try {
        const { collaboratorIds, ...ideaData } = req.body;
        const newIdea = await prisma.idea.create({
            data: {
                ...ideaData,
                memberId: req.user.id,
                ...(collaboratorIds && { collaborators: { connect: collaboratorIds.map(id => ({ id })) } })
            },
            include: {
                collaborators: { select: { id: true, name: true } }
            }
        });
        res.json(newIdea);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.put('/api/ideas/:id', authenticateToken, async (req, res) => {
    try {
        const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });
        if (idea.memberId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to edit this idea' });
        }

        const { collaboratorIds, ...ideaData } = req.body;
        const updatedIdea = await prisma.idea.update({
            where: { id: req.params.id },
            data: {
                ...ideaData,
                ...(collaboratorIds && { collaborators: { set: collaboratorIds.map(id => ({ id })) } })
            },
            include: {
                collaborators: { select: { id: true, name: true } }
            }
        });
        res.json(updatedIdea);
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

app.delete('/api/ideas/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.idea.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        formatErrorResponse(res, error);
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
