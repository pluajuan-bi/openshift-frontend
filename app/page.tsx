import { UsersDataTable } from "@/components/users-data-table"
import { Users } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            {/* <h1 className="text-4xl font-bold tracking-tight text-balance">Gestión de Usuarios</h1> */}
          </div>
          {/* <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Administra tu base de datos de usuarios de forma simple y eficiente
          </p> */}
        </div>
        <div className="rounded-xl border bg-card shadow-sm">
          <UsersDataTable />
        </div>
      </div>
    </main>
  )
}
