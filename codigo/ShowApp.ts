const url = "https://docs.google.com/spreadsheets/d/12gRuEgIVOPZhCpM8qFeGmLmJd-aPeBBgxP6iNRwZr38/edit#gid=1304623703";

// Cria e envia a página
function doGet() {
  let template = HtmlService.createTemplateFromFile('codigo/index');
 
  template.ui = showUI();

 
  return template.evaluate();
}

//TEST
function loadForm(){
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Cursos");
  var list =  ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),1).getValues();
  var tmp = HtmlService.createTemplateFromFile("codigo/html/");

  tmp.title = "Vinao";

  tmp.list_courses  = list.map((value) => value[0] );
  return  tmp.evaluate();
}



// Integra outros arquivos ao PP
function include(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Monta a UI
function showUI() {
  const cursos = getCursos();
  const enfases = getEnfases();

  const hasCursos = cursos.length > 0;
  const hasEnfases = enfases.length > 0;

  const opcoesCursos = cursos.map(c => `<option value='${c}'>${c}</option>`).join('');
  const opcoesEnfases = enfases.map(e => `<option value='${e[0]}-${e[1]}'>${e[0]} (${e[1]})</option>`).join('');


  return HtmlService.createHtmlOutput(`
    <div class="row">
      <div class="col s12">
        <ul class="primary tabs">
          <li class="tab col s3"><a href="#adicionar">Adicionar</a></li>
          <li class="tab col s3 ${hasCursos ? '' : 'disabled'}"><a href="#atualizar">Atualizar</a></li>
          <li class="tab col s3 ${hasCursos ? '' : 'disabled'}"><a href="#remover">Remover</a></li>
          <li class="tab col s3"><a href="#formulario">Formulário</a></li>
        </ul>

        <div id="adicionar" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1"><a href="#adicionar-curso">Adicionar Curso</a></li>
            <li class="tab col s5 ${hasCursos ? '' : 'disabled'}"><a href="#adicionar-enfase">Adicionar Certificado de Estudos Especiais</a></li>
          </ul>

          <div id="adicionar-curso" class="col s8 offset-s2">
            ${include('codigo/html/adicionarCursoForm.html')}
          </div>

          <div id="adicionar-enfase" class="col s8 offset-s2">
            ${include('codigo/html/adicionarEnfaseForm.html')}
          </div>
        </div>

        <div id="atualizar" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1" ${hasCursos ? '' : 'disabled'}><a href="#atualizar-curso">Atualizar Curso</a></li>
            <li class="tab col s5 ${hasEnfases ? '' : 'disabled'}"><a href="#atualizar-enfase">Atualizar Certificado de Estudos Especiais</a></li>
          </ul>

          <div id="atualizar-curso" class="col s8 offset-s2">
            ${include('codigo/html/atualizarCursoForm.html')}
          </div>

          <div id="atualizar-enfase" class="col s8 offset-s2">
            ${include('codigo/html/atualizarEnfaseForm.html')}
          </div>
        </div>

        <div id="remover" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1" ${hasCursos ? '' : 'disabled'}><a href="#remover-curso">Remover Curso</a></li>
            <li class="tab col s5 ${hasEnfases ? '' : 'disabled'}"><a href="#remover-enfase">Remover Certificado de Estudos Especiais</a></li>
          </ul>

          <div id="remover-curso" class="col s8 offset-s2">
            ${include('codigo/html/removerCursoForm.html')}
          </div>

          <div id="remover-enfase" class="col s8 offset-s2">
            ${include('codigo/html/removerEnfaseForm.html')}
          </div>
        </div>

        <div id="formulario" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1"><a href="#gerar-formulario">Gerar Formulário</a></li>
            <li class="tab col s5"><a href="#gerar-cee">Gerar Certificados de Estudos Especiais</a></li>
          </ul>

          <div id="gerar-formulario" class="col s8 offset-s2">
            ${include('codigo/html/gerarFormulario.html')}
          </div>

          <div id="gerar-cee" class="col s8 offset-s2">
            ${gerarCertificados()}
          </div>
        </div>
      </div>
    </div>
  `).getContent();
}

function gerarCertificados() {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Gerar Certificado de Estudos Especiais</h1>
    </div>
  `).getContent();
}


