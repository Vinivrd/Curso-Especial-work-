const spreadSheet = SpreadsheetApp.openById('12gRuEgIVOPZhCpM8qFeGmLmJd-aPeBBgxP6iNRwZr38');
const submitsSheet = spreadSheet.getSheetByName('Submissões');
const cursosSheet = spreadSheet.getSheetByName('Cursos');
const enfasesSheet = spreadSheet.getSheetByName('Ênfases');

const form = FormApp.openById('13vQVA29s9dCGVQ7kXUOtA824UThUT4JETnXilyQHucM');

const formsFolder = DriveApp.getFolderById('1fEIRu-JzjVMK6wUpOuUsFfatbW2kz_U9');

// Lê os cursos registrados
function getCursos() {
    if (cursosSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de cursos');
        return [];
    }

    let cursos: any[] = [];

    try {
        cursos = cursosSheet.getRange(1, 1, cursosSheet.getLastRow()).getValues();
        cursos = cursos.map(c => c[0]);
    } catch (e) {
        Logger.log('Erro: Não foi possível encontrar cursos');
    }

    return cursos;
}

// Lê as ênfases registradas
function getEnfases() {
    if (enfasesSheet === null) {
        Logger.log('Erro: Não foi possível encontrar a planilha de enfases');
        return [];
    }

    let enfases: any[][] = [];

    try {
        // Pega todas as linhas da planilha
        let results = enfasesSheet.getRange(1, 1, enfasesSheet.getLastRow(), enfasesSheet.getLastColumn()).getValues();

        // Para cada linha, transforma em um array
        for (let e of results) {
            e[2] = JSON.parse(e[2]);
            e[4] = JSON.parse(e[4]);

            enfases.push(e);
        }
    } catch (e) {
        Logger.log('Erro: Não foi possível encontrar enfases');
    }

    return enfases;
}

// Pega a URL do Site
function getScriptURL() {
    return ScriptApp.getService().getUrl();
}
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }