# 日幣換算台幣 iOS App + WidgetKit

這是一套 iPhone App 與桌面小工具的專案骨架。

## 目標功能

- iOS App：輸入日幣金額，即時換算台幣。
- App 支援清除金額、自動更新匯率、手動輸入匯率。
- WidgetKit 小工具：在 iPhone 桌面顯示 JPY → TWD 匯率。
- Widget 顯示常用金額換算，例如 ¥1,000、¥5,000、¥10,000。
- 點擊 Widget 可打開 App。

## 重要限制

iOS WidgetKit 目前不適合直接在桌面小工具內輸入任意金額。小工具可以顯示資訊、按按鈕或切換狀態，但完整文字輸入仍需回到 App 內操作。

因此本專案採用最實用版本：

1. Widget 顯示即時匯率與常用換算。
2. 點 Widget 直接開啟 App。
3. App 開啟後日幣欄位可快速重新輸入。

## 建議開發方式

本資料夾使用 XcodeGen 結構建立專案。

### 方式一：用 XcodeGen 產生 Xcode 專案

```bash
cd ios-widget
brew install xcodegen
xcodegen generate
open JPYTWDConverter.xcodeproj
```

### 方式二：請 Codex 接手

把這個 repo 丟給 Codex，並貼上：

```text
請依照 ios-widget/project.yml 與 Sources 內的 Swift 檔案，產生並修正成可在 Xcode 編譯的 iOS App + WidgetKit 專案。目標是 iOS 17 以上，App 名稱為「日幣換算」，Bundle ID 可先使用 com.daisanity.jpytwdconverter。請確保主 App 可以輸入日幣換算台幣，小工具可以顯示即時匯率與常用金額換算，點擊小工具可開啟 App。
```
