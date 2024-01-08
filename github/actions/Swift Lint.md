```
name: SwiftLint

on:
  pull_request:
    paths:
      - '.github/workflows/swiftlint.yml'
      - '.swiftlint.yml'
      - '**/*.swift'

jobs:
  SwiftLint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      
      - name: SwiftLint
        uses: norio-nomura/action-swiftlint@3.2.1
        env:
          WORKING_DIRECTORY: dub
        with:
          args: --strict
```