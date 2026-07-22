import { Entry, Node, Template } from '../constants/NodeTypes';

/**
 * Creates a new UUID for any object
 * @returns New UUID for anything
 */
export function createId() {
  return crypto.randomUUID();
}

export function isSectionNode(node: Node) {
  return node.type === 'section';
}
