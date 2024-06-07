function adicionarCurso(name: string) {
    Logger.log(`Adicionando curso: ${name}`);

    if (cursosSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de cursos');
        return;
    }

    // Checa se o curso já existe
    if (getCursos().indexOf(name) !== -1) {
        Logger.log('Erro: O curso já existe');
        return;
    }

    Logger.log(`Curso adicionado: ${name}`);
    cursosSheet.appendRow([name]);
}

function adicionarEnfase(name: string[], course: string, classesGroup1: string[], minClassesGroup1: number, classesGroup2: string[], minClassesGroup2: number, minCredits: number) {
    Logger.log(`Adicionando Ênfase: ${name} (${course})`);

    if (enfasesSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de enfases');
        return;
    }
    
    if (cursosSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de cursos');
        return;
    }

    // Checa se o curso existe
    if (getCursos().indexOf(course) === -1) {
        Logger.log('Erro: O curso não existe');
        return;
    }

    // Checa se a enfase já existe através da combinação dela e de seu curso
    if (getEnfases().some(e => e[0] === name && e[1] === course)) {
        Logger.log('Erro: A ênfase existe');
        return;
    }

    Logger.log(`Ênfase adicionada: ${name} (${course})`);
    enfasesSheet.appendRow([name, course, JSON.stringify(classesGroup1), minClassesGroup1, JSON.stringify(classesGroup2), minClassesGroup2, minCredits]);
}

function atualizarCurso(oldName: string, newName: string) {
    Logger.log(`Atualizando curso: ${oldName} -> ${newName}`);
    
    if (cursosSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de cursos');
        return;
    }

    const cursos = getCursos();

    // Checa se o curso já existe
    if (cursos.indexOf(newName) !== -1) {
        Logger.log('Erro: Os novos dados do curso estão em conflito com outro curso existente');
        return;
    }

    let row = cursos.indexOf(oldName);
    if (row === -1) {
        Logger.log('Erro: Não foi possível encontrar o curso');
        return;
    }

    // Atualiza o nome do curso nas ênfases
    let enfases = getEnfases();
    enfases.map(e => {
        if (e[1] === oldName) {
            let att = e.slice(0);
            att[1] = newName;
            atualizarEnfase(e, att);
        }
    })

    Logger.log(`Curso atualizado: ${oldName} -> ${newName}`);
    cursosSheet.getRange(row + 1, 1).setValue(newName);
}

function atualizarEnfase(oldEnfase: any[], newEnfase: any[]) {
    Logger.log(`Atualizando ênfase: ${oldEnfase} -> ${newEnfase}`);

    if (enfasesSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de ênfases');
        return;
    }

    const enfases = getEnfases();

    if ((oldEnfase[0] !== newEnfase[0] || oldEnfase[1] !== newEnfase[1]) && enfases.some(e => e[0] === newEnfase[0] && e[1] === newEnfase[1])) {
        Logger.log('Erro: Os novos dados da ênfase estão em conflito com outra ênfase existente');
        return;
    }

    let row = enfases.findIndex(e => e[0] === oldEnfase[0] && e[1] === oldEnfase[1]);

    // Checa se a enfase já existe através da combinação dela e de seu curso
    if (row === -1) {
        Logger.log('Erro: A ênfase a ser atualizada não existe');
        return;
    }

    Logger.log(`Ênfase atualizada: ${oldEnfase} -> ${newEnfase}`);
    enfasesSheet.getRange(row + 1, 1, 1, 7)
        .setValues([[newEnfase[0], newEnfase[1], JSON.stringify(newEnfase[2]), newEnfase[3], JSON.stringify(newEnfase[4]), newEnfase[5], newEnfase[6]]]);
}

function removerCurso(name: string) {
    Logger.log(`Removendo curso: ${name}`);

    if (cursosSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de cursos');
        return;
    }

    let row = cursosSheet.getRange(1, 1, cursosSheet.getLastRow()).getValues().map(c => c[0]).indexOf(name);
    if (row === -1) {
        Logger.log('Erro: Não foi possível encontrar o curso');
        return;
    }

    let enfases = getEnfases();
    if (enfases.some(e => e[1] === name)) {
        Logger.log('Erro: O curso a ser removido tem ênfases cadastradas');
        return;
    }

    Logger.log(`Curso removido: ${name}`);
    cursosSheet.deleteRow(row + 1);
}

function removerEnfase(name: string, course: string) {
    Logger.log(`Removendo Ênfase: ${name} (${course})`);

    if (enfasesSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de enfases');
        return;
    }

    let row = getEnfases().findIndex(e => e[0] === name && e[1] === course);
    if (row === -1) {
        Logger.log('Erro: Não foi possível encontrar a ênfase');
        return;
    }

    Logger.log(`Enfase removida: ${name} (${course})`);
    enfasesSheet.deleteRow(row + 1);
}