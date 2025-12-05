@echo off
echo Gerando build do Nuxt...
npm run generate

echo Entrando na pasta .output/public...
cd .output\public

echo Adicionando arquivos...
git add -A

echo Commitando...
git commit -m "Deploy automatico"

echo Enviando para a branch gh-pages...
git push -f origin gh-pages

echo Voltando para a raiz...
cd ../..

echo Deploy finalizado!
pause