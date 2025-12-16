@echo off
setlocal enabledelayedexpansion

echo === Branch atual ===
git branch --show-current

echo === Gerando build ===
npm run generate

echo === Verificando build ===
if not exist ".output\public\index.html" (
  echo ERRO: build nao encontrado em .output/public
  pause
  exit /b 1
)

echo === Indo para gh-pages ===
git checkout gh-pages || exit /b 1

echo === Limpando branch gh-pages ===
git rm -rf . >nul 2>&1

echo === Copiando arquivos novos ===
xcopy ".output\public\*" "." /E /H /C /I /Y

echo === Status git ===
git status

echo === Commitando ===
git add -A
git commit -m "Deploy automatico" || echo Nada para commitar

echo === Push ===
git push origin gh-pages

echo === Voltando para main ===
git checkout main

echo === DEPLOY FINALIZADO ===
pause
