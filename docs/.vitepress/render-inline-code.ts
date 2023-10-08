// https://github.com/vuejs/vuepress/issues/2377
export default function (md, config) {
  md.renderer.rules.code_inline = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx]
    return `<code v-pre ${renderer.renderAttrs(token)}>${md.utils.escapeHtml(token.content)}</code>`
  }
}
