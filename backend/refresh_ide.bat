@echo off
setlocal
set "JAVA_HOME=C:\Users\thirunavukkarasu\AppData\Roaming\Code\User\globalStorage\pleiades.java-extension-pack-jdk\java\21"
set "MAVEN_HOME=C:\Users\thirunavukkarasu\.maven\maven-3.10.0-rc-1"
cd /d "e:\capstone project\backend"
echo ===== Refreshing IDE Dependencies =====
call %MAVEN_HOME%\bin\mvn.cmd clean compile -DskipTests -q
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===== SUCCESS: IDE classpath refreshed =====
    echo All dependencies downloaded and cached
    echo Reload VS Code to clear errors
) else (
    echo Build failed - errors detected
)
endlocal
