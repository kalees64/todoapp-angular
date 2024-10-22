cd /todoapp-angular/dist/todoapp/browser/
rm -rf *
echo -e "existing build files are removed from /todoapp-angular/dist/todoapp/browser/ successfully!!! \n"
ng build
echo -e "Build successful!!! \n"
cd /var/www/projects/root/
rm -rf *
echo -e "all existing files are removed from the /var/www/projects/root/ folder successfully!!! \n"
cp -r /todoapp-angular/dist/todoapp/browser/** /var/www/projects/root/
echo -e "dist folder files copied and pasted /var/www/projects/root/ successfully!!! \n"
