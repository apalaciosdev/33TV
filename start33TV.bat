@echo off
setlocal enabledelayedexpansion

REM Inicializar las variables
set "ipCableada="
set "ipWifi="

REM Obtener la dirección IP de la tarjeta de red cableada
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set "ipCableada=%%a"
)

REM Si no se encontró la dirección IP de la tarjeta de red cableada, intentar obtener la de la tarjeta de red inalámbrica
if not defined ipCableada (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "Wireless LAN adapter"') do (
        set "ipWifi=%%a"
    )
)

REM Si ninguna dirección IP fue encontrada, salir sin hacer cambios
if not defined ipCableada if not defined ipWifi (
    echo No se encontró ninguna dirección IP.
    pause
    exit /b
)

REM Eliminar espacios en blanco al principio y al final de las direcciones IP
set "ipCableada=!ipCableada: =!"
set "ipWifi=!ipWifi: =!"

REM Crear o sobrescribir el archivo JSON con la información obtenida
echo { "ipCableada": "%ipCableada%", "ipWifi": "%ipWifi%" } > ipServer.json

echo Archivo ipServer.json actualizado con éxito.

REM Identificar y cerrar el proceso en el puerto 2022
echo Identificando y cerrando el proceso en el puerto 2022...
for /f "tokens=5" %%a in ('netstat -ano ^| find "2022"') do (
    echo Cerrando el proceso con PID %%a...
    taskkill /F /PID %%a
)

REM Identificar y cerrar el proceso en el puerto 4200
echo Identificando y cerrando el proceso en el puerto 4200...
for /f "tokens=5" %%a in ('netstat -ano ^| find "4200"') do (
    echo Cerrando el proceso con PID %%a...
    taskkill /F /PID %%a
)

REM Ir al directorio del backend y ejecutar la comprobación/npm install/start para el backend
cd backend
call :CheckNodeModules

REM Esperar unos segundos para dar tiempo al backend para iniciar
timeout /t 5

REM Ir al directorio del frontend y ejecutar la comprobación/npm install/start para el frontend
cd ../frontend
call :CheckNodeModules



REM Pausa para mantener la consola abierta
exit /b

REM Función para verificar la existencia del directorio node_modules
:CheckNodeModules
if not exist "node_modules" (
    echo No se encontró el directorio node_modules.
    echo Ejecutando npm install...
    npm install
    echo npm install completado.
    start npm run start
) else (
    echo node_modules encontrado, no es necesario ejecutar npm install.
    start npm run start
)
