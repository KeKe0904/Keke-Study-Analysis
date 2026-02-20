# Keke Study Analysis

<div align="center">
  <img src="icon.png" alt="Keke Study Analysis Logo" width="150" height="150">
  <h2>🎯 成绩分析小助手</h2>
  <p>一个美观、高效的个人成绩分析网站，帮助你轻松追踪学习进度</p>
  <br>
  <p>
    <a href="#功能特性">功能特性</a> •
    <a href="#技术栈">技术栈</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#使用指南">使用指南</a> •
    <a href="#项目结构">项目结构</a> •
    <a href="#贡献指南">贡献指南</a> •
    <a href="#许可证">许可证</a>
  </p>
</div>

## 📋 项目简介

Keke Study Analysis 是一个专为学生设计的个人成绩分析网站，采用现代化的二次元风格设计，结合毛玻璃效果和流畅的动画，为用户提供直观、美观的成绩管理与分析体验。

网站支持多科目成绩录入、自动计算统计数据、生成可视化图表，并提供数据导入导出功能，帮助你全面了解自己的学习状况和进步趋势。

## ✨ 功能特性

### 🎨 美观界面
- 二次元风格设计，清新可爱
- 毛玻璃效果，现代感十足
- 流畅的动画过渡，增强用户体验
- 响应式布局，适配各种设备
- 支持暗色模式，保护视力

### 📊 成绩分析
- 支持多科目成绩录入
- 自动计算最高分、最低分、平均分、中位数
- 生成多种可视化图表：
  - 各科目平均分对比（柱状图）
  - 各科目成绩趋势分析（折线图）
  - 单个科目成绩变化趋势（折线图）
  - 成绩分布对比（雷达图）
- 详细的成绩统计数据

### 🎯 智能功能
- 科目选择模态框，默认选择语数外
- 分数限制选择，支持多种预设评分系统
- 考试时间选择，支持日期选择和学期标签
- 数据本地存储，无需登录
- 成绩导入导出功能，方便数据备份

### ⚙️ 系统设置
- 暗色模式切换
- 字体选择，支持多种自定义字体
- 数据管理，包括导出、导入和清除

## 🛠️ 技术栈

| 类别 | 技术/库 | 版本 |
|------|---------|------|
| 前端框架 | 原生 HTML5, CSS3, JavaScript | - |
| 图表库 | Chart.js | 最新版 |
| 网络请求 | jQuery | 3.6.0 |
| 本地存储 | localStorage | - |
| 背景图片 | 第三方 API | - |

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome, Firefox, Safari, Edge 等）
- 网络连接（用于加载背景图片和第三方库）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Keke Study Analysis
   ```

2. **启动本地服务器**
   - 使用 Python 3：
     ```bash
     python -m http.server 8000
     ```
   - 或使用 Node.js：
     ```bash
     npx serve
     ```
   - 或使用其他本地服务器工具

3. **访问网站**
   在浏览器中打开 `http://localhost:8000` 或相应的服务器地址

## 📖 使用指南

### 1. 首次使用
- 进入网站后，会弹出科目选择模态框
- 默认已选择语文、数学、英语
- 可根据需要选择其他科目，如物理、化学、生物、历史、地理、政治
- 点击「确认选择」后进入成绩输入页面

### 2. 成绩输入
- 在成绩输入页面，为每个选择的科目输入成绩
- 可选择分数限制系统（如语数外150分制，其他100分制等）
- 可选择考试时间（如期中考试、期末考试等）
- 点击「分析成绩」按钮提交成绩并查看分析结果

### 3. 成绩分析
- 在分析页面，查看各科目详细的统计数据
- 浏览生成的各种图表，了解成绩趋势
- 可返回输入页面继续添加新的成绩

### 4. 系统设置
- 在设置页面，可进行以下操作：
  - 切换暗色模式
  - 选择喜欢的字体
  - 导出成绩数据（JSON格式）
  - 导入之前的成绩数据
  - 清除所有本地数据

## 📁 项目结构

```
Keke Study Analysis/
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── input.js           # 成绩输入逻辑
│   └── analysis.js        # 成绩分析逻辑
├── icon.png               # 网站图标
├── index.html             # 首页
├── input.html             # 成绩输入页
├── analysis.html          # 成绩分析页
├── settings.html          # 设置页
├── about.html             # 关于页
├── SourceHanSansLite.ttf  # 自定义字体
├── JinNianYeYaoJiaYouYa.ttf # 自定义字体
├── PingFangJiangNanTi-2.ttf # 自定义字体
└── README.md              # 项目说明
```

## 🎨 设计特色

### 动画效果
- 页面加载动画：渐入效果
- 元素交互动画：缩放、位移、旋转
- 悬停效果：阴影变化、颜色过渡
- 平滑的页面切换

### 响应式设计
- 桌面端：完整功能，多列布局
- 平板端：适配布局，保持核心功能
- 移动端：单列布局，简化操作

### 数据可视化
- 使用 Chart.js 生成多种类型的图表
- 图表支持交互，显示详细数据
- 响应式图表，适配不同屏幕尺寸

## 🔧 自定义配置

### 背景图片 API
默认使用 `https://api.yaohud.cn/api/acg/adaptive` 作为背景图片源，可在各页面的 `<script>` 标签中修改。

### 字体配置
可在 `css/style.css` 文件中添加或修改字体定义：
```css
@font-face {
    font-family: 'YourFontName';
    src: url('../your-font-file.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```

### 分数限制配置
可在 `js/input.js` 文件中修改预设的分数限制系统：
```javascript
function setPresetScoreLimits(type) {
    switch (type) {
        case 'default':
            scoreLimits = {
                '语文': 150,
                '数学': 150,
                '英语': 150,
                // 其他科目...
            };
            break;
        // 其他预设...
    }
}
```

## 🤝 贡献指南

欢迎对项目进行贡献！如果你有任何改进建议或发现了bug，请：

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 Apache 2.0 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 📞 联系方式

- 作者：落梦陳
- 网站：[https://keke-study-analysis.com](https://keke-study-analysis.com)（待定）
- 版本：1.0.0

---

<div align="center">
  <p>🎉 感谢使用 Keke Study Analysis！希望它能帮助你更好地管理学习成绩 📚</p>
  <p>如有任何问题或建议，欢迎反馈！</p>
</div>