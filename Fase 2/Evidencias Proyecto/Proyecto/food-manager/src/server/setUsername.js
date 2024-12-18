const prisma = require("./prisma");

async function main() {
    console.log("Actualizando usuarios...");
    const oldUsernames = [];
    const BATCH_SIZE = 50;

    try {
        const usuarios = await prisma.Funcionario.findMany({
            select: {
                IdFuncionario: true,
                NombreFuncionario: true,
                username: true,
                DvFuncionario: true,
                apellido_paterno: true  
            },
            where: {
                IdFuncionario: {
                    notIn: [2557,2556,2555,2554,2548,2547,2545]
                }
            }
        });

        // Mapa para rastrear contadores de usernames duplicados
        const usernameCounters = new Map();

        for (let i = 0; i < usuarios.length; i += BATCH_SIZE) {
            const batch = usuarios.slice(i, i + BATCH_SIZE);
            
            await prisma.$transaction(async (tx) => {
                const todosLosUsernames = await tx.Funcionario.findMany({
                    select: {
                        IdFuncionario: true,
                        username: true
                    }
                });

                const usernamesMap = new Map(
                    todosLosUsernames.map(u => [u.username, u.IdFuncionario])
                );

                for (const u of batch) {
                    oldUsernames.push({
                        id: u.IdFuncionario,
                        oldUsername: u.username
                    });

                    const nombres = u.NombreFuncionario.trim().split(" ").filter(n => n);
                    let primeraLetra = nombres[0].charAt(0).toUpperCase();
                    
                    let apellidoPaterno;
                    if (u.apellido_paterno) {
                        apellidoPaterno = u.apellido_paterno.toLowerCase();
                    }
                    primeraLetra = primeraLetra.toLowerCase();
                    // Generar username base
                    let baseUsername = `${primeraLetra}.${apellidoPaterno}.${u.DvFuncionario}`;
                    let finalUsername = baseUsername;
                    let counter = 1;

                    // Si el username ya existe, agregar un número incremental
                    while (usernamesMap.has(finalUsername) && usernamesMap.get(finalUsername) !== u.IdFuncionario) {
                        if (!usernameCounters.has(baseUsername)) {
                            usernameCounters.set(baseUsername, 1);
                        }
                        counter = usernameCounters.get(baseUsername);
                        finalUsername = `${baseUsername}_${counter}`;
                        usernameCounters.set(baseUsername, counter + 1);
                    }

                    await tx.Funcionario.update({
                        where: {
                            IdFuncionario: u.IdFuncionario
                        },
                        data: {
                            username: finalUsername
                        }
                    });

                    usernamesMap.set(finalUsername, u.IdFuncionario);
                    console.log(`Actualizado ${u.IdFuncionario} de ${u.username} a ${finalUsername}`);
                }
            });
            
            console.log(`Procesado lote ${i/BATCH_SIZE + 1} de ${Math.ceil(usuarios.length/BATCH_SIZE)}`);
        }

        console.log("Todos los usuarios fueron actualizados exitosamente");

    } catch (error) {
        console.error("Error durante la actualización:", error);
        console.log("Información para rollback manual:");
        console.log(JSON.stringify(oldUsernames, null, 2));
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();