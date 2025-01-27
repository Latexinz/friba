# Friba

Friba is a discgolf scorekeeping app written in Typescript using React Native as framework.

This is a personal hobby project.

Testing done using a Samsung S20FE 5G

## Google API key

>To use Google Drive with this app you will need an API key. You can get it here --> https://console.cloud.google.com

Create a new file `keys.xml` in `../android/app/src/main/res/values` and store the API key there

`keys.xml`

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="google_drive_api_key">YOUR_API_KEY_HERE</string>
</resources>
```

## Running the app

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```