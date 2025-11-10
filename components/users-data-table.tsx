"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Hash,
  Loader2,
  WifiOff,
  RefreshCw,
} from "lucide-react"
import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserDialog } from "@/components/user-dialog"
import { DeleteUserDialog } from "@/components/delete-user-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type User = {
  id: string
  nombre: string
  email: string
}

const API_BASE_URL = "/api"

export function UsersDataTable() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/usuarios`)

      if (!response.ok) {
        setIsConnected(false)
        setData([])
        return
      }

      const users = await response.json()
      setData(users)
      setIsConnected(true)
    } catch (err) {
      console.error("[v0] Error fetching users:", err)
      setIsConnected(false)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    await fetchUsers()
    setIsRetrying(false)
  }

  const handleCreateUser = async (user: Omit<User, "id">) => {
    if (!isConnected) {
      alert("No hay conexión con el servidor. Por favor, verifica la conexión e intenta de nuevo.")
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error("Error al crear el usuario")
      }

      const newUser = await response.json()
      setData([...data, newUser])
    } catch (err) {
      console.error("[v0] Error creating user:", err)
      alert("Error al crear el usuario. Por favor intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditUser = async (updatedUser: User) => {
    if (!isConnected) {
      alert("No hay conexión con el servidor. Por favor, verifica la conexión e intenta de nuevo.")
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(`${API_BASE_URL}/usuarios/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario")
      }

      const updated = await response.json()
      setData(data.map((user) => (user.id === updated.id ? updated : user)))
    } catch (err) {
      console.error("[v0] Error updating user:", err)
      alert("Error al actualizar el usuario. Por favor intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!isConnected) {
      alert("No hay conexión con el servidor. Por favor, verifica la conexión e intenta de nuevo.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario")
      }

      setData(data.filter((user) => user.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting user:", err)
      alert("Error al eliminar el usuario. Por favor intenta de nuevo.")
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="lowercase">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={!isConnected}>
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsDialogOpen(true)
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsDeleteDialogOpen(true)
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-6">
      {!isConnected && (
        <Alert variant="destructive" className="mb-6">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Sin conexión al servidor</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>No se pudo conectar con el servidor. Verifica tu conexión y el estado del microservicio.</span>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              disabled={isRetrying}
              className="ml-4 gap-2 bg-transparent"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Reintentando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reintentar
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isConnected ? (
              <>
                Total de {data.length} usuario{data.length !== 1 ? "s" : ""}
              </>
            ) : (
              "Esperando conexión..."
            )}
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null)
            setIsDialogOpen(true)
          }}
          className="gap-2"
          disabled={!isConnected}
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    {isConnected ? (
                      <>
                        <Users className="h-8 w-8 opacity-40" />
                        <p>No se encontraron usuarios.</p>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-8 w-8 opacity-40" />
                        <p>Sin conexión al servidor</p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {data.length} usuario{data.length !== 1 ? "s" : ""}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSave={async (user) => {
          if (selectedUser) {
            await handleEditUser(user as User)
          } else {
            await handleCreateUser(user)
          }
          setIsDialogOpen(false)
        }}
        isSaving={isSaving}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userName={selectedUser?.nombre || ""}
        onConfirm={async () => {
          if (selectedUser) {
            await handleDeleteUser(selectedUser.id)
          }
          setIsDeleteDialogOpen(false)
        }}
      />
    </div>
  )
}
