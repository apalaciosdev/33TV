@echo off
setlocal enabledelayedexpansion

REM Configura la URL del repositorio
set "repoURL=https://github.com/apalaciosdev/33TV.git"

REM Comprobar si Git está instalado
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Git no está instalado. Por favor, instala Git y vuelve a ejecutar el script.
    pause
    exit /b
)

REM Comprobar si existe un repositorio Git en el directorio actual
if not exist ".git" (
    echo No se encontró un repositorio Git en este directorio. Inicializando un nuevo repositorio...
    git init
    git remote add origin %repoURL%
) else (
    echo Repositorio Git encontrado en este directorio.
)

REM Forzar la actualización del repositorio desde la URL remota, sobrescribiendo los cambios locales
echo Actualizando el repositorio desde %repoURL%...
git fetch --all
git reset --hard origin/main

REM Inicializar y actualizar los submódulos Git si los hay
git submodule init
git submodule update --recursive

REM Guardar los cambios locales
git add .
git commit -m "Actualización automática desde el repositorio remoto"

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
