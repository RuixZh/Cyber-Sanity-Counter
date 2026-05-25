# Cyber-Sanity Counter v1.0

macOS 桌面悬浮计次器 — 赛博理智审计员（Electron）。

## 开发运行

```bash
npm install
npm start
```

## 打包成 Mac 小应用

使用 [electron-builder](https://www.electron.build/) 生成 `.app` 安装包和 `.dmg` 磁盘镜像。

### 1. 安装依赖

```bash
cd /Users/ray/Desktop/count-desktop
npm install
```

### 2. 打包命令

| 命令 | 说明 |
|------|------|
| `npm run pack` | 只生成 `.app` 文件夹（在 `dist/mac-arm64/` 或 `dist/mac/`），适合本地试装 |
| `npm run dist` | 生成 **DMG + ZIP**（按当前 Mac 芯片自动选 arm64 或 x64） |
| `npm run dist:arm64` | 仅 Apple 芯片 (M1/M2/M3…) |
| `npm run dist:x64` | 仅 Intel 芯片 |

推荐日常分发：

```bash
npm run dist
```

### 3. 产物位置

打包完成后在 `dist/` 目录，例如：

```
dist/
  Cyber-Sanity Auditor-1.0.0-arm64.dmg    # 双击安装
  Cyber-Sanity Auditor-1.0.0-arm64-mac.zip
  mac-arm64/Cyber-Sanity Auditor.app        # 也可直接拖进「应用程序」
```

把 `.app` 拖到 **应用程序** 文件夹即可使用。

### 4. 自定义图标（可选）

在 `build/` 目录放入：

- `icon.icns`（推荐，macOS 专用）
- 或 `icon.png`（至少 512×512，打包时会自动转换）

没有图标时使用 Electron 默认图标。

### 5. 首次打开提示「无法验证开发者」

未签名的应用，macOS 可能拦截。可任选其一：

1. **系统设置 → 隐私与安全性** → 点「仍要打开」
2. 或在终端对 `.app` 执行：
   ```bash
   xattr -cr "/Applications/Cyber-Sanity Auditor.app"
   ```

若要公开发布、免警告，需要 **Apple Developer** 账号做代码签名与公证（`hardenedRuntime` + `notarize`），可后续再配置。

### 6. 体积说明

Electron 应用体积通常在 **80–150 MB**（内含 Chromium 运行时），这是桌面壳的常态。`asar: true` 已开启，用于压缩应用内资源。

## 项目结构

```
src/
  main/           # 主进程
  preload/        # IPC 桥接
  renderer/       # UI
  shared/         # 文案、日期逻辑
build/            # 打包图标等资源
dist/             # 打包输出（git 忽略）
```

文案见 `记次器new.md`、`文案.md`。
