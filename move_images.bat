@echo off
if not exist "assets" mkdir assets
if not exist "assets\images" mkdir "assets\images"
move "Website Images\*" "assets\images\"
rmdir "Website Images"
echo Done
