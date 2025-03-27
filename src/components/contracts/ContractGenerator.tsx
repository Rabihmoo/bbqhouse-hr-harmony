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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const currentDate = new Date().toISOString().split("T")[0];
  
  const employee = employees.find(emp => emp.id === selectedEmployee);
  const employeeCompany = employee?.company || "BBQHouse LDA";
  const companyTemplate = companies.find(c => c.name === employeeCompany)?.contractTemplate || "";

  // Get company address and representative based on company
  const getCompanyDetails = (companyName: string) => {
    switch(companyName) {
      case "SALT LDA":
        return {
          displayName: "SALT RESTAURANT, LDA.",
          address: "Cidade de Maputo, na Avenida Marginal n.º1251, Distrito Kampfumo",
          representative: "Youssef Chamas"
        };
      case "BBQHouse LDA":
        return {
          displayName: "BBQ HOUSE",
          address: "Cidade de Maputo",
          representative: "Youssef Chamas"
        };
      case "Executive Cleaning LDA":
        return {
          displayName: "EXECUTIVE CLEANING",
          address: "Cidade de Maputo",
          representative: "Youssef Chamas"
        };
      default:
        return {
          displayName: "BBQ HOUSE",
          address: "Cidade de Maputo",
          representative: "Youssef Chamas"
        };
    }
  };

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
    
    // Simulate PDF download
    simulatePdfDownload();
  };
  
  const simulatePdfDownload = () => {
    // Create a temporary link element
    const downloadLink = document.createElement("a");
    
    // Set the filename for the download
    const filename = `${employee?.fullName.replace(/\s+/g, '_')}_contract_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    // In a real application, this would be a URL to the generated PDF
    // For this example, we'll just use a data URL to simulate a download
    downloadLink.href = "data:application/pdf;base64,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";
    
    // Set the "download" attribute with the filename
    downloadLink.setAttribute("download", filename);
    
    // Append to the body temporarily
    document.body.appendChild(downloadLink);
    
    // Trigger the download
    downloadLink.click();
    
    // Clean up by removing the link
    document.body.removeChild(downloadLink);
    
    // Show success message
    toast({
      title: "Contract generated",
      description: `Contract for ${employee?.fullName} has been downloaded as ${filename}`,
    });
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

  // Format money value to words (placeholder)
  const formatMoneyInWords = (amount: number) => {
    return `${amount} MT (Oito mil e novecentos meticais)`;
  };

  // Get company details based on employee's company
  const companyDetails = getCompanyDetails(employeeCompany);

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
            Generate & Download
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
              <DialogTitle>{companyDetails.displayName} Contract Preview</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-80px)] overflow-y-auto">
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
                    Entre {companyDetails.displayName}, com sede na {companyDetails.address}, representada pelo senhor {companyDetails.representative}, neste acto designado por EMPREGADOR.
                  </p>
                  
                  <p>
                    <strong>e</strong>
                  </p>
                  
                  <p>
                    {employee.fullName}, {employee.position}, portador de documento de identificação nº{employee.biNumber}, emitido aos {employee.biDetails?.issueDate || "N/A"}, natural de {"Maputo"}, residente no bairro {employee.address}, doravante designado de COLABORADOR.
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
                      1 - O colaborador é admitido ao serviço da Empregador para desempenhar as funções inerentes à categoria profissional de {employee.position} e as funções afins ou funcionalmente ligadas a essa actividade sem prejuízo do eventual cumprimento de outras funções que lhe sejam cometidas por se revelarem determinantes para o funcionamento das actividades da empregador e couberem no âmbito razoável das funções genericamente atribuídas ao colaborador.
                    </p>
                    <p>
                      2 - O empregador pode, quando o interesse da empresa o exija, encarregar temporariamente o colaborador para desempenhar funções não compreendidas na actividade contratada, desde que tal não implique diminuição da retribuição.
                    </p>
                    <p>
                      3 - O colaborador obriga-se a cuidar dos materiais e equipamentos fornecidos pelo empregador, necessários à prestação dos serviços contratados, e a pedir com antecedência a substituição dos mesmos quando necessário.
                    </p>
                    <p>
                      4 - No momento de término do presente contrato o colaborador compromete-se a devolver quaisquer bens móveis e imóveis pertencentes a empresa cedidos/entregues a si, a data de assinatura do presente instrumento, nas condições em que recebeu salvo a normal deterioração dos mesmos sob pena de lhe serem cobradas as devidas deteriorações irregulares.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SEGUNDA</h3>
                    <h4 className="font-medium mb-2">(Remuneração)</h4>
                    <p>
                      1 - O empregador compromete-se a pagar ao colaborador salário mensal ilíquida de 8.900,00Mt (Oito mil e novecentos meticais) sujeita aos impostos e demais descontos legais.
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
                      c) Pontualidade e assiduidade – {employee.salaryStructure?.accommodationAllowance || 0}
                    </p>
                    <p>
                      3 – O direito de bónus será proporcional ao desempenho do trabalhador.
                    </p>
                    <p>
                      4 - A remuneração mensal referida no número 1 deverá ser paga até ao quinto dia útil de cada mês seguinte a que e devida a remuneração, na sede ou no escritório do empregador, por cheque bancário ou transferência bancária à ordem ao colaborador.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA TERCEIRA</h3>
                    <h4 className="font-medium mb-2">(Vigência)</h4>
                    <p>
                      O empregador contrata o colaborador, por tempo indeterminado e tem o seu início desde {employee.hireDate || startDate || format(new Date(), 'yyyy-MM-dd')}.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA QUARTA</h3>
                    <h4 className="font-medium mb-2">(Período probatório)</h4>
                    <p>
                      Considerando que o cargo desempenhado pelo colaborador é caracterizado por elevado grau de responsabilidade, o presente contrato fica sujeito a um período probatório de 180 (cento e oitenta) dias, período esse no decurso do qual, qualquer das partes poderá pôr livremente termo ao contrato, sem necessidade de aviso prévio nem de invocação de justa causa, não havendo lugar a qualquer indemnização nos termos da lei.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA QUINTA</h3>
                    <h4 className="font-medium mb-2">(Local de trabalho)</h4>
                    <p>
                      1 - O colaborador desempenhará as suas funções em um dos estabelecimentos, do empregador, em funcionamento ou em actividade, à data da celebração do presente contrato de trabalho e na área geográfica que lhe for determinada.
                    </p>
                    <p>
                      2 - Durante a vigência do presente contrato de trabalho é definido como local de trabalho predominante o estabelecimento sito na área geográfica da província e cidade de Maputo no geral.
                    </p>
                    <p>
                      3 - Para além do disposto nos números anteriores, o colaborador declara, desde já, que aceita ser transferido ou temporariamente deslocado para outro local de trabalho, sempre que tal se torne necessário ao exercício da actividade e o interesse da empresa o exija, sem custos adicionais a empresa desde que a dita mudança seja na região supra mencionada.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SEXTA</h3>
                    <h4 className="font-medium mb-2">(Período normal de trabalho e horário de trabalho)</h4>
                    <p>
                      1 – O contrato terá um horário de trabalho normal, de acordo com a legislação vigente, podendo trabalhar fora das horas, em caso de necessidade, ou ainda em regime de turnos conforme o plano de actividades vigente na empresa do contratante.
                    </p>
                    <p>
                      2 - O colaborador obriga-se à prestação efectiva de trabalho no horário devidamente estabelecido na empresa e autorizado por entidade competente.
                    </p>
                    <p>
                      3 - O empregador pode alterar unilateralmente os horários de trabalho ou estabelecer horários em regimes especiais de adaptabilidade, nos termos definidos na lei do trabalho.
                    </p>
                    <p>
                      4 - O colaborador obriga-se, ainda, a cumprir as normas internas em vigor, na empresa, relativas ao registo do horário de trabalho e registo biométrico de assiduidade.
                    </p>
                    <p>
                      5 - Esta posição poderá estar sujeita ao regime de isenção de horário de trabalho previsto na lei.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">CLÁUSULA SÉTIMA</h3>
                    <h4 className="font-medium mb-2">(Exclusividade, pacto de não concorrência e não solicitação)</h4>
                    <p>
                      1 - O colaborador obriga-se a não exercer ou coordenar, total ou parcialmente, por si ou por interposta pessoa ou entidade, actividade comercial ou similar que seja concorrente à do empregador, pois face à especial função que exerce tal acarretaria elevados prejuízos para o mesmo.
                    </p>
                    <p>
                      2 - Mais se obriga, compensado que será por formação e Know-How que lhe será ministrado ao longo do seu percurso profissional nesta empresa, a manter a obrigação descrita no número anterior até 2 anos após a cessação do vínculo laboral entre ambos.
                    </p>
                    <p>
                      3 - Concorda o segundo outorgante em prestar os presentes serviços aqui descritos e afins em total regime de exclusividade para o primeiro contraente.
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
                        <p className="mb-10">PELO EMPREGADOR</p>
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
