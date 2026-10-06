@echo off
setlocal
set "JAVA_HOME=C:\Users\thirunavukkarasu\.jdks\ms-17.0.19"
set "MAVEN_HOME=C:\Users\thirunavukkarasu\.maven\maven-3.10.0-rc-1"
cd /d "e:\capstone project\backend"
echo ===== Baseline Compilation =====
call %MAVEN_HOME%\bin\mvn clean test-compile -q
if %ERRORLEVEL% NEQ 0 (
    echo Compilation FAILED
    exit /b 1
)
echo ===== Baseline Tests =====
call %MAVEN_HOME%\bin\mvn clean test -q
if %ERRORLEVEL% NEQ 0 (
    echo Tests FAILED
    exit /b 1
)
echo ===== Baseline Complete =====
endlocal
