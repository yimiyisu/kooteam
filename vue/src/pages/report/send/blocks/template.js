export default function () {
    return `
<h1>本周重点</h1>
<h4>1. 任务进展</h4>
<div class="ml-2">
    <blockquote>本周完成了哪些任务、整体进度如何。</blockquote>
    <div>本周完成了XXX需求开发，已经提测。项目整体进度比预期延迟1d，预计下周三可以开始正式测试。</div>
</div>
<h4>2. 风险同步</h4>
<div class="ml-2">
    <blockquote>存在哪些风险、对应的对策是什么。</blockquote>
    <div>
    由于需要调用外网数据，需要在预发环境搭建代理，接下来需要考虑代理的通用性，在其他需要外网数据配合的需求中可以直接使用。
    </div>
</div>
<h1>下周计划</h1>
<div class="ml-2">
    <blockquote>
    接下来要做什么、是否需要其他协助。
    </blockquote>
    <div>
    下周开始主要投入XXX、XXX等功能点开发，依赖于中台团队提供接口，下周一和中台团队的xxx沟通确认。
    </div>
</div>
`;
}
