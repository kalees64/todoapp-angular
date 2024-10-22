#cd ../
#rm -rf todoapp-angular
#git clone https://github.com/kalees64/todoapp-angular.git
#cd todoapp-angular/
git pull
echo -e "\ngit pull successfull!!! \n"
rm -rf node_modules
echo -e "node_modules deleted!!! \n"
npm install --force
echo -e  "\nnpm install --force successful!!! \n"
rm -rf dist
echo -e "existing build files are removed from /todoapp-angular/dist/todoapp/browser/ successfully!!! \n"
ng build
echo -e "Build successful!!! \n"
rm -rf /var/www/projects/root/*
echo -e "all existing files are removed from the /var/www/projects/root/ folder successfully!!! \n"
cp -r /todoapp-angular/dist/todoapp/browser/** /var/www/projects/root/
echo -e "dist folder files copied and pasted /var/www/projects/root/ successfully!!! \n"
echo  -e "Build and deploy process completed successfully!!! \n"
