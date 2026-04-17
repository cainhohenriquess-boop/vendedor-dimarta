import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

type ParsedArgs = {
  name?: string;
  email?: string;
  password?: string;
  inactive?: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextValue = argv[index + 1];

    if (arg === "--inactive") {
      parsed.inactive = true;
      continue;
    }

    if (!nextValue) {
      continue;
    }

    if (arg === "--name") {
      parsed.name = nextValue.trim();
      index += 1;
      continue;
    }

    if (arg === "--email") {
      parsed.email = nextValue.trim().toLowerCase();
      index += 1;
      continue;
    }

    if (arg === "--password") {
      parsed.password = nextValue;
      index += 1;
    }
  }

  return parsed;
}

function printUsage() {
  console.log(
    [
      "Uso:",
      'npm run user:create -- --name "Maria Silva" --email "maria@dimarta.com" --password "Senha123"',
      "",
      "Opcoes:",
      "--name       Nome do vendedor",
      "--email      E-mail de acesso",
      "--password   Senha em texto puro, convertida automaticamente em hash",
      "--inactive   Cria o acesso desativado",
    ].join("\n"),
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.name || !args.email || !args.password) {
    printUsage();
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: args.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error(`Ja existe um usuario com o e-mail ${args.email}.`);
  }

  const passwordHash = await bcrypt.hash(args.password, 10);

  const user = await prisma.user.create({
    data: {
      name: args.name,
      email: args.email,
      passwordHash,
      role: UserRole.SELLER,
      isActive: !args.inactive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  console.log("Usuario criado com sucesso:");
  console.log(`ID: ${user.id}`);
  console.log(`Nome: ${user.name}`);
  console.log(`E-mail: ${user.email}`);
  console.log(`Status: ${user.isActive ? "ativo" : "inativo"}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
