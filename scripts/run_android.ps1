& "$PSScriptRoot\build_android.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Installing APK onto connected device..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Launching Orbita on Android device..."
adb shell monkey -p com.saizzi.orbita -c android.intent.category.LAUNCHER 1
