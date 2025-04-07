
import { formatTime } from "@/utils/attendanceProcessor";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface DeclarationTextProps {
  employeeName: string;
  biNumber: string;
  companyName: string;
  month: string;
  year: string;
  attendanceRecords: {
    date: string;
    clockIn: string;
    clockOut: string;
    workTime: string;
    extraHours: string;
  }[];
  totalHours: number;
  extraHours: number;
  workingDays: number;
}

export function DeclarationText({
  employeeName,
  biNumber,
  companyName,
  month,
  year,
  attendanceRecords,
  totalHours,
  extraHours,
  workingDays
}: DeclarationTextProps) {
  return (
    <div className="border rounded-lg p-6 space-y-6 print:border-none print:p-0">
      <div className="text-center mb-4 space-y-4">
        <h2 className="text-xl font-bold">DECLARAÇÃO INDIVIDUAL DE ACEITAÇÃO DE LABORAÇÃO DE HORAS EXTRAS</h2>
        
        <p className="text-left whitespace-pre-line">
          Eu, {employeeName}, portador(a) do documento de identificação {biNumber} e funcionário(a) da empresa {companyName},
          venho por meio deste documento declarar o meu consentimento e aceitação para
          realizar horas extras de trabalho de acordo com as condições e termos
          estabelecidos pela legislação vigente e pela política interna da empresa.
        </p>
        <p className="text-left">
          Entendo que a necessidade de laborar horas extras pode surgir devido a
          circunstâncias excepcionais e/ou necessidades operacionais da empresa. Estou
          ciente de que serei compensado(a) adequadamente pelas horas extras
          trabalhadas de acordo com as regras e regulamentos aplicáveis.
        </p>
        <p className="text-left">
          A tabela a seguir detalha as horas extras a serem trabalhadas durante o
          mês de {month} de {year}:
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Work Time</TableHead>
            <TableHead>Extra Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record, idx) => (
            <TableRow key={idx}>
              <TableCell>{employeeName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.clockIn}</TableCell>
              <TableCell>{record.clockOut}</TableCell>
              <TableCell>{record.workTime}</TableCell>
              <TableCell>{record.extraHours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <tfoot className="border-t bg-muted/50 font-medium [&>tr]:last:border-b-0">
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Totals:</TableCell>
            <TableCell className="font-bold">{formatTime(totalHours)}</TableCell>
            <TableCell className="font-bold">{formatTime(extraHours)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Working Days:</TableCell>
            <TableCell colSpan={2} className="font-bold">{workingDays}</TableCell>
          </TableRow>
        </tfoot>
      </Table>
      
      <div className="pt-8 pb-8">
        <p className="text-left">
          Ao assinar este documento, confirmo que estou ciente das datas e horários específicos em que as horas extras serão executadas e concordo em cumpri-las conforme indicado na tabela acima.
        </p>
        
        <div className="mt-16">
          <p className="text-center border-t pt-4">Assinatura do Funcionário</p>
        </div>
        
        <div className="mt-16 text-right">
          <p>Data: {format(new Date(), 'dd/MM/yyyy')}</p>
        </div>
      </div>
    </div>
  );
}
