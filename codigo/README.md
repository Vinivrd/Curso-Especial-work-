# Conteúdo
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Razões da Divisão](#razões-da-divisão)
- [Funcionamento Geral](#funcionamento-geral)
- [Comentários](#comentários)
  - [Sobre o `GerarPdf.js`](#sobre-o-gerarpdfjs)
  - [Sobre o Script de Validação](#sobre-o-script-de-validação)
  - [Sobre os modelos de CEE](#sobre-os-modelos-de-cee)
- [Contato](#contato)

## Estrutura do Projeto

Esse projeto foi particionado em múltiplos arquivos para facilitar o isolamento de funcionaldidades. Segue a descrição do propósito de cada arquivo:
- **css.html:** é responsável por conter as classes CSS do projeto.
- **index.html:** é o arquivo base onde a aplicação é enxertada. Não é muito alterado, é quase que só uma página vazia bem configurada.
- **js.html:** é onde todo o javascript do frontend está localizado.
- **Globals.ts:** é um arquivo de backend que lida com algumas funções e constantes globais. Ele é quase que uma configuração global do backend.
- **ProcessSubmit.ts:** é onde as funções responsáveis por lidarem com as chamadas de adição, atualização ou remoção de ênfases e cursos estão. Funcionam como se fossem APIs que se comunicam com as planilhas.
- **ShowApp.ts:** é responsável por montar a página, desde alterar o HTML até embutir os arquivos de CSS e Javascript. Após montar a página, ele a envia para o frontend.
- **UpdateForm.ts**: É responsável por gerar o formulário a partir dos cursos e ênfases registrados.
- **GerarPdf.js**: Esse arquivo está em Javascript ao invés de Typescript, pois era originalmente separado dessa pasta. Porém, para facilitar a organização, eu decidi incluí-lo aqui. Sua função é ler uma tabela com informações dos PDFs que deverá gerar e então gerá-los de acordo com o ano e semestre escolhidos.

Pode se notar também que esse projeto utilizou Typescript para o backend até então. Eu optei por utilizá-lo devido minha familiaridade com essa linguagem e a facilidade que ela traz.

Com o Clasp, o Typescript é convertido para Javascript e então enviado para os servidores do Google. Caso prefira Javascript, essa versão pode ser encontrada diretamente no [site do Google](https://script.google.com).

## Razões da Divisão
Quanto ao fronted, é mais simples lidar com o CSS e o Javascript separados do HTML, ainda mais considerando que o AppScript só tem dois tipos de arquivo: scripts (javascript backend) e HTML (frontend).

Isso fez necessário isolar as tags \<style\> e \<script\> em arquivos separados que depois são unificados pelo `ShowApp.ts`.

Já para o backend, eu decidi separar as funções de forma a melhorar a organização do proejeto. Todas esses arquivos agem como se fossem um, então essa separação é meramente organizacional, pois alguns deles tem mais de 100 linhas, o que tornaria um pesadelo tentar trabalhar em certas parte do app.

## Funcionamento Geral
Segue o fluxo de execução do sistema inteiro, incluindo funções que ainda não foram implementadas e também scripts ou ações externas:

1. Os cursos e seus certificados de estudos especiais (no código chamados de ênfases) devem ser registrados. Esse é um processo manual auxiliado pelo app.
2. O formulário deve ser gerado e distribuído para os alunos.
3. Os alunos devem registrar seus pedidos de certificados de estudos especiais.
4. Esses certificados serão analisados por um script na medida em que são submetidos. Isso deve ser feito a partir de um trigger do AppScript.
5. Os alunos aprovados são adicionados a uma planilha com todas as informações relevantes (nome, nusp, curso, CEE, displinas e suas notes, etc...). Será enviado um email automático confirmando que o pedido de CEE foi aprovado.
6. Os alunos não aprovados serão informados por email automático que o pedido falhou e a razão (não concluiu a disciplina, não teve créditos o bastante ou outras razões).
7. No app, aparecerão os pedidos de CEE que foram confirmados filtrados por ano/semestre e terá um botão que ativa o script que gerará os PDF dos CEEs de um dado ano/semestre e os armazenará em uma pasta gerada automaticamente no formato "{Ano} {Semestre} - {Data e Hora}".

## Comentários 
### Sobre o `GerarPdf.js`
É possível que o `GerarPdf.js` não esteja funcionando perfeitamente com o resto do projeto. Atualmente ele gerá os PDFs de todos os alunos registrados na planilha e não apenas os alunos de um dado ano/semestre. Acredito que a implementação desse filtro seja trivial.

### Sobre o Script de Validação
Os formulários não estão conectados com o script que válida os

Ainda não existe um script que verifica se o pedido de CEE de um aluno é realmente válido. Acredito que os seguintes passos devem ser uma boa base para tal script:
1. Um aluno preenche o formulário de CEE
2. Isso aciona o script que válida a submissão do aluno.
3. O script verifica se o número USP do aluno está correto e, se for possível, utiliza o nome registrado nos dados do jupiterweb.
4. O script verifica se o aluno realmente pertence ao curso informado.
5. O script verifica se dentre as matérias concluídas pelo aluno estão as que ele afirmou ter concluído.
6. Se alguma validação falhar, o script envia um email para o aluno informando a razão da falha e encerra.
7. O script recupera as notas dessas disciplinas e, se possível, seus nomes e os nomes de seus departamentos.
8. O script insere esses dados na planilha que gerá os PDFs.
9. O script envia um email para o aluno informando que a requisição de CEE dele foi aprovada.

### Sobre os modelos de CEE
Os modelos estão no formato Google Presentation. Isso se deve ao fato de o Google Docs não conseguir alterar o texto dentro de caixas de texto, mas o Google PResentation sim. Devido a esse inconveniente, eu converti os arquivo de Docs para Presentation.

Isso tem um único revés, a precisão do Google Presentation não é milimétrica, então pode haver algum corte nas bordas.

## Contato

Caso você tenha alguma dúvido sobre como o projeto funciona ou sobre as ferramentas utilizadas, você pode me contatar por email ou whatsapp:
- pedro.hvn@usp.br
- (16) 99629-1298