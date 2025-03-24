
import { useState, useEffect } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { employees, companies } from "@/lib/data";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContractGeneratorProps {
  onGenerate: (data: any) => void;
}

const ContractGenerator = ({ onGenerate }: ContractGeneratorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [contractType, setContractType] = useState("standard");
  const [duration, setDuration] = useState("6");
  const [startDate, setStartDate] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [contractDate, setContractDate] = useState<Date | undefined>(new Date());

  const currentDate = new Date().toISOString().split("T")[0];
  
  const employee = employees.find(emp => emp.id === selectedEmployee);
  const employeeCompany = employee?.company || "BBQHouse LDA";
  const companyTemplate = companies.find(c => c.name === employeeCompany)?.contractTemplate || "";

  const handleGenerateContract = () => {
    const contractData = {
      employeeId: selectedEmployee,
      employeeName: employee?.fullName,
      contractType,
      duration: Number(duration),
      startDate: startDate || currentDate,
      company: employeeCompany,
      companyTemplate,
      contractDate: contractDate || new Date(),
      salaryStructure: employee?.salaryStructure
    };
    
    onGenerate(contractData);
  };

  // When the employee changes, check their company
  useEffect(() => {
    if (selectedEmployee) {
      const emp = employees.find(e => e.id === selectedEmployee);
      if (emp && emp.company) {
        // Contract is now based on the employee's company
      }
    }
  }, [selectedEmployee]);

  const formatMoneyInWords = (amount: number) => {
    // This is a placeholder - in production you would use a proper library 
    // or a more comprehensive function to convert numbers to Portuguese words
    return `${amount} KZ (valor por extenso)`;
  };

  return (
    <div className="bg-white dark:bg-black/40 rounded-xl shadow-sm overflow-hidden glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-bbqred p-2 rounded-lg text-white">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Contract Generator</h2>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="employee">Select Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Choose an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.fullName} - {employee.department} - {employee.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployee && (
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-sm font-medium">Using contract template for: <span className="text-primary">{employeeCompany}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Template file: {companyTemplate}</p>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger id="contractType">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Contract</SelectItem>
              <SelectItem value="temporary">Temporary Contract</SelectItem>
              <SelectItem value="parttime">Part-Time Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (Months)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
              <SelectItem value="36">36 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={currentDate}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contractDate">Contract Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="contractDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !contractDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {contractDate ? format(contractDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2">
                <Input
                  type="date"
                  value={contractDate ? format(contractDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setContractDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-3 mt-4">
          <Button 
            className="w-full" 
            disabled={!selectedEmployee} 
            onClick={handleGenerateContract}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={!selectedEmployee}
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {employee && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] glass">
            <DialogHeader>
              <DialogTitle>{employeeCompany} Contract Preview</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-80px)]">
              <div className="p-6 border rounded-lg bg-card text-card-foreground">
                <div className="flex justify-center mb-8">
                  <img 
                    src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" 
                    alt={`${employeeCompany} Logo`} 
                    className="w-40 h-40 object-contain" 
                  />
                </div>
                
                <h2 className="text-center text-2xl font-bold mb-8 uppercase">
                  CONTRATO DE TRABALHO POR TEMPO INDETERMINADO
                </h2>
                
                <div className="space-y-6 text-base">
                  <p>
                    <strong>Entre:</strong>
                  </p>
                  
                  <p>
                    Entre {employeeCompany}, firma em nome colectivo, com sede na Cidade de Maputo cujo objecto principal consiste em restauração, representada no acto pelo sócio Sr. Youssef Chamas, de nacionalidade Libanesa com poderes para tal, doravante designado de EMPREGADOR.
                  </p>
                  
                  <p>
                    <strong>e</strong>
                  </p>
                  
                  <p>
                    {employee.fullName}, portador de documento de identificação nº{employee.biNumber}, emitido aos {employee.biDetails?.issueDate || "N/A"}, natural de {"Maputo"}, residente no bairro {employee.address}, doravante designado de COLABORADOR.
                  </p>
                  
                  <div>
                    <p>
                      É celebrado o presente contrato individual de trabalho sem termo, que se rege pelas disposições legais aplicáveis, pelo regulamento de trabalho interno na empresa e ainda pelo disposto nas cláusulas seguintes:
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA PRIMEIRA</h3>
                    <h4 className="font-medium mb-2">(Funções)</h4>
                    <p>
                      1 - O colaborador é admitido ao serviço da Empregador para desempenhar as funções inerentes à categoria profissional de {employee.department} e as funções afins ou funcionalmente ligadas a essa actividade sem prejuízo do eventual cumprimento de outras funções que lhe sejam cometidas por se revelarem determinantes para o funcionamento das actividades da empregador e couberem no âmbito razoável das funções genericamente atribuídas ao colaborador.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SEGUNDA</h3>
                    <h4 className="font-medium mb-2">(Remuneração)</h4>
                    <p>
                      1 - O empregador compromete-se a pagar ao colaborador salário mensal ilíquido de {employee.salaryStructure?.basicSalary || 0} ({formatMoneyInWords(employee.salaryStructure?.basicSalary || 0)}) sujeita aos impostos e demais descontos legais.
                    </p>
                    <p>
                      2 - O empregador compromete-se também a reconhecer os esforços do trabalhador não só através de salários, mas também através da atribuição de subsídios de produtividade e desempenho, se o negocio assim o permitir, que serão subdivididos em:
                    </p>
                    <p className="pl-4">
                      a) Transporte – {employee.salaryStructure?.transportAllowance || 0}
                    </p>
                    <p className="pl-4">
                      b) Bónus de eficiência e produtividade no trabalho – {employee.salaryStructure?.bonus || 0}
                    </p>
                    <p className="pl-4">
                      c) Alojamento – {employee.salaryStructure?.accommodationAllowance || 0}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA TERCEIRA</h3>
                    <h4 className="font-medium mb-2">(Vigência)</h4>
                    <p>
                      O empregador contrata o colaborador, por tempo indeterminado e tem o seu início desde {employee.hireDate}.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA QUARTA</h3>
                    <h4 className="font-medium mb-2">(Local de Trabalho)</h4>
                    <p>
                      O local de trabalho do colaborador será na sede da Empresa sita na Cidade de Maputo, sem prejuízo de eventuais deslocações temporárias que tenham de ser efectuadas, por necessidade do serviço.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA QUINTA</h3>
                    <h4 className="font-medium mb-2">(Período de Funcionamento e Horário)</h4>
                    <p>
                      1 – O período normal de trabalho é de 48 (quarenta e oito) horas semanais, distribuídas de Segunda-Feira a Sábado.
                    </p>
                    <p>
                      2 – O horário de trabalho poderá ser alterado pela empregadora sempre que razões ponderosas e atendíveis de funcionamento o exijam, dentro do legalmente permitido.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SEXTA</h3>
                    <h4 className="font-medium mb-2">(Férias e Subsídio)</h4>
                    <p>
                      1 – O trabalhador tem direito a gozar férias nos termos da lei.
                    </p>
                    <p>
                      2 – O direito a férias adquire-se com a celebração do contrato de trabalho, vencendo-se no dia 1 de janeiro de cada ano civil.
                    </p>
                    <p>
                      3 – O período de férias para o trabalhador que exerça funções por um período igual a um ano e não superior a dois anos, é de 12 dias úteis consecutivos e para o trabalhador que exerça funções por um período superior a dois anos, é de 30 dias consecutivos.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SÉTIMA</h3>
                    <h4 className="font-medium mb-2">(Legislação Aplicável)</h4>
                    <p>
                      A legislação aplicável ao presente contrato de trabalho, nomeadamente em relação a férias, faltas, período experimental, cessação da relação laboral, regalias sociais e segurança social é a Lei do trabalho em vigor e demais legislação complementar.
                    </p>
                  </div>
                  
                  <div className="pt-8">
                    <p className="mb-4">
                      Maputo, aos {contractDate ? format(contractDate, 'dd') : ""} dias do mês de {contractDate ? format(contractDate, 'MMMM') : ""} do ano {contractDate ? format(contractDate, 'yyyy') : ""}.
                    </p>
                    <p className="mb-4">
                      Em dois exemplares de igual conteúdo e valor, ficando um exemplar na posse de cada um dos Contraentes.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 mt-8">
                      <div>
                        <p className="mb-10">PELO EMPREGADOR:</p>
                        <div className="border-t border-black w-full"></div>
                      </div>
                      
                      <div>
                        <p className="mb-10">O COLABORADOR:</p>
                        <div className="border-t border-black w-full"></div>
                        <p className="mt-2">{employee.fullName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContractGenerator;
