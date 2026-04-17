import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const members = [
    {
        name: 'Shelton K David',
        email: 'sheltonkudziedavid@gmail.com',
        registrationNumber: 'R222372W',
        contactInfo: '0786739346',
        fieldOfStudy: 'Multi Media and Production',
        password: 'shelton',
    },
    {
        name: 'Tendai Chinyokoto',
        email: 'tendaichinyokaz@gmail.com',
        registrationNumber: 'R2421096',
        contactInfo: '0776138391',
        fieldOfStudy: 'Supply Chain Management',
        password: 'tendai',
    },
    {
        name: 'Takudzwa Samhungu',
        email: 'takudzwasamhungu@gmail.com',
        registrationNumber: 'R2420439',
        contactInfo: '0786388625',
        fieldOfStudy: 'HCS',
        password: 'takudzwa',
    },
    {
        name: 'Litchell Mutekesa',
        email: 'mutekesalitchell3@gmail.com',
        registrationNumber: 'R2420433',
        contactInfo: '0775597847',
        fieldOfStudy: 'HCS',
        password: 'litchell',
    },
    {
        name: 'Tadiwanashe Tom',
        email: 'kellytadiwanashe080@gmail.com',
        registrationNumber: 'R2531429',
        contactInfo: '0717383091/0784706790',
        fieldOfStudy: 'Criminology and Society',
        password: 'tadiwanashe',
    },
    {
        name: 'Tanaka Mangwindime',
        email: 'tanakamangwindime94@gmail.com',
        registrationNumber: 'R2530334',
        contactInfo: '0780925949',
        fieldOfStudy: 'Geographic Information Science and Earth Observations',
        password: 'tanaka',
    },
    {
        name: 'Loswita G Kamuzangaza',
        email: 'kloswita@gmail.com',
        registrationNumber: 'R222349T',
        contactInfo: '0782421328',
        fieldOfStudy: 'HMMP4.2',
        password: 'loswita',
    },
    {
        name: 'Serere Munashe',
        email: 'munashemakanakaserere@gmail.com',
        registrationNumber: 'R2421730',
        contactInfo: '0778185859',
        fieldOfStudy: 'BSc Honours in Civil Engineering',
        password: 'serere',
    },
    {
        name: 'Martin Future Dota',
        email: 'martindota259@gmail.com',
        registrationNumber: 'R2529736',
        contactInfo: '+263 784658037',
        fieldOfStudy: 'Geographic Information Science and Earth Observations',
        password: 'martin',
    },
    {
        name: 'Shaun Bryan Karongosora',
        email: 'shaunbryan899@gmail.com',
        registrationNumber: 'R228712S',
        contactInfo: '0771798467',
        fieldOfStudy: 'Film, Radio and Television Productions',
        password: 'shaun',
    },
    {
        name: 'Freddy Tanatswa Nyamukaya',
        email: 'freddynyamukaya@gmail.com',
        registrationNumber: 'R2531732',
        contactInfo: '0788514341',
        fieldOfStudy: 'HGISEO',
        password: 'freddy',
    },
    {
        name: 'Nokutenda Changadzo',
        email: 'nokutendachangadzo@gmail.com',
        registrationNumber: 'R2533988',
        contactInfo: '0782002167',
        fieldOfStudy: 'HPHC',
        password: 'nokutenda',
    },
    {
        name: 'Whitley Musika',
        email: 'whitleymus@icloud.com',
        registrationNumber: 'R207305R',
        contactInfo: '0789379848',
        fieldOfStudy: 'Geographic Information Science and Earth Observation',
        password: 'whitley',
    },
    {
        name: 'Florence Amanda Muzambani',
        email: 'flocymazy@gmail.com',
        registrationNumber: 'R226586U',
        contactInfo: '0789990465/0778967392',
        fieldOfStudy: 'Multi-media Production',
        password: 'florence',
    },
    {
        name: 'Tadiwanashe Clide Rumombe',
        email: 'clydetadiwa8@gmail.com',
        registrationNumber: 'R2420252',
        contactInfo: '0717713380/0781646052',
        fieldOfStudy: 'Artificial Intelligence and Machine Learning',
        password: 'tadiwanashe',
    },
];

async function main() {
    console.log('🌱 Seeding EcoPulse members...\n');

    for (const member of members) {
        const hashedPassword = await bcrypt.hash(member.password, 10);

        const upserted = await prisma.member.upsert({
            where: { email: member.email },
            update: {
                name: member.name,
                registrationNumber: member.registrationNumber,
                contactInfo: member.contactInfo,
                fieldOfStudy: member.fieldOfStudy,
            },
            create: {
                name: member.name,
                email: member.email,
                password: hashedPassword,
                registrationNumber: member.registrationNumber,
                contactInfo: member.contactInfo,
                fieldOfStudy: member.fieldOfStudy,
                role: 'MEMBER',
            },
        });

        console.log(`  ✅ ${upserted.name} (${upserted.email})`);
    }

    console.log(`\n🎉 Done! ${members.length} members seeded.`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
