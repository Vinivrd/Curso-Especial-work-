// Cria e envia a página
function doGet() {
  let template = HtmlService.createTemplateFromFile('codigo/index');
  template.ui = showUI();

  return template.evaluate();
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
            ${adicionarCursoForm()}
          </div>

          <div id="adicionar-enfase" class="col s8 offset-s2">
            ${adicionarEnfaseForm(opcoesCursos)}
          </div>
        </div>

        <div id="atualizar" class="col s12">
        
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1" ${hasCursos ? '' : 'disabled'}><a href="#atualizar-curso">Atualizar Curso</a></li>
            <li class="tab col s5 ${hasEnfases ? '' : 'disabled'}"><a href="#atualizar-enfase">Atualizar Certificado de Estudos Especiais</a></li>
          </ul>

          <div id="atualizar-curso" class="col s8 offset-s2">
            ${atualizarCursoForm(opcoesCursos)}
          </div>

          <div id="atualizar-enfase" class="col s8 offset-s2">
            ${atualizarEnfaseForm(opcoesEnfases, opcoesCursos)}
          </div>
        </div>

        <div id="remover" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1" ${hasCursos ? '' : 'disabled'}><a href="#remover-curso">Remover Curso</a></li>
            <li class="tab col s5 ${hasEnfases ? '' : 'disabled'}"><a href="#remover-enfase">Remover Certificado de Estudos Especiais</a></li>
          </ul>

          <div id="remover-curso" class="col s8 offset-s2">
            ${removerCursoForm(opcoesCursos)}
          </div>

          <div id="remover-enfase" class="col s8 offset-s2">
            ${removerEnfaseForm(opcoesEnfases)}
          </div>
        </div>

        <div id="formulario" class="col s12">
          <ul class="secondary tabs">
            <li class="tab col s5 offset-s1"><a href="#gerar-formulario">Gerar Formulário</a></li>
            <li class="tab col s5"><a href="#gerar-cee">Gerar Certificados de Estudos Especiais</a></li>
          </ul>

          <div id="gerar-formulario" class="col s8 offset-s2">
            ${gerarFormulario()}
          </div>

          <div id="gerar-cee" class="col s8 offset-s2">
            ${gerarCertificados()}
          </div>
        </div>
      </div>
    </div>
  `).getContent();
}

function adicionarCursoForm() {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Adicionar curso</h1>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input id='adicionar-curso-nome' type='text' class='validate' placeholder='Nome do Curso'>
        <label for='adicionar-curso-nome'>Nome do Curso</label>
      </div>
    </div>

    <div class="row">
      <button id="adicionar-curso-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>
  `).getContent();
}

