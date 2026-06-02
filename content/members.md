---
# Members section. Compiled to data/members.json by scripts/build-data.mjs.
# `sectionTitle`, `description` and `tabs` carry bilingual { en, zh } values.
# `bias` is [x, y] object-position (percent), `tag` is current | past,
# `link` is optional (opens on click).
#
# PHOTOS — the `image` field accepts EITHER:
#   1. a local path / URL, e.g.  image: assets/img/person/advisor.avif
#   2. a pasted GitHub image tag (what you get when you paste/drag an image
#      into the GitHub Markdown editor). Wrap it in single quotes so the
#      double quotes inside stay valid YAML — the build extracts the src URL:
#
#      image: '<img width="385" height="203" alt="image" src="https://github.com/user-attachments/assets/7c75f767-36f7-480f-881a-0734d17c8cdc" />'
sectionTitle:
  en: Members
  zh: 成員
description:
  en: Current team members of our quantum computing lab.
  zh: 量子計算實驗室的團隊成員。
tabs:
  all:
    en: All
    zh: 全部
  current:
    en: Current
    zh: 現任
  past:
    en: Past
    zh: 歷屆
items:
  - name:
      en: Han-Hsuan Lin
      zh: 林瀚仚
    position:
      en: Advisor
      zh: 指導教授
    image: assets/img/person/advisor.avif
    link: https://sites.google.com/view/han-hsuan-lins-homepage/home
    bias: [0, 0]
    highlight: true
    tag: current
  - name:
      en: Kuan-Fu Tseng
      zh: 曾冠富
    position:
      en: Master Student
      zh: 碩士生
    image: assets/img/person/kft.avif
    bias: [0, 0]
    highlight: false
    tag: current
  - name:
      en: Albert Lin
      zh: 林奕辰
    position:
      en: Master Student
      zh: 碩士生
    image: assets/img/person/AlbertLin.avif
    bias: [0, 0]
    highlight: false
    tag: current
  - name:
      en: Wei-Hsin Li
      zh: 李為新
    position:
      en: Master Student
      zh: 碩士生
    image: assets/img/person/whl.avif
    bias: [0, 0]
    highlight: false
    tag: current
  - name:
      en: Cheng-En Chou
      zh: 周証恩
    position:
      en: Master Student
      zh: 碩士生
    image: assets/img/person/cec.avif
    bias: [0, 100]
    highlight: false
    tag: current
  - name:
      en: Wei-Chen Li
      zh: 李威辰
    position:
      en: Master Student
      zh: 碩士生
    image: assets/img/person/wcl.avif
    bias: [0, 0]
    highlight: false
    tag: past
  - name:
      en: Darren Hsiou
      zh: 蕭登鴻
    position:
      en: Undergraduate Student
      zh: 專題生
    image: assets/img/person/dhh.avif
    bias: [0, -20]
    highlight: false
    tag: past
  - name:
      en: Min-Hua Wu
      zh: 吳旻樺
    position:
      en: Undergraduate Student
      zh: 專題生
    image: assets/img/person/yhw.avif
    bias: [0, 0]
    highlight: false
    tag: past
  - name:
      en: Che-Yu Lin
      zh: 林哲宇
    position:
      en: Undergraduate Student
      zh: 專題生
    image: assets/img/person/zyl.avif
    bias: [0, 0]
    highlight: false
    tag: past
---

<!--
Add or edit lab members above. Each entry needs a name (en/zh), position
(en/zh), an image path under assets/img/person/, a bias offset, a highlight
flag, and a tag (current/past). Run `npm run build` to regenerate
data/members.json before previewing locally.
-->
