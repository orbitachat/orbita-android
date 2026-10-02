$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

npm run build:web
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npm run sync:assets
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npx expo export:embed --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Set-Location android
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Set-Location ..
Write-Host "APK build successful: android/app/build/outputs/apk/debug/app-debug.apk"
