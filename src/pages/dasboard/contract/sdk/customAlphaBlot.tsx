import Quill from 'quill';
const List = Quill.import('formats/list');

class CustomAlphaList extends List {
  static blotName = 'list';
  static tagName = 'OL';
  static className = 'ql-custom-alpha-list';

  static create(value: any) {
    const node = super.create(value);

    if (typeof value === 'object') {
      if (value.start !== undefined && !isNaN(Number(value.start))) {
        node.setAttribute('start', value.start);
        node.style.setProperty('--custom-start', (value.start - 1).toString());
      }
      if (value.alphaType === 'upper' || value.alphaType === 'lower') {
        node.setAttribute('data-alpha', value.alphaType);
        node.style.listStyleType = value.alphaType === 'upper' ? 'upper-alpha' : 'lower-alpha';
      }
    } else if (typeof value === 'string') {
      node.setAttribute('data-alpha', value);
      node.style.listStyleType = value === 'upper' ? 'upper-alpha' : 'lower-alpha';
    }

    return node;
  }

  static formats(domNode: any) {
    const startAttr = domNode.getAttribute('start');
    const alphaType = domNode.getAttribute('data-alpha');

    const formats: any = { list: 'ordered' };
    if (startAttr && !isNaN(Number(startAttr))) {
      formats.start = parseInt(startAttr, 10);
    }
    if (alphaType === 'upper' || alphaType === 'lower') {
      formats.alphaType = alphaType;
    }
    return formats;
  }

  format(name: string, value: any) {
    if (name === 'list') {
      if (typeof value === 'object') {
        if (value.start !== undefined && !isNaN(Number(value.start))) {
          this.domNode.setAttribute('start', value.start);
          this.domNode.style.setProperty('--custom-start', (value.start - 1).toString());
        } else {
          this.domNode.removeAttribute('start');
          this.domNode.style.removeProperty('--custom-start');
        }
        if (value.alphaType === 'upper' || value.alphaType === 'lower') {
          this.domNode.setAttribute('data-alpha', value.alphaType);
          this.domNode.style.listStyleType = value.alphaType === 'upper' ? 'upper-alpha' : 'lower-alpha';
        } else {
          this.domNode.removeAttribute('data-alpha');
          this.domNode.style.removeProperty('list-style-type');
        }
      } else if (typeof value === 'string') {
        this.domNode.setAttribute('data-alpha', value);
        this.domNode.style.listStyleType = value === 'upper' ? 'upper-alpha' : 'lower-alpha';
        this.domNode.removeAttribute('start');
        this.domNode.style.removeProperty('--custom-start');
      } else {
        this.domNode.removeAttribute('data-alpha');
        this.domNode.style.removeProperty('list-style-type');
        this.domNode.removeAttribute('start');
        this.domNode.style.removeProperty('--custom-start');
      }
    } else {
      super.format(name, value);
    }
  }
}

export default CustomAlphaList;