function adicionarEnfaseForm(opcoesCursos: string) {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Adicionar Certificado de Estudos Especiais</h1>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input id='adicionar-enfase-nome' type='text' class='validate' placeholder='Nome do Certificado de Estudos Especiais'>
        <label for='adicionar-enfase-nome'>Nome do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <select id="adicionar-enfase-curso">
          <option value="" disabled selected>Escolha um curso</option>
          ${opcoesCursos}
        </select>
        <label>Curso do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="col s5">
        <div class="row">
          <ul class="collection with-header" id="adicionar-enfase-grupo1">
            <li class="collection-header"><h4>Disciplinas do Grupo 1</h4></li>
          </ul>
          <div class="valign-wrapper">
            <div class='input-field col s12'>
              <input id='adicionar-enfase-disciplina-grupo1' type='text' class='validate'>
              <label for='adicionar-enfase-disciplina-grupo1'>Nome da Disciplina</label>
            </div>
            <button id="adicionar-enfase-adicionar-disciplina-grupo1" class="secondary-content"><i class="material-icons">add</i></button>
          </div>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input id='adicionar-enfase-min-disciplinas-g1' type='number' class='validate' value='0' min='0'>
            <label for='adicionar-enfase-min-disciplinas-g1'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>

      <div class="col s5 offset-s1">
        <div class="row">
          <ul class="collection with-header" id="adicionar-enfase-grupo2">
            <li class="collection-header"><h4>Disciplinas do Grupo 2</h4></li>
          </ul>
          <div class="valign-wrapper">
            <div class='input-field col s12'>
              <input id='adicionar-enfase-disciplina-grupo2' type='text' class='validate'>
              <label for='adicionar-enfase-disciplina-grupo2'>Nome da Disciplina</label>
            </div>
            <button id="adicionar-enfase-adicionar-disciplina-grupo2" class="secondary-content"><i class="material-icons">add</i></button>
          </div>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input id='adicionar-enfase-min-disciplinas-g2' type='number' class='validate' value='0' min='0'>
            <label for='adicionar-enfase-min-disciplinas-g2'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class='input-field col s2'>
        <input id='adicionar-enfase-min-creditos' type='number' class='validate' value='0' min='0'>
        <label for='adicionar-enfase-min-creditos'>Mínimo de cŕeditos aula</label>
      </div>
    </div>

    <div class="row">
      <button id="adicionar-enfase-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>
  `).getContent();
}

function atualizarCursoForm(opcoesCursos: string) {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Atualizar curso</h1>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <select id="atualizar-curso-select">
          <option value="" disabled selected>Escolha um curso</option>
          ${opcoesCursos}
        </select>
        <label>Curso</label>
      </div>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input id='atualizar-curso-nome' type='text' class='validate' placeholder='Nome do Curso'>
        <label for='atualizar-curso-nome'>Nome do Curso</label>
      </div>
    </div>

    <div class="row">
      <button id="atualizar-curso-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>
  `).getContent();
}

function atualizarEnfaseForm(opcoesEnfases: string, opcoesCursos: string) {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Atualizar Certificado de Estudos Especiais</h1>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <select id="atualizar-enfase-select">
          <option value="" disabled selected>Escolha um Certificado de Estudos Especiais</option>
          ${opcoesEnfases}
        </select>
        <label>Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input id='atualizar-enfase-nome' type='text' class='validate' placeholder='Nome do Certificado de Estudos Especiais'>
        <label for='atualizar-enfase-nome'>Nome do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <select id="atualizar-enfase-curso">
          <option value="" disabled selected>Escolha um curso</option>
          ${opcoesCursos}
        </select>
        <label>Curso do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="col s5">
        <div class="row">
          <ul class="collection with-header" id="atualizar-enfase-grupo1">
            <li class="collection-header"><h4>Disciplinas do Grupo 1</h4></li>
          </ul>
          <div class="valign-wrapper">
            <div class='input-field col s12'>
              <input id='atualizar-enfase-disciplina-grupo1' type='text' class='validate'>
              <label for='atualizar-enfase-disciplina-grupo1'>Nome da Disciplina</label>
            </div>
            <button id="atualizar-enfase-atualizar-disciplina-grupo1" class="secondary-content"><i class="material-icons">add</i></button>
          </div>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input id='atualizar-enfase-min-disciplinas-g1' type='number' class='validate' value='0' min='0'>
            <label for='atualizar-enfase-min-disciplinas-g1'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>
      

      <div class="col s5 offset-s1">
        <div class="row">
          <ul class="collection with-header" id="atualizar-enfase-grupo2">
            <li class="collection-header"><h4>Disciplinas do Grupo 2</h4></li>
          </ul>
          <div class="valign-wrapper">
            <div class='input-field col s12'>
              <input id='atualizar-enfase-disciplina-grupo2' type='text' class='validate'>
              <label for='atualizar-enfase-disciplina-grupo2'>Nome da Disciplina</label>
            </div>
            <button id="atualizar-enfase-atualizar-disciplina-grupo2" class="secondary-content"><i class="material-icons">add</i></button>
          </div>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input id='atualizar-enfase-min-disciplinas-g2' type='number' class='validate' value='0' min='0'>
            <label for='atualizar-enfase-min-disciplinas-g2'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class='input-field col s2'>
        <input id='atualizar-enfase-min-creditos' type='number' class='validate' value='0' min='0'>
        <label for='atualizar-enfase-min-creditos'>Mínimo de cŕeditos aula</label>
      </div>
    </div>

    <div class="row">
      <button id="atualizar-enfase-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>
  `).getContent();
}

function removerCursoForm(opcoesCursos: string) {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Remover curso</h1>
    </div>
    
    <div class="row">
      <div class="input-field col s5">
        <select id="remover-curso-select">
          <option value="" disabled selected>Escolha um curso</option>
          ${opcoesCursos}
        </select>
        <label>Curso</label>
      </div>
    </div>

    <div class="row">
      <button id="remover-curso-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>
  `).getContent();
}

