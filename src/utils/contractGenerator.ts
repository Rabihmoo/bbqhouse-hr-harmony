
/**
 * Utility functions for generating and downloading contract documents
 */

/**
 * Creates a Word document XML string for the given contract data
 */
export const createWordDocument = (contract: any): string => {
  // Get the month name in Portuguese
  const getPortugueseMonth = (date: Date): string => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[date.getMonth()];
  };

  // Format the salary in Portuguese
  const formatSalaryInPortuguese = (salary: number): string => {
    return `${salary.toLocaleString('pt-PT')} Meticais`;
  };

  // Extract signature date components
  const signatureDate = new Date(contract.signatureDate);
  const day = signatureDate.getDate();
  const month = getPortugueseMonth(signatureDate);
  const year = signatureDate.getFullYear();

  // Get employee first and last names
  const nameParts = contract.employeeName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Format the contract text with proper XML for Word
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
  <w:body>
    <w:p><w:r><w:b><w:t>CONTRATO DE TRABALHO POR TEMPO INDETERMINADO</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>Entre:</w:t></w:r></w:p>
    <w:p><w:r><w:t>Entre ${contract.company || ""}., com sede na [Endereço da Empresa], com o numero de contribuinte [NUIT da Empresa], representada pelo senhor Youssef Chamas, neste acto designado por EMPREGADOR.</w:t></w:r></w:p>
    <w:p><w:r><w:t>e</w:t></w:r></w:p>
    <w:p><w:r><w:t>${firstName}, ${lastName}, portador de documento de identificação nº${contract.employeeInfo.biNumber || ""}, emitido aos ${contract.employeeInfo.biDetails?.issueDate || ""}, natural de [CITY], residente no bairro ${contract.employeeInfo.address || ""}, doravante designado de COLABORADOR.</w:t></w:r></w:p>
    <w:p><w:r><w:t>É celebrado o presente contrato individual de trabalho sem termo, que se rege pelas disposições legais aplicáveis, pelo regulamento de trabalho interno na empresa e ainda pelo disposto nas cláusulas seguintes:</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA PRIMEIRA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Funções)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O colaborador é admitido ao serviço da Empregador para desempenhar as funções inerentes à categoria profissional de ${contract.position || ""} e as funções afins ou funcionalmente ligadas a essa actividade sem prejuízo do eventual cumprimento de outras funções que lhe sejam cometidas por se revelarem determinantes para o funcionamento das actividades da empregador e couberem no âmbito razoável das funções genericamente atribuídas ao colaborador.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - O empregador pode, quando o interesse da empresa o exija, encarregar temporariamente o colaborador para desempenhar funções não compreendidas na actividade contratada, desde que tal não implique diminuição da retribuição.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - O colaborador obriga-se a cuidar dos materiais e equipamentos fornecidos pelo empregador, necessários à prestação dos serviços contratados, e a pedir com antecedência a substituição dos mesmos quando necessário.</w:t></w:r></w:p>
    <w:p><w:r><w:t>4 - No momento de término do presente contrato o colaborador compromete-se a devolver quaisquer bens móveis e imóveis pertencentes a empresa cedidos/entregues a si, a data de assinatura do presente instrumento, nas condições em que recebeu salvo a normal deterioração dos mesmos sob pena de lhe serem cobradas as devidas deteriorações irregulares.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA SEGUNDA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Remuneração)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O empregador compromete-se a pagar ao colaborador salário mensal ilíquida de ${formatSalaryInPortuguese(8900)} sujeita aos impostos e demais descontos legais.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - O empregador compromete-se também a reconhecer os esforços do trabalhador não só através de salários, mas também através da atribuição de subsídios de produtividade e desempenho, se o negocio assim o permitir, que serão subdivididos em:</w:t></w:r></w:p>
    <w:p><w:r><w:t>a) Transporte – ${contract.employeeInfo.transportAllowance || 0} MT</w:t></w:r></w:p>
    <w:p><w:r><w:t>b) Bónus de eficiência e produtividade no trabalho – ${contract.employeeInfo.bonus || 0} MT</w:t></w:r></w:p>
    <w:p><w:r><w:t>c) Pontualidade e assiduidade – ${contract.employeeInfo.accommodationAllowance || 0} MT</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 – O direito de bónus será proporcional ao desempenho do trabalhador.</w:t></w:r></w:p>
    <w:p><w:r><w:t>4 - A remuneração mensal referida no número 1 deverá ser paga até ao quinto dia útil de cada mês seguinte a que e devida a remuneração, na sede ou no escritório do empregador, por cheque bancário ou transferência bancária à ordem ao colaborador.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA TERCEIRA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Vigência)</w:t></w:r></w:p>
    <w:p><w:r><w:t>O empregador contrata o colaborador, por tempo indeterminado e tem o seu início desde ${contract.startDate || ""}.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA QUARTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Período probatório)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Considerando que o cargo desempenhado pelo colaborador é caracterizado por elevado grau de responsabilidade, o presente contrato fica sujeito a um período probatório de 180 (cento e oitenta) dias, período esse no decurso do qual, qualquer das partes poderá pôr livremente termo ao contrato, sem necessidade de aviso prévio nem de invocação de justa causa, não havendo lugar a qualquer indemnização nos termos da lei.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA QUINTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Local de trabalho)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O colaborador desempenhará as suas funções em um dos estabelecimentos, do empregador, em funcionamento ou em actividade, à data da celebração do presente contrato de trabalho e na área geográfica que lhe for determinada.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - Durante a vigência do presente contrato de trabalho é definido como local de trabalho predominante o estabelecimento sito na área geográfica da província e cidade de Maputo no geral.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - Para além do disposto nos números anteriores, o colaborador declara, desde já, que aceita ser transferido ou temporariamente deslocado para outro local de trabalho, sempre que tal se torne necessário ao exercício da actividade e o interesse da empresa o exija, sem custos adicionais a empresa desde que a dita mudança seja na região supra mencionada.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA SEXTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Período normal de trabalho e horário de trabalho)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 – O contrato terá um horário de trabalho normal, de acordo com a legislação vigente, podendo trabalhar fora das horas, em caso de necessidade, ou ainda em regime de turnos conforme o plano de actividades vigente na empresa do contratante.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - O colaborador obriga-se à prestação efectiva de trabalho no horário devidamente estabelecido na empresa e autorizado por entidade competente.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - O empregador pode alterar unilateralmente os horários de trabalho ou estabelecer horários em regimes especiais de adaptabilidade, nos termos definidos na lei do trabalho.</w:t></w:r></w:p>
    <w:p><w:r><w:t>4 - O colaborador obriga-se, ainda, a cumprir as normas internas em vigor, na empresa, relativas ao registo do horário de trabalho e registo biométrico de assiduidade.</w:t></w:r></w:p>
    <w:p><w:r><w:t>5 - Esta posição poderá estar sujeita ao regime de isenção de horário de trabalho previsto na lei.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA SÉTIMA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Exclusividade, pacto de não concorrência e não solicitação)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O colaborador obriga-se a não exercer ou coordenar, total ou parcialmente, por si ou por interposta pessoa ou entidade, actividade comercial ou similar que seja concorrente à do empregador, pois face à especial função que exerce tal acarretaria elevados prejuízos para o mesmo.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - Mais se obriga, compensado que será por formação e Know-How que lhe será ministrado ao longo do seu percurso profissional nesta empresa, a manter a obrigação descrita no número anterior até 2 anos após a cessação do vínculo laboral entre ambos.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - Concorda o segundo outorgante em prestar os presentes serviços aqui descritos e afins em total regime de exclusividade para o primeiro contraente.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA OITAVA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Confidencialidade e Know-How)</w:t></w:r></w:p>
    <w:p><w:r><w:t>O Colaborador obriga-se a não divulgar, durante o período de vigência do presente contrato de trabalho bem como após a sua cessação, quaisquer informações de natureza confidencial relativas à empregadora, designadamente informações referentes à sua organização, métodos de produção ou negócios, clientela, propriedade industrial e direitos de autor ou de que tenha conhecimento no decurso da sua actividade ao serviço do empregador.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA NONA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Responsabilidade Civil)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - São aplicadas as disposições do código civil, relativamente à responsabilidade por factos ilícitos, pelos actos ou omissões do colaborador, relacionados com o presente contrato.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - O colaborador assume desde já a total responsabilidade por seus erros e omissões no exercício das suas funções que causem prejuízo a empresa ou terceiros.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - O colaborador concorda em especial que os incumprimentos dos termos das cláusulas sétimas e oitavas são passíveis de responsabilidade cível e dever de indemnização a favor do empregador, computado em dez vezes o salário auferido a data do término do contrato pelo colaborador.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Formação Profissional)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O empregador poderá promover a realização de acções ou cursos de formação profissional, de elevado nível técnico, destinadas ao colaborador.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - Quanto ao previsto no número anterior, o colaborador, como contrapartida, obriga-se a permanecer ao serviço do empregador pelo período mínimo de 12 (doze) meses a contar do termo das acções ou formações profissionais que venha a beneficiar-se.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - Durante as acções ou formações profissionais referidos nos números anteriores, a retribuição do colaborador manter-se-á inalterada.</w:t></w:r></w:p>
    <w:p><w:r><w:t>4 - O colaborador poderá desonerar-se da sua obrigação de permanência em virtude do disposto nesta cláusula, mediante reembolso ao empregador das importâncias reais directas e indirectas por este despendidas com a acção, ou acções, de formação extraordinária, devendo, neste caso, ser apresentado ao colaborador um documento indicativo do valor das mesmas ou as referencias dos preços médios das formações equivalentes no mercado.</w:t></w:r></w:p>
    <w:p><w:r><w:t>5 - Este reembolso será pago até a data da partida física do colaborador.</w:t></w:r></w:p>
    <w:p><w:r><w:t>6 - As partes poderão acordar numa compensação calculada entre as somas devidas ao empregador referidas nos números anteriores e a eventual dívida (salários, proporcionais de férias e outros subsídios) do empregador resultante da cessação do presente contrato por iniciativa do colaborador.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-PRIMEIRA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Férias)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O colaborador tem direito a um período de férias remuneradas, nos termos do disposto na lei do trabalho.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - O colaborador tem a obrigação de cumprir com a formalidade de informar ao responsável de recursos humanos por escrito o período específico que pretende gozar férias ate ao último dia de Fevereiro de cada ano para efeitos de registo no plano de férias anual.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - O colaborador deverá também informar por escrito com 15 (quinze) dias de antecedência o seu chefe de departamento e a direcção de recursos humanos e superior hierárquico o início do seu gozo e férias, para feitos de coordenação dos serviços e tarefas dentro do seu departamento.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-SEGUNDA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Segurança, higiene e saúde no trabalho)</w:t></w:r></w:p>
    <w:p><w:r><w:t>A informação relativa à segurança, higiene e saúde no trabalho, conforme definida na lei do trabalho e regulamento e normas internas, é dever e direito do colaborador, nos termos da lei e inclui especial cuidado a ter com a integridade física e mental dos colegas, integridade dos equipamentos e infraestrutura do local de trabalho.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-TERCEIRA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Dever de informação)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - O Colaborador obriga-se, desde já, a informar, ao empregador, sobre aspectos relevantes para a prestação da actividade ou funções para que foi contratado, incluindo todas aquelas que sofram alteração durante a vigência do contrato de trabalho.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - Havendo qualquer alteração ao presente contrato, o empregador obriga-se a comunicar esse facto ao colaborador, por escrito, nos 30 (trinta) dias subsequentes à data em que a alteração produz efeitos, excepto quando as alterações resultarem da lei, do instrumento de regulamentação colectiva de trabalho aplicável ou do regulamento interno da empresa.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-QUARTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Aviso prévio para denúncia do contrato de trabalho)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - Pretendendo o colaborador denunciar o presente contrato de trabalho, fica obrigado a observar o prazo de aviso prévio e demais condições constantes na lei do trabalho.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - Fica também a passar por escrito aos seus colegas de departamento e/ou ao seu superior hierárquico as informações relevantes a normal continuidade dos trabalhos na empresa, sob pena de vir a ser responsabilizado civilmente por quaisquer danos que a omissão desta informação vier a causar directa ou indirectamente.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-QUINTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Segurança Social)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - Nos termos da legislação vigente, o colaborador ficará abrangido pelo regime geral da Segurança Social, que inclui a assistência hospitalar, médica e medicamentosa.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 - A responsabilidade pela remuneração em caso de ausência por motivos médicos, esta prevista no regulamento de segurança social em vigor.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA- SEXTA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Lacunas, dúvidas e regulamento interno)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Na integração das lacunas e resolução das dúvidas eventualmente emergentes do clausulado do presente contrato de trabalho sem termo, sua interpretação, integração ou execução, aplicar-se-ão as disposições vigentes no regulamento interno aprovado e desde já aceite na sua íntegra pelo colaborador, e supletivamente o regime jurídico do contrato de trabalho por tempo indeterminado e, toda a legislação adequada.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-SÉTIMA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Tribunal competente)</w:t></w:r></w:p>
    <w:p><w:r><w:t>Para a resolução de qualquer litígio emergente do presente contrato de trabalho, os contraentes atribuem competência exclusiva ao foro do tribunal de trabalho da cidade de Maputo, com expressa renúncia a qualquer outro.</w:t></w:r></w:p>
    
    <w:p><w:r><w:b><w:t>CLÁUSULA DÉCIMA-OITAVA</w:t></w:b></w:r></w:p>
    <w:p><w:r><w:t>(Notificações e comunicações)</w:t></w:r></w:p>
    <w:p><w:r><w:t>1 - As notificações e comunicações relacionadas com o presente contrato de trabalho ou com as obrigações nele assumidas, serão feitas por carta registada ou email com aviso de recepção.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2 – Qualquer alteração ao domicílio deverá ser comunicada à contraparte, por carta registada com aviso de recepção, nos 30 (trinta) dias posteriores à verificação da referida alteração, sob pena de não poder ser contra elas invocada.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3 - O presente contrato de trabalho é celebrado de boa-fé e a sua assinatura pressupõe a sua integral aceitação por ambas as partes.</w:t></w:r></w:p>
    
    <w:p><w:r><w:t>Maputo, aos ${day} dias do mês de ${month} do ano ${year}.</w:t></w:r></w:p>
    <w:p><w:r><w:t>Em dois exemplares de igual conteúdo e valor, ficando um exemplar na posse de cada um dos Contraentes.</w:t></w:r></w:p>
    <w:p><w:r><w:t>PELO EMPREGADOR</w:t></w:r></w:p>
    <w:p><w:r><w:t>_____________________________</w:t></w:r></w:p>
    <w:p><w:r><w:t>O COLABORADOR</w:t></w:r></w:p>
    <w:p><w:r><w:t>______________________________</w:t></w:r></w:p>
  </w:body>
</w:wordDocument>`;
};

/**
 * Downloads a contract as a Word document
 */
export const downloadContract = (contract: any) => {
  const wordXmlContent = createWordDocument(contract);
  
  // Create a blob with Word document MIME type
  const blob = new Blob([wordXmlContent], { type: 'application/vnd.ms-word' });
  
  // Extract first and last name for the filename
  const nameParts = contract.employeeName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join('_') || '';
  
  // Format the date for filename
  const formattedDate = contract.startDate.replace(/\//g, '-');
  
  // Create filename according to requested format
  const filename = `CONTRACT_${firstName}_${lastName}_${formattedDate}.doc`;
  
  // Create a link to download the blob
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
