# marauder-ui

![Marauder Web Interface Screenshot](docs/homepage.png)

一个为 [ESP32 Marauder](https://github.com/justcallmekoko/ESP32Marauder) 固件打造的现代 Web 界面，通过浏览器即可与 Marauder 设备进行直观交互。

🌐 **[在线演示](https://mikystars.github.io/marauder-ui-pro/)**

> ~~整个项目~~ 本项目的部分内容（包括代码和此 README）由 Claude AI 协助完成，另外也包含人工编写以及 GitHub Copilot 的协助成果。

## 功能亮点

- 🔌 串口连接管理
- 📡 实时 AP 与蓝牙扫描/监控
- 👥 终端与客户端检测追踪
- 📊 动态 AP/STA 列表，支持排序与过滤
- 🖥️ 交互式终端输出
- 🎨 霓虹野性（neobrutalist）风格设计
- 📱 响应式布局
- ⌨️ 命令历史
- 🔍 高级过滤与排序

## 技术细节

- 基于 Vue 3 与 Tailwind CSS 构建
- 借助 Web Serial API 与设备通信
- 响应式状态管理
- 实时数据处理
- 模块化组件架构

## 环境需求

- 支持 Web Serial API 的浏览器（如 Chrome、Edge）
- 运行 [Marauder 固件](https://github.com/justcallmekoko/ESP32Marauder) 的 ESP32 设备

## 开发指南

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/marauder-ui-pro.git
cd marauder-ui
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 生产构建：
```bash
npm run build
```

## 使用方式

1. 将 Marauder 设备连接至电脑
2. 打开 Web 界面
3. 点击“连接”，从串口列表中选择设备
4. 使用命令构建器或输入自定义命令
5. 在 AP 列表与终端输出中观察结果

## 命令支持

界面兼容全部 Marauder 命令，例如：

- `scanap` - 扫描接入点
- `scansta` - 扫描终端
- `stopscan` - 停止当前扫描
- `list -a` - 列出已检测的接入点
- `sniffbeacon` - 侦听信标帧
- `sniffdeauth` - 侦听去认证帧
- `sniffpmkid` - 侦听 PMKID
- 以及更多...

## 功能详解

### 接入点监控
- 实时 AP 检测
- 信号强度指示
- 信道信息
- 关联终端追踪
- 最近一次发现时间戳

### 终端追踪
- STA-AP 关联
- MAC 地址显示
- 终端 ID
- 最近一次发现信息

### 界面特性
- 命令历史
- 终端输出
- 紧凑/详情视图
- 搜索与过滤
- 排序选项

### 蓝牙监控
- 实时蓝牙检测
- 信号强度显示
- MAC 地址显示
- 蓝牙名称展示
- Flipper 识别
- Airtag 识别
- Wardrive

### 蓝牙攻击
- BLE Spam Apple Sour
- BLE Spam Switpair
- BLE Spam Samsung
- BLE Spam Flipper
- BLE Spam All

## 参与贡献

欢迎提交问题与改进建议！

## 鸣谢

- [justcallmekoko](https://github.com/justcallmekoko) 的 ESP32 Marauder 固件
- Claude AI 提供的界面设计与实现帮助
- 项目维护者：[michelangelomo](https://github.com/michelangelomo) 与 [Mikystars](https://github.com/Mikystars)

## 许可证

本项目基于 MIT License 授权，详情请参阅 LICENSE 文件。
