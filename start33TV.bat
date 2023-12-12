@echo off
setlocal enabledelayedexpansion

REM Inicializar las variables
set "ipCableada="
set "ipWifi="

REM Obtener la dirección IP de las tarjetas de red cableada
for /f "tokens=1,* delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=!ipCableada!"
    set "ipCableada=%%b"
    
    REM Eliminar espacios en blanco al principio y al final de las direcciones IP
    set "ip=!ip: =!"
    
    REM Verificar si la IP de la interfaz actual comienza con "192.168"
    set "ipStart=!ip:~0,7!"
    if "!ipStart!"=="192.168" (
        set "ipCableadaValid=!ip!"
    ) else (
        set "ipCableadaValid="
    )
    
    if defined ipCableadaValid (
        REM Salir del bucle si se encontró una interfaz válida
        goto :CheckWifi
    )
)

:CheckWifi

REM Obtener la dirección IP de las tarjetas de red inalámbrica (wifi)
set "ipWifi="
for /f "tokens=2 delims=:" %%a in ('netsh interface ip show addresses ^| findstr /i "Dirección IP"') do (
    set "ip=%%a"
    
    REM Eliminar espacios en blanco al principio y al final de las direcciones IP
    set "ip=!ip: =!"
    
    REM Verificar si la IP de la interfaz wifi comienza con "192.168"
    set "ipStart=!ip:~0,7!"
    if "!ipStart!"=="192.168" (
        set "ipWifi=!ip!"
        goto :WriteJSON
    )
)

:WriteJSON

REM Crear o sobrescribir el archivo JSON con la información obtenida
echo { "ipCableada": "%ipCableadaValid%", "ipWifi": "%ipWifi%" } > ipServer.json
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

REM Esperar 10 segundos antes de abrir la pestaña del navegador
timeout /t 10

REM Abrir la pestaña del navegador con la URL del frontend
start http://localhost:4200

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
 