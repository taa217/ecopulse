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
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
});

// --- Members API ---
app.get('/api/members', authenticateToken, async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            select: { id: true, name: true, email: true, role: true, position: true, activityHistory: true, birthdays: true, contactInfo: true, fieldOfStudy: true, yearOfStudy: true, createdAt: true },
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

app.post('/api/members', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password || 'member123', 10);
        const newMember = await prisma.member.create({
            data: { ...rest, password: hashedPassword }
        });
        const { password: _, ...memberWithoutPassword } = newMember;
        res.json(memberWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/members/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const updateData = { ...req.body };
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
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/members/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.member.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Ideas API ---
app.get('/api/ideas', authenticateToken, async (req, res) => {
    try {
        const ideas = await prisma.idea.findMany({ include: { member: { select: { name: true, email: true } } } });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ideas' });
    }
});

app.post('/api/ideas', authenticateToken, async (req, res) => {
    try {
        const newIdea = await prisma.idea.create({
            data: { ...req.body, memberId: req.user.id }
        });
        res.json(newIdea);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/ideas/:id', authenticateToken, async (req, res) => {
    try {
        const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });
        if (idea.memberId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to edit this idea' });
        }
        const updatedIdea = await prisma.idea.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(updatedIdea);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/ideas/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await prisma.idea.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
