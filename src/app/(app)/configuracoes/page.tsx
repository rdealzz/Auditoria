import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usuarios } from "@/lib/mock-data";
import { META_CONFORMIDADE, ROTULO_PAPEL } from "@/lib/dominio";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Configurações"
        descricao="Parâmetros da organização, política da qualidade e controle de acesso."
        trilha={[{ label: "Início", href: "/painel" }, { label: "Configurações" }]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organização</CardTitle>
            <CardDescription>Dados exibidos no cabeçalho dos relatórios emitidos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="razao">Razão social</Label>
              <Input id="razao" defaultValue="Indústria Modelo S.A." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="norma">Norma de referência</Label>
              <Select id="norma" defaultValue="9001">
                <option value="9001">ISO 9001:2015 — Gestão da Qualidade</option>
                <option value="14001">ISO 14001:2015 — Gestão Ambiental</option>
                <option value="45001">ISO 45001:2018 — Saúde e Segurança</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meta">Meta de índice de conformidade (%)</Label>
              <Input id="meta" type="number" min={0} max={100} defaultValue={META_CONFORMIDADE} />
              <p className="text-xs text-muted-foreground">
                Auditorias abaixo da meta exigem plano de ação obrigatório.
              </p>
            </div>
            <Button size="sm">Salvar alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prazos padrão</CardTitle>
            <CardDescription>
              Prazos aplicados automaticamente ao registrar uma constatação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prazo-maior">NC maior — dias para tratamento</Label>
              <Input id="prazo-maior" type="number" defaultValue={30} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazo-menor">NC menor — dias para tratamento</Label>
              <Input id="prazo-menor" type="number" defaultValue={45} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prazo-obs">Observação — dias para tratamento</Label>
              <Input id="prazo-obs" type="number" defaultValue={60} />
            </div>
            <Button size="sm">Salvar alterações</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários e papéis</CardTitle>
          <CardDescription>
            O papel define o que cada pessoa enxerga e pode alterar no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Usuário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Papel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="pl-5">
                    <span className="flex items-center gap-2.5">
                      <Avatar nome={usuario.nome} cor={usuario.avatarCor} />
                      <span>
                        <span className="block text-sm font-medium">{usuario.nome}</span>
                        <span className="block text-xs text-muted-foreground">
                          {usuario.email}
                        </span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{usuario.cargo}</TableCell>
                  <TableCell>
                    <Badge tom={usuario.papel === "admin" ? "primary" : "neutro"}>
                      {ROTULO_PAPEL[usuario.papel]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
