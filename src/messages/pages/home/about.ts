/**
 * messages/pages/home/about
 *
 * language pack
 */

export const TEXT = [
  /* LANG.KO */ {
    TITLE: "사이트 소개",
    INFO: `<h2>찾아와 주신 여러분, 환영합니다!</h2>
<p>&nbsp;</p>
<p>
  이 사이트는 <strong>TSBOARD</strong>라고 이름 지은 커뮤니티 빌더 사용자 분들을 위해 제작되었습니다. 
  TSBOARD는 Github를 통해 코드를 공개하고 있으며, 25년 1월 첫 Beta 출시를 목표로 하고 있습니다. 
  아직 개발 초기 단계이므로, 테스트 목적으로 먼저 사용을 권장해 드립니다.
</p>
<p>&nbsp;</p>
<p>
  TSBOARD는 <strong>Type Safety BOARD</strong>에서 이름을 따왔습니다. 
  JavaScript의 슈퍼셋 언어인 TypeScript에 푹 빠져 이 언어만으로 프론트엔드에서 백엔드까지 모두 동작하는 게시판을 만들어보고 싶어 제작하였습니다. 
  백엔드의 경우 처음에는 JS/TS 런타임인 Bun 기반으로 구현하였습니다. 
  그 후 v1.0.0 출시에 맞춰서 Go 언어로 개발한 자체 백엔드로 교체하였고, goapi-linux와 같은 바이너리 파일을 배포판에 함께 제공합니다.
</p>
<p>&nbsp;</p>
<p>
  TSBOARD는 우리나라 게시판의 근본이라 할 수 있는 그누보드처럼 DBMS는 Maria(MySQL)를 그대로 사용합니다. 
  클라이언트쪽은 Vue3 (Composition API) + Vuetify3 기반으로 구현되었고, TypeScript로 작성되어 있습니다.
  백엔드의 경우 위에서 설명드린대로, Go언어로 제작한 자체 바이너리를 사용합니다. 
  (리눅스 서버에서 구동하실 수 있는 바이너리를 기본으로 제공합니다.)
</p>
<p>&nbsp;</p>
<p>
  제가 놓치고 있거나 부족한 부분엔 따뜻한 도움의 손길을 부탁 드리겠습니다.
  혹시 TypeScript 나 Vue와 같은 프레임워크 활용에 어려움이 있으신 분들께는 이번 기회에 TSBOARD를 통해서 함께 배우고 활용해보면 좋겠습니다. 
  또한 백엔드를 직접 수정해서 사용하실 분들을 위해 https://github.com/sirini/goapi 에서 소스 코드를 모두 열어두었으니
  필요에 따라 직접 수정/개선하셔서 사용하시면 되겠습니다. (물론 코드 기여도 환영합니다!)
</p>`,
    GITHUB_TOOLTIP: "깃허브에 공개된 TSBOARD 프로젝트 보러가기 (★ 도 눌러주기 😄)",
  },
  /* LANG.EN */ {
    TITLE: "About this website",
    INFO: `
<h2>Welcome to the TSBOARD.dev!</h2>
<p>&nbsp;</p>
<p> This site has been created for users of the community builder named <strong>TSBOARD</strong>. 
TSBOARD's code is publicly available on Github, and the first Beta release is scheduled for January 2025. 
As the development is still in the early stages, we recommend using it for testing purposes first. 
</p> 
<p>&nbsp;</p> 
<p> TSBOARD is named after <strong>Type Safety BOARD</strong>. 
It was created because I became deeply fascinated with TypeScript, a superset of JavaScript, 
and wanted to build a fully functional bulletin board that works from frontend to backend using only this language. 
Initially, the backend was implemented using Bun, a JS/TS runtime. 
Later, with the release of v1.0.0, the backend was replaced with a custom solution developed in Go, 
and binary files like goapi-linux are provided with the distribution. 
</p> 
<p>&nbsp;</p> 
<p> TSBOARD uses MariaDB (MySQL) for its DBMS, just like the foundational Korean bulletin board, Gnuboard. 
The client side is implemented with Vue3 (Composition API) and Vuetify3, written in TypeScript. 
For the backend, as mentioned earlier, a custom binary built with Go is used. 
(By default, we provide a binary that can be run on Linux servers.) 
</p> 
<p>&nbsp;</p> 
<p> I kindly ask for your warm help if there are any areas I may have missed or that need improvement. 
If you are facing difficulties with frameworks like TypeScript or Vue, 
I hope you can take this opportunity to learn and explore them together through TSBOARD. 
For those who wish to modify the backend directly, 
the source code is fully open at https://github.com/sirini/goapi, so feel free to modify and improve it as needed. 
(Contributions to the code are, of course, welcome!)</p>`,
    GITHUB_TOOLTIP: "Visit the TSBOARD project on GitHub and give us a star (★) if you like it! 😄",
  },
  /* LANG.CN */ {
    TITLE: "关于这个网站",
    INFO: `
<p> 本网站是为使用名为 <strong>TSBOARD</strong> 的社区构建器用户制作的。 
TSBOARD 的代码通过 Github 公开，首个 Beta 版本计划于 2025 年 1 月发布。 
由于开发仍处于初期阶段，因此我们建议您首先用于测试目的。 
</p> 
<p>&nbsp;</p> 
<p> TSBOARD 这个名字来源于 <strong>Type Safety BOARD</strong>。 
我沉迷于 JavaScript 的超集 TypeScript，想要用这种语言从前端到后端都能运行的方式制作一个完整的论坛。 
后端最初是基于 JS/TS 运行时 Bun 实现的。 
随着 v1.0.0 版本的发布，后端被替换为使用 Go 语言开发的自有解决方案，并且提供了像 goapi-linux 这样的二进制文件作为发行版的一部分。 
</p> 
<p>&nbsp;</p> 
<p> TSBOARD 在数据库管理系统(DBMS)方面，像韩国的基础性论坛 Gnuboard 一样，采用 MariaDB (MySQL)。 
客户端部分是基于 Vue3（Composition API）和 Vuetify3 实现的，使用 TypeScript 编写。 
后端部分，如上所述，使用自有的 Go 语言编写的二进制文件。 （默认提供一个可以在 Linux 服务器上运行的二进制文件。） 
</p> 
<p>&nbsp;</p> 
<p> 如果我有遗漏或不足之处，还请大家给予热心的帮助。 如果您在使用 TypeScript 或 Vue 等框架时遇到困难，
希望您能够借此机会通过 TSBOARD 一起学习和使用它们。 
对于那些希望直接修改后端的人，源代码已完全开放在 https://github.com/sirini/goapi， 
您可以根据需要进行修改和改进。（当然，也欢迎贡献代码！） </p>`,
    GITHUB_TOOLTIP: "访问 GitHub 上的 TSBOARD 项目并给我们一个星标（★），如果你喜欢的话！😄",
  },
]
Object.freeze(TEXT)
