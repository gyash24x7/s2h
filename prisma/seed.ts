import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
	const userData = [
		{
			name: "Swarnava Das",
			email: "swarnava@gmail.com",
			avatar: "https://avatars.dicebear.com/api/adventurer-neutral/bcdjkvbdjkbvjdk.svg?r=50",
			salt: "bcdjkvbdjkbvjdk"
		},
		{
			name: "Preetam Sekhar",
			email: "preetam@gmail.com",
			avatar: "https://avatars.dicebear.com/api/adventurer-neutral/jkbdjdbchjscbkb.svg?r=50",
			salt: "jkbdjdbchjscbkb"
		},
		{
			name: "Vijayabharathi Murugan",
			email: "bj@gmail.com",
			avatar: "https://avatars.dicebear.com/api/adventurer-neutral/qrrwtgvdhjckslkjd.svg?r=50",
			salt: "qrrwtgvdhjckslkjd"
		},
		{
			name: "Pratik Manghwani",
			email: "pratik@gmail.com",
			avatar: "https://avatars.dicebear.com/api/adventurer-neutral/mxnbcnmbwhikldjxbcj.svg?r=50",
			salt: "mxnbcnmbwhikldjxbcj"
		}
	];

	await prisma.user.createMany( { data: userData } );

	const users = await prisma.user.findMany( { where: { email: { in: userData.map( user => user.email ) } } } );

	await prisma.litGame.create( {
		data: {
			createdById: users[ 0 ].id,
			code: "BCDEDIT",
			playerCount: 6,
			players: {
				create: users.map( user => (
					{
						name: user.name,
						avatar: user.avatar,
						userId: user.id
					}
				) )
			}
		}
	} );
}

seed()
	.catch( ( e ) => {
		console.error( e );
		process.exit( 1 );
	} )
	.finally( async () => {
		await prisma.$disconnect();
	} );