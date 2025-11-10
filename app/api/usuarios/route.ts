import { NextResponse } from "next/server"

// URL del microservicio interno (solo accesible desde el servidor)
const MICROSERVICE_URL =
  process.env.MICROSERVICE_URL || "http://service-microservicio-2.pluaj-dev-dev.svc.cluster.local:8082"

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const response = await fetch(`${MICROSERVICE_URL}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
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
    console.error("[API] Error fetching users:", error)
    return NextResponse.json({ error: "Error al conectar con el servicio de usuarios" }, { status: 500 })
  }
}

// POST - Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${MICROSERVICE_URL}/usuarios`, {
      method: "POST",
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
    console.error("[API] Error creating user:", error)
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
  }
}