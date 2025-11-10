"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/components/users-data-table"
import { UserIcon, Mail, Loader2 } from "lucide-react"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (user: Omit<User, "id"> | User) => void
  isSaving?: boolean
}

export function UserDialog({ open, onOpenChange, user, onSave, isSaving }: UserDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
      })
    } else {
      setFormData({
        nombre: "",
        email: "",
      })
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      onSave({ ...formData, id: user.id })
    } else {
      onSave(formData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription className="text-pretty">
              {user ? "Actualiza la información del usuario." : "Completa el formulario para agregar un nuevo usuario."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2.5">
              <Label htmlFor="nombre" className="text-sm font-medium flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Nombre completo
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
                className="h-11"
                required
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan@example.com"
                className="h-11"
                required
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : user ? (
                "Guardar Cambios"
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
