const spreadsheet = SpreadsheetApp.openById("1PELPjFOOqI6GR2272cztoPEzpmrOSPBM69FzRcegxGg");
const data_sheet = spreadsheet.getSheetByName("Dados");
const config_sheet = spreadsheet.getSheetByName("Configs");

const formato_padrao = DriveApp.getFileById("1daKA66rl9DsPiTqOAgtN3B5ySbIwWypyTP9kaUXYgEg");
const formato_bcd = DriveApp.getFileById("1IkACQC2H-OFZRJnzWS3JFDUZed4IB8CC_PG8kg2xvas");
const formato_bsi = DriveApp.getFileById("1YFe75OSLXdLPpsGktcNhx6TfPg6OCSqKbClMZucL-eE");

const folder = DriveApp.getFolderById("1kcEbTJpZTeUzYxsV10vvPbmRxotnVfau");

function criarPDFs() {
  //Configura os dados 
  const config_data = config_sheet.getDataRange().getValues();
  // Cria uma pasta onde os PDFs serão salvos
  const new_folder = folder.createFolder(`${config_data[1][0]} ${config_data[1][1]}o Semestre - ${new Date()}`);

  const data_rows = data_sheet.getDataRange().getValues();
  data_rows.map((data_row) => {
    if (data_rows.indexOf(data_row) === 0)
      return;

    // Escolhe o modelo a ser usado 
    let doc;
    
    if (data_row[5] === 'BCD') {
      doc = formato_bcd;
    }

    else if (data_row[5] === 'BSI') {
      doc = formato_bsi;
    }

    else {
      doc = formato_padrao;
    }

    // Cria uma cópia do modelo e abre ele
    const copy = doc.makeCopy(`${data_row[1]} - ${data_row[0]}`, new_folder);
    const mod = SlidesApp.openById(copy.getId());

    //Preenche Slides:  Substitui placeholders nos slides com os dados da planilha.
    const slides = mod.getSlides();
    slides.map((slide) => {
      slide.replaceAllText('{{nome do aluno}}', data_row[1]);
      slide.replaceAllText('{{nome do curso}}', data_row[2]);
      slide.replaceAllText('{{ano de término do curso}}', data_row[3]);
      slide.replaceAllText('{{nome do coordenador do curso}}', data_row[4]);
      slide.replaceAllText('{{nome da ênfase}}', data_row[5]);
      slide.replaceAllText('{{soma}}', data_row[8]);

      slide.replaceAllText('{{nome do diretor do ICMC}}', config_data[1][2]);
      slide.replaceAllText('{{data da colação}}', Utilities.formatDate(new Date(config_data[1][3]), "GMT-3", "MM/dd/yyyy"));
      slide.replaceAllText('{{nome do presidente da CG}}', config_data[1][4]);
    });

    //Gera e insere o texto dos departamentos. 
    const texto_departamentos = gerarTextoDepartamentos(JSON.parse(data_row[6]));
    slides[0].replaceAllText("{{nome dos Departamentos}}", texto_departamentos);

    /* PREENCHE A TABELA */
    const table = slides[1].getTables()[0];
    const disciplinas_data = JSON.parse(data_row[7]);

    preencherTabela(table, disciplinas_data);

    /* FECHA E CONCLUI */
    mod.saveAndClose();

    // Cria o PDF
    const blob = DriveApp.getFileById(mod.getId()).getBlob();
    new_folder.createFile(blob);

    // Descarta os Slides
    copy.setTrashed(true);
  })
}

function gerarTextoDepartamentos(departamentos) {
  let texto_departamentos = '';

  departamentos.map((departamento) => {
    // Adiciona os separadores * melhor inverter, fica melhor otimizado o código 
    let index = departamentos.indexOf(departamento);
    if (index > 0) { // ignora o primeiro departamento
      if (index === departamentos.length - 1) // é o último departamento
        texto_departamentos += ' e ';

      else // não é o último departamento
        texto_departamentos += ', ';
    }

    texto_departamentos += 'pelo Departamento de ' + departamento;
  });

  return texto_departamentos;
}

function preencherTabela(table, disciplinas) {
  disciplinas.map((disciplina) => {
    // Cria uma nova linha
    table.insertRow(2);
    const new_row = table.getRow(2);

    new_row.getCell(0).getText().insertText(0, disciplina[0]); // Sigla + Nome da Disciplina
    new_row.getCell(1).getText().insertText(0, disciplina[1]); // Nota
    new_row.getCell(2).getText().insertText(0, disciplina[2]); // Semestre / Ano
    new_row.getCell(3).getText().insertText(0, disciplina[3]); // Créditos
  });

  // Remove a linha de exemplo
  table.getRow(1).remove();
}