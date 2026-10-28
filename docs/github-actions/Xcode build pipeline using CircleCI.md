
```
version: 2.1
workflows:
  release:
    jobs:
      - masterBuild:
          filters:
            branches:
              only: master
      - betaBuild:
          filters:
            branches:
              only: staging
jobs:
  betaBuild:
    machine: true
    resource_class: dubdubdub-xyz/dubhub
    steps:
      - add_ssh_keys:
          fingerprints:
            - "5e:16:bb:b6:2b:e4:19:16:04:ad:34:f2:af:e7:23:c6"
      - checkout
#       - run:
#           name: Build Application
#           command: cd dub && xcodebuild -configuration Release OTHER_CODE_SIGN_FLAGS\=--timestamp CODE_SIGN_INJECT_BASE_ENTITLEMENTS=No
      - run:
          name: Archive Application
          command: cd dub && xcodebuild -scheme dub archive -archivePath build/Release/archive/StagingArchive.xcarchive -configuration Beta OTHER_CODE_SIGN_FLAGS\=--timestamp CODE_SIGN_INJECT_BASE_ENTITLEMENTS=No
          no_output_timeout: 20m
      - run:
          name: Export Archive to App
          command: cd dub && xcodebuild -exportArchive -archivePath build/Release/archive/StagingArchive.xcarchive -exportOptionsPlist ../Supports/ExportOptions.plist -exportPath build/Release/app
      - run:
          name: Compress app
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && /usr/bin/ditto -c -k --keepParent --sequesterRsrc dub_beta.app dub_beta_prenotary.zip
      - run:
          name: Notarize App
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub_beta_prenotary.zip --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Staple Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun stapler staple "dub_beta.app"
      - run:
          name: Zip App w/ Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && /usr/bin/ditto -c -k --keepParent --sequesterRsrc dub_beta.app dub_beta.zip
      - run:
          name: Notarize Zip
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub_beta.zip --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Copy Zip to Release Folder
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && mkdir SparkleStaging && cp dub_beta.zip SparkleStaging
      - run:
          name: Download Sparkle Tools
          command: curl -L https://github.com/sparkle-project/Sparkle/releases/download/2.3.1/Sparkle-for-Swift-Package-Manager.zip -o  /var/opt/circleci/workdir/dub/SparkleForSwift.zip && unzip /var/opt/circleci/workdir/dub/SparkleForSwift.zip -d /var/opt/circleci/workdir/dub/SparkleForSwift
      - run:
          name: Generate Sparkle Keys
          command: cd /var/opt/circleci/workdir/dub/SparkleForSwift && ./bin/generate_keys
      - run:
          name: Clone and Generate Appcast
          command: cd /var/opt/circleci/workdir/Supports && ./appcast-staging.sh
    #   - run:
    #       name: Generate Sparkle Appcast
    #       command: cd /var/opt/circleci/workdir/dub/SparkleForSwift && ./bin/generate_appcast /var/opt/circleci/workdir/dub/build/Release/app/SparkleStaging
#       - run: 
#           name: Rename Appcast
#           command: cd /var/opt/circleci/workdir/dub/build/Release/app/SparkleStaging && mv appcast.xml appcastStaging.xml
      - run:
          name: Create DMG
          command: npm install -g appdmg && cd /var/opt/circleci/workdir/dub/build/Release/app && appdmg /var/opt/circleci/workdir/Supports/appdmg_beta.json dub_beta.dmg
      - run:
          name: Notarize DMG
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub_beta.dmg --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Staple DMG Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun stapler staple "dub_beta.dmg"
      - run:
          name: Copy DMG to Release Folder
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && cp dub_beta.dmg SparkleStaging
      - run: # Deploy to S3 using the sync command
            name: Deploy to S3
            command: aws s3 sync /var/opt/circleci/workdir/dub/build/Release/app/SparkleStaging s3://downloads.dubdubdub.xyz
            
            
            
#    Build for master branch
            
  masterBuild:
    machine: true
    resource_class: dubdubdub-xyz/dubhub
    steps:
      - add_ssh_keys:
          fingerprints:
            - "5e:16:bb:b6:2b:e4:19:16:04:ad:34:f2:af:e7:23:c6"
      - checkout
      - run:
          name: Archive Application
          command: cd dub && xcodebuild -scheme dub archive -archivePath build/Release/archive/Archive.xcarchive -configuration Release OTHER_CODE_SIGN_FLAGS\=--timestamp CODE_SIGN_INJECT_BASE_ENTITLEMENTS=No
          no_output_timeout: 20m
      - run:
          name: Export Archive to App
          command: cd dub && xcodebuild -exportArchive -archivePath build/Release/archive/Archive.xcarchive -exportOptionsPlist ../Supports/ExportOptions.plist -exportPath build/Release/app 
      - run:
          name: Compress app
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && /usr/bin/ditto -c -k --keepParent dub.app dub_prenotary.zip
      - run:
          name: Notarize App
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub_prenotary.zip --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Staple Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun stapler staple "dub.app"
      - run:
          name: Zip App w/ Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && /usr/bin/ditto -c -k --keepParent dub.app dub.zip
      - run:
          name: Notarize Zip
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub.zip --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Copy Zip to Release Folder
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && mkdir Sparkle && cp dub.zip Sparkle
      - run:
          name: Download Sparkle Tools
          command: curl -L https://github.com/sparkle-project/Sparkle/releases/download/2.3.1/Sparkle-for-Swift-Package-Manager.zip -o  /var/opt/circleci/workdir/dub/SparkleForSwift.zip && unzip /var/opt/circleci/workdir/dub/SparkleForSwift.zip -d /var/opt/circleci/workdir/dub/SparkleForSwift
      - run:
          name: Generate Sparkle Keys
          command: cd /var/opt/circleci/workdir/dub/SparkleForSwift && ./bin/generate_keys
      - run:
          name: Clone and Generate Appcast
          command: cd /var/opt/circleci/workdir/Supports && ./appcast.sh
    #   - run:
    #       name: Generate Sparkle Appcast
    #       command: cd /var/opt/circleci/workdir/dub/SparkleForSwift && ./bin/generate_appcast /var/opt/circleci/workdir/dub/build/Release/app/Sparkle
      - run:
          name: Create DMG
          command: npm install -g appdmg && cd /var/opt/circleci/workdir/dub/build/Release/app && appdmg /var/opt/circleci/workdir/Supports/appdmg.json dub.dmg
      - run:
          name: Notarize DMG
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun notarytool submit dub.dmg --keychain-profile "AC_PASSWORD" --wait --timeout 2h
      - run:
          name: Staple DMG Notarization
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && xcrun stapler staple "dub.dmg"
      - run:
          name: Copy DMG to Release Folder
          command: cd /var/opt/circleci/workdir/dub/build/Release/app && cp dub.dmg Sparkle
      - run: # Deploy to S3 using the sync command
            name: Deploy to S3
            command: aws s3 sync /var/opt/circleci/workdir/dub/build/Release/app/Sparkle s3://downloads.dubdubdub.xyz
```