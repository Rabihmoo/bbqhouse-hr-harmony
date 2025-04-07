
import { format } from "date-fns";

// Function to generate declaration text
export const generateDeclarationText = (
  name: string, 
  biNumber: string, 
  company: string, 
  month: string,
  year: string
): string => {
  return `DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS

Eu, ${name}, portador(a) do documento de identificação ${biNumber} e funcionário(a) da empresa ${company},
venho por meio deste documento declarar o meu consentimento e aceitação para
realizar horas extras de trabalho de acordo com as condições e termos
estabelecidos pela legislação vigente e pela política interna da empresa.
Entendo que a necessidade de laborar horas extras pode surgir devido a
circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou
ciente de que serei compensado(a) adequadamente pelas horas extras
trabalhadas de acordo com as regras e regulamentos aplicáveis.
A tabela a seguir detalha as horas extras a serem trabalhadas durante o
mês de ${month} de ${year}:`;
};

// Function to generate signature text
export const generateSignatureText = (): string => {
  return `Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.

Assinatura do Funcionário: ______________________________         ${format(new Date(), 'dd/MM/yyyy')}`;
};
