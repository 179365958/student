@echo off
chcp 65001
title 学生管理系统启动器

:: 检查 SQL Server 状态
echo 正在检查 SQL Server 状态...
sc query MSSQLSERVER | find "RUNNING" >nul
if errorlevel 1 (
    echo SQL Server 未运行
    choice /C YN /M "是否启动 SQL Server"
    if errorlevel 2 goto :end
    if errorlevel 1 (
        echo 正在启动 SQL Server...
        net start MSSQLSERVER
        timeout /t 5
    )
) else (
    echo SQL Server 运行中
)

:: 启动后端服务
echo.
echo 正在启动后端服务...
start "后端服务" cmd /c "cd back && npm start"

:: 等待2秒
timeout /t 2 > nul

:: 启动前端服务
echo.
echo 正在启动前端服务...
start "前端服务" cmd /c "cd front && npm run dev"

:: 等待3秒
timeout /t 3 > nul

:: 打开浏览器
echo.
echo 正在打开浏览器...
start http://localhost:8080

echo.
echo 所有服务已启动:
echo - 前端: http://localhost:8080
echo - 后端: http://localhost:3000
echo.
echo 按任意键退出...
pause > nul

:end