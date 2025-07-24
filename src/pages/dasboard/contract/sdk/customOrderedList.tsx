import Quill from 'quill';

const List = Quill.import('formats/list');

class CustomOrderedList extends List {
  static blotName = 'list';
  static tagName = 'OL';
  static className = 'ql-custom-ordered-list';

  static create(value: any) {
    const node = super.create(value);

    if (typeof value === 'object' && value.start !== undefined && !isNaN(Number(value.start))) {
      node.setAttribute('start', value.start);
      node.style.setProperty('--custom-start', value.start - 1);
      node.style.removeProperty('list-style-type');
    } else if (typeof value === 'string') {
      // Support list-style types like upper-alpha
      node.style.listStyleType = value;
      node.removeAttribute('start');
    }

    return node;
  }

  static formats(domNode: any) {
    const result: any = {};
    const start = domNode.getAttribute('start');
    const listStyleType = domNode.style?.listStyleType;

    if (start && !isNaN(Number(start))) {
      result.list = 'ordered'; // 🔑 Ensures Quill treats it as ordered
      result.start = parseInt(start, 10);
    } else if (listStyleType) {
      result.list = listStyleType;
    } else {
      result.list = 'ordered';
    }

    return result;
  }

  format(name: string, value: any) {
    if (name === 'list') {
      if (typeof value === 'object' && value.start !== undefined && !isNaN(Number(value.start))) {
        this.domNode.setAttribute('start', value.start);
        this.domNode.style.setProperty('--custom-start', value.start - 1);
        this.domNode.style.removeProperty('list-style-type');
      } else if (typeof value === 'string') {
        this.domNode.style.listStyleType = value;
        this.domNode.removeAttribute('start');
        this.domNode.style.removeProperty('--custom-start');
      } else {
        super.format(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default CustomOrderedList;
