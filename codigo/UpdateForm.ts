// Adiciona a informação fixa ao novo formulário
function addBasicInfoToForm(form: GoogleAppsScript.Forms.Form) {
  form.addTextItem().setTitle('Nome completo').setRequired(true);

  form.addTextItem().setTitle('Número USP').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireWholeNumber()
      .requireNumberGreaterThan(0)
      .build(),
    );

  form.addTextItem().setRequired(true).setTitle('Email').setValidation(FormApp.createTextValidation()
    .requireTextIsEmail()
    .build(),
  );
}

function createForm(nome: string, ano: string, semestre: string) {
  // Ordena as ênfases por curso e por nome após garantir que todas são válidas
  const enfases = getEnfases().filter(e => e[2].length > 0).sort((a, b) => a[0].localeCompare(b[0])).sort((a, b) => a[1].localeCompare(b[1]));

  // Remove cursos que não tem ênfases
  const cursos = getCursos().filter(c => enfases.some(e => e[1] === c)).sort((a, b) => a.localeCompare(b));

  const form = FormApp.create(`${nome} - ${ano}/${semestre}`);
  form.setShowLinkToRespondAgain(true);

  //Submissões para Certificados de Estudos Especiais
  form.setTitle(`${nome} - ${ano} - ${semestre}`);

  addBasicInfoToForm(form);

  // Cria a página que pergunta o curso
  let cursoQuestion = form.addMultipleChoiceItem().setTitle('Curso').setRequired(true);

  // Cria uma página para cada ênfase
  let enfasesPages = enfases.map(e => {
    const page = form.addPageBreakItem().setTitle(e[0] + ' - ' + e[1]).setGoToPage(FormApp.PageNavigationType.SUBMIT);

    const grupo1 = form.addCheckboxItem().setTitlacionadale('Disciplinas cursadas (Grupo 1)').setRequired(true).setValidation(FormApp.createCheckboxValidation()
      .requireSelectAtLeast(e[3] as number)
      .build(),
    );

    grupo1.setChoices([
      ...e[2].map((d: string) => grupo1.createChoice(d)),
    ]);

    if (e[4].length > 0) {
      const grupo2 = form.addCheckboxItem().setTitle('Disciplinas cursadas (Grupo 2)').setRequired(true).setValidation(FormApp.createCheckboxValidation()
        .requireSelectAtLeast(e[5] as number)
        .build(),
      );

      grupo2.setChoices([
        ...e[4].map((d: string) => grupo2.createChoice(d)),
      ]);
    }

    return page;
  })

  // Cria uma página para cada curso, perguntando sobre a ênfase e linka com 
  // as páginas das ênfases respectivas
  const cursoPages = cursos.map(c => {
    let page = form.addPageBreakItem().setTitle('Ênfases do curso de ' + c).setGoToPage(FormApp.PageNavigationType.SUBMIT);

    let cursoEnfases = enfases.filter(e => e[1] === c);
    
    let enfaseQuestion = form.addMultipleChoiceItem().setTitle('Certificado de Estudos Especiais').setRequired(true);

    enfaseQuestion.setChoices([
      ...cursoEnfases.map((e: any) => enfaseQuestion.createChoice(e[0], enfasesPages[enfases.indexOf(e)])),
    ]);

    return page;
  });

  // Linka a pergunta sobre o curso com as páginas de cada curso
  cursoQuestion.setChoices([
    ...cursos.map(c => cursoQuestion.createChoice(c, cursoPages[cursos.indexOf(c)])),
  ]);

  // É necessário criar o documento na root e depois movê-lo para a pasta
  const formFile = DriveApp.getFileById(form.getId());
  formFile.moveTo(formsFolder);
}