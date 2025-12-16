@echo off
setlocal

echo === Verificando branch atual ===
git rev-parse --abbrev-ref HEAD

echo === Gerando build do Nuxt ===
npm run generate

echo === Indo para gh-pages ===
git checkout gh-pages || (
  echo ERRO: branch gh-pages nao encontrada
  exit /b 1
)

echo === Limpando arquivos antigos ===
for /f %%i in ('dir /b /a-d') do del %%i
for /d %%i in (*) do rmdir /s /q %%i

echo === Copiando novos arquivos ===
xcopy .output\public\* . /E /Y

echo === Commitando ===
git add -A
git commit -m "Deploy: atualizacao do site" || echo Nada para commitar

echo === Enviando para o GitHub ===
git push origin gh-pages

echo === Voltando para main ===
git checkout main

echo === Deploy finalizado com sucesso ===
pause