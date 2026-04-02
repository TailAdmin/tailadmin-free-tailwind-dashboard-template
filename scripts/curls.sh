#!/usr/bin/env bash
set -euo pipefail

# Script de ejemplo con comandos curl proporcionados por el usuario.
# Reemplaza <TOKEN> y <id> según corresponda antes de ejecutar.

echo "Ejecutando requests curl (reemplaza <TOKEN> y <id> antes de usar)..."

echo "\n1) Iniciar sesión (obtener token)"
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "admin@example.com", "password": "admin123"}'

echo "\n\n# 2) Crear un Usuario con Rol SECONDARY_USER (reemplaza <TOKEN>)"
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Secundario",
    "correo": "secondary@example.com",
    "password": "password123",
    "role": "SECONDARY_USER",
    "telefono": "5551234567"
  }'

echo "\n\n# 3) Crear otro Usuario con Rol SUPER_USER"
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin Asistente",
    "correo": "asistente@example.com",
    "password": "password123",
    "role": "SUPER_USER",
    "telefono": "5559876543"
  }'

echo "\n\n4) Consultar todos los usuarios"
curl -G http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN>"

echo "\n\n5) Actualizar el Rol de un Usuario (reemplaza <id> y <TOKEN>)"
curl -X PATCH http://localhost:3000/api/users/<id> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "SUPER_USER"}'

echo "\n\n6) Prueba de Validación (Rol Inválido - Debe Fallar)"
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Intruso",
    "correo": "intruso@example.com",
    "password": "password123",
    "role": "GUEST"
  }'

echo "\nLista de curls ejecutada."
