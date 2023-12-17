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

REM Obtener la primera dirección IPv4
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"  REM Remove leading spaces
    set "ipCableadaModified=!ip!"
    goto :WriteJSON
)

:WriteJSON
REM Crear o sobrescribir el archivo JSON con la información obtenida
echo { "ipCableada": "%ipCableadaModified%", "ipWifi": "%ipWifi%" } > ipServer.json
echo Archivo ipServer.json actualizado con éxito.

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
