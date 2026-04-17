// Standalone script to add registrationNumber column and seed members
// Uses DATABASE_URL (pooler) directly to bypass DIRECT_URL connection issues
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const members = [
    { name: 'Shelton K David', email: 'sheltonkudziedavid@gmail.com', registrationNumber: 'R222372W', contactInfo: '0786739346', fieldOfStudy: 'Multi Media and Production', password: 'shelton' },
    { name: 'Tendai Chinyokoto', email: 'tendaichinyokaz@gmail.com', registrationNumber: 'R2421096', contactInfo: '0776138391', fieldOfStudy: 'Supply Chain Management', password: 'tendai' },
    { name: 'Takudzwa Samhungu', email: 'takudzwasamhungu@gmail.com', registrationNumber: 'R2420439', contactInfo: '0786388625', fieldOfStudy: 'HCS', password: 'takudzwa' },
    { name: 'Litchell Mutekesa', email: 'mutekesalitchell3@gmail.com', registrationNumber: 'R2420433', contactInfo: '0775597847', fieldOfStudy: 'HCS', password: 'litchell' },
    { name: 'Tadiwanashe Tom', email: 'kellytadiwanashe080@gmail.com', registrationNumber: 'R2531429', contactInfo: '0717383091/0784706790', fieldOfStudy: 'Criminology and Society', password: 'tadiwanashe' },
    { name: 'Tanaka Mangwindime', email: 'tanakamangwindime94@gmail.com', registrationNumber: 'R2530334', contactInfo: '0780925949', fieldOfStudy: 'Geographic Information Science and Earth Observations', password: 'tanaka' },
    { name: 'Loswita G Kamuzangaza', email: 'kloswita@gmail.com', registrationNumber: 'R222349T', contactInfo: '0782421328', fieldOfStudy: 'HMMP4.2', password: 'loswita' },
    { name: 'Serere Munashe', email: 'munashemakanakaserere@gmail.com', registrationNumber: 'R2421730', contactInfo: '0778185859', fieldOfStudy: 'BSc Honours in Civil Engineering', password: 'serere' },
    { name: 'Martin Future Dota', email: 'martindota259@gmail.com', registrationNumber: 'R2529736', contactInfo: '+263 784658037', fieldOfStudy: 'Geographic Information Science and Earth Observations', password: 'martin' },
    { name: 'Shaun Bryan Karongosora', email: 'shaunbryan899@gmail.com', registrationNumber: 'R228712S', contactInfo: '0771798467', fieldOfStudy: 'Film, Radio and Television Productions', password: 'shaun' },
    { name: 'Freddy Tanatswa Nyamukaya', email: 'freddynyamukaya@gmail.com', registrationNumber: 'R2531732', contactInfo: '0788514341', fieldOfStudy: 'HGISEO', password: 'freddy' },
    { name: 'Nokutenda Changadzo', email: 'nokutendachangadzo@gmail.com', registrationNumber: 'R2533988', contactInfo: '0782002167', fieldOfStudy: 'HPHC', password: 'nokutenda' },
    { name: 'Whitley Musika', email: 'whitleymus@icloud.com', registrationNumber: 'R207305R', contactInfo: '0789379848', fieldOfStudy: 'Geographic Information Science and Earth Observation', password: 'whitley' },
    { name: 'Florence Amanda Muzambani', email: 'flocymazy@gmail.com', registrationNumber: 'R226586U', contactInfo: '0789990465/0778967392', fieldOfStudy: 'Multi-media Production', password: 'florence' },
    { name: 'Tadiwanashe Clide Rumombe', email: 'clydetadiwa8@gmail.com', registrationNumber: 'R2420252', contactInfo: '0717713380/0781646052', fieldOfStudy: 'Artificial Intelligence and Machine Learning', password: 'tadiwanashe' },
];

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    console.log('✅ Connected to database\n');

    // 1. Add registrationNumber column if it doesn't exist
    try {
        await client.query(`
      ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "registrationNumber" TEXT UNIQUE;
    `);
        console.log('✅ registrationNumber column ready\n');
    } catch (err) {
        console.log('ℹ️  registrationNumber column may already exist:', err.message);
    }

    // 2. Seed members
    console.log('🌱 Seeding members...\n');
    let inserted = 0;
    let skipped = 0;

    for (const m of members) {
        // Check if member already exists
        const existing = await client.query('SELECT id FROM "Member" WHERE email = $1', [m.email]);
        if (existing.rows.length > 0) {
            // Update existing member with new fields
            await client.query(
                `UPDATE "Member" SET "registrationNumber" = $1, "contactInfo" = $2, "fieldOfStudy" = $3 WHERE email = $4`,
                [m.registrationNumber, m.contactInfo, m.fieldOfStudy, m.email]
            );
            console.log(`  🔄 Updated: ${m.name} (${m.email})`);
            skipped++;
            continue;
        }

        const hashedPassword = await bcrypt.hash(m.password, 10);
        const id = crypto.randomUUID();
        await client.query(
            `INSERT INTO "Member" (id, email, password, name, "registrationNumber", "contactInfo", "fieldOfStudy", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'MEMBER', NOW(), NOW())`,
            [id, m.email, hashedPassword, m.name, m.registrationNumber, m.contactInfo, m.fieldOfStudy]
        );
        console.log(`  ✅ Inserted: ${m.name} (${m.email})`);
        inserted++;
    }

    // 3. Show summary
    const countResult = await client.query('SELECT COUNT(*) FROM "Member"');
    console.log(`\n🎉 Done! Inserted: ${inserted}, Updated: ${skipped}. Total members in DB: ${countResult.rows[0].count}`);

    await client.end();
}

main().catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
});
