@echo off
setlocal
set "JAVA_HOME=C:\Users\thirunavukkarasu\AppData\Roaming\Code\User\globalStorage\pleiades.java-extension-pack-jdk\java\21"
set "MAVEN_HOME=C:\Users\thirunavukkarasu\.maven\maven-3.10.0-rc-1"
cd /d "e:\capstone project\backend"
echo ===== Java 21 Compilation =====
call %MAVEN_HOME%\bin\mvn clean test-compile -q
if %ERRORLEVEL% NEQ 0 (
    echo Compilation FAILED
    exit /b 1
)
echo Compilation SUCCESS
echo ===== Java 21 Tests =====
call %MAVEN_HOME%\bin\mvn clean test -q
if %ERRORLEVEL% NEQ 0 (
    echo Tests FAILED
    exit /b 1
)
echo Tests SUCCESS
endlocal
