interface CreateElementOpts {
  type: keyof HTMLElementTagNameMap;
  content?: string;
  id?: string;
  classes?: string[];
  attributes?: Pick<Attr, "name" | "value">[];
}
export function createElement({
  type,
  content,
  attributes,
  classes,
  id,
}: CreateElementOpts): HTMLElement {
  const newElem = document.createElement(type);
  if (content != null) {
    const newContent = document.createTextNode(content);
    newElem.append(newContent);
  }

  if (attributes != null && attributes.length > 0) {
    attributes.forEach(attr => {
      newElem.setAttribute(attr.name, attr.value);
    });
  }

  if (id != null) {
    newElem.id = id;
  }

  if (classes != null && classes.length > 0) {
    newElem.classList.add(...classes);
  }

  return newElem;
}
