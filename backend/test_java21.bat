@echo off
cd /d "e:\capstone project\backend"
set "JAVA_HOME=C:\Users\thirunavukkarasu\AppData\Roaming\Code\User\globalStorage\pleiades.java-extension-pack-jdk\java\21"
echo Java Home: %JAVA_HOME%
C:\Users\thirunavukkarasu\.maven\maven-3.10.0-rc-1\bin\mvn.cmd --version | FINDSTR "Java"
echo.
echo ===== Running Tests with Java 21 =====
C:\Users\thirunavukkarasu\.maven\maven-3.10.0-rc-1\bin\mvn.cmd clean test -q
