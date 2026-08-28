import DOMPurify from "isomorphic-dompurify"

let hookInstalled = false
const installHook = () => {
  if (hookInstalled) return
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank")
      node.setAttribute("rel", "noopener noreferrer")
    }
  })
  hookInstalled = true
}

export const sanitizeHtml = (dirty = "") => {
  installHook()
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "caption",
      "code",
      "div",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "iframe",
      "img",
      "li",
      "mark",
      "ol",
      "p",
      "pre",
      "s",
      "span",
      "strike",
      "strong",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "ul",
    ],
    ALLOWED_ATTR: [
      "allowfullscreen",
      "alt",
      "class",
      "height",
      "href",
      "name",
      "src",
      "style",
      "target",
      "width",
    ],
  })
}
