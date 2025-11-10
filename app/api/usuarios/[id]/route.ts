import { NextResponse } from "next/server"

const MICROSERVICE_URL =
  process.env.MICROSERVICE_URL || "http://service-microservicio-2.pluaj-dev-dev.svc.cluster.local:8082"

// PUT - Actualizar un usuario
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params
    console.log("Updating user with ID:", id)
    console.log("MICROSERVICE_URL:", MICROSERVICE_URL)
    const response = await fetch(`${MICROSERVICE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error del microservicio: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error updating user:", error)
    return NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 })
  }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("Deleting user with ID:", id)
    console.log("MICROSERVICE_URL:", MICROSERVICE_URL)
    console.log("Full DELETE URL:", `${MICROSERVICE_URL}/usuarios/${id}`)

    const response = await fetch(`${MICROSERVICE_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("DELETE Response status:", response.status)
    console.log("DELETE Response statusText:", response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DELETE Error response:", errorText)
      return NextResponse.json(
        { error: `Error del microservicio: ${response.statusText}`, details: errorText },
        { status: response.status },
      )
    }

    // Algunos APIs retornan 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    // Si es 200, puede ser JSON o texto plano
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      // Respuesta de texto plano (como "Usuario eliminado con éxito")
      const text = await response.text()
      return NextResponse.json({ message: text })
    }
  } catch (error) {
    console.error("[API] Error deleting user:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    return NextResponse.json({ error: "Error al eliminar el usuario", details: errorMessage }, { status: 500 })
  }
}