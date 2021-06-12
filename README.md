This action exposes the version name and version code in your Android app's `build.gradle` file as env vars.

There are only three inputs:
1. `path`: Specify the path to your `build.gradle`. This one is optional, if not specified it defaults to `app/build.gradle`, which is the location this file is most commonly found if you pull an Android repo during your CI flow.

2. `expose-version-code`: This expects either **'true'** or **'false'**. Set it to **'true'** if you want the **version code** exposed.
3. `expose-version-name`: This also expects either **'true'** or **'false'**. Set it to **'true'** if you want the **version name** exposed.

### Example:
```
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2 
      - name: Expose version name
        uses: michpohl/android-expose-version-name-action@v1.0.0
        with:
          expose-version-name: 'true'
          expose-version-code: 'false'
```

Depending on your set values, and if the `build.gradle` file is found in the specified location, the action will expose the **version code** as an env var named `ANDROID_VERSION_CODE` and the **version name** as an env var named `ANDROID_VERSION_NAME`.