function removerEnfaseForm(opcoesEnfases: string) {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Remover Certificado de Estudos Especiais</h1>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <select id="remover-enfase-select">
          <option value="" disabled selected>Escolha um Certificado de Estudos Especiais</option>
          ${opcoesEnfases}
        </select>
        <label>Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <button id="remover-enfase-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
    </div>

    <div class="row">
      <h3>Dados do Certificado de Estudos Especiais</h3>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input disabled id='remover-enfase-nome' type='text' class='validate' placeholder='Nome do Certificado de Estudos Especiais'>
        <label for='remover-enfase-nome'>Nome do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field col s5">
        <input disabled id='remover-enfase-curso' type='text' placeholder='Curso do Certificado de Estudos Especiais'>
        <label for='remover-enfase-curso'>Curso do Certificado de Estudos Especiais</label>
      </div>
    </div>

    <div class="row">
      <div class="col s5">
        <div class="row">
          <ul class="collection with-header" id="remover-enfase-grupo1">
            <li class="collection-header"><h4>Disciplinas do Grupo 1</h4></li>
          </ul>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input disabled id='remover-enfase-min-disciplinas-g1' type='number' class='validate' value='0' min='0'>
            <label for='remover-enfase-min-disciplinas-g1'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>

      <div class="col s5 offset-s1">
        <div class="row">
          <ul class="collection with-header" id="remover-enfase-grupo2">
            <li class="collection-header"><h4>Disciplinas do Grupo 2</h4></li>
          </ul>
        </div>

        <div class="row">
          <div class='input-field col s5'>
            <input disabled id='remover-enfase-min-disciplinas-g2' type='number' class='validate' value='0' min='0'>
            <label for='remover-enfase-min-disciplinas-g2'>Mínimo de Disciplinas</label>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class='input-field col s2'>
        <input disabled id='remover-enfase-min-creditos' type='number' class='validate' value='0' min='0'>
        <label for='remover-enfase-min-creditos'>Mínimo de cŕeditos aula</label>
      </div>
    </div>
  `).getContent();
}

function gerarFormulario() {
  return HtmlService.createHtmlOutput(`
    <div class="row">
      <h1>Gerar Formulário</h1>
    </div>

    <div class="row">
      <div class='input-field col s6'>
        <input id='formulario-nome' type='text' class='validate' placeholder='Nome do Formulário'>
        <label for='formulario-nome'>Nome do Curso</label>
      </div>
    </div>

    <div class="row valign-wrapper">
      <div class='input-field col s1' style='margin-left: 0px;'>
        <input id='formulario-ano' type='number' class='validate' min='2020' value='${new Date().getFullYear()}'>
        <label for='formulario-ano'>Ano</label>
      </div>

      <label>
        <input class="with-gap" name="formulario-semestre" type="radio" value="1" checked />
        <span>Semestre 1</span>
      </label>
      <label>
        <input class="with-gap" name="formulario-semestre" type="radio" value="2" />
        <span>Semestre 2</span>
      </label>
    </div>

    <div class="row">
      <button id="formulario-submit" class="btn waves-effect waves-light" type="submit" name="action">
        Submit <i class="material-icons right">send</i>
      </button>
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