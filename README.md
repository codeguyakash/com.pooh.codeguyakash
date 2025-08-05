npx react-native clean
cd android
./gradlew clean
cd ..
npx react-native run-android

Build for APK : ./gradlew assembleRelease Build for AAB : ./gradlew bundleRelease

cd android && ./gradlew clean && ./gradlew assembleRelease

cd android && ./gradlew clean && cd .. npx react-native run-android

npx react-native start --reset-cache
npx react-native run-android

adb install app/build/outputs/apk/release/app-release.apk

adb -s RZCW515XN3H install path/to/your-app.apk
