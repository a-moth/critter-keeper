import { Entry, Node, Template } from '../constants/NodeTypes';

export function getOrderedNodes(tree: Template | Entry): Node[] {
  return tree.metadata.order.map(id => tree.fields[id]).filter(Boolean);
}

export function insertNodeAfter(
  tree: Template | Entry | null,
  targetId: string,
  newNode: Node,
): Template | Entry | null {
  if (tree) {
    const newNodes = {
      ...tree.fields,
      [newNode.id]: newNode,
    };

    const index = tree.metadata.order.indexOf(targetId);

    if (index === -1) {
      return {
        fields: newNodes,
        metadata: {
          ...tree.metadata,
          order: [...tree.metadata.order, newNode.id],
        },
      };
    }

    const newOrder = [
      ...tree.metadata.order.slice(0, index + 1),
      newNode.id,
      ...tree.metadata.order.slice(index + 1),
    ];

    return {
      fields: newNodes,
      metadata: {
        ...tree.metadata,
        order: newOrder,
      },
    };
  }
  return null;
}

export function removeNode(
  tree: Template | Entry | null,
  nodeId: string,
): Template | Entry | null {
  if (tree) {
    const { [nodeId]: _, ...restNodes } = tree.fields;

    return {
      fields: restNodes,
      metadata: {
        ...tree.metadata,
        order: tree.metadata.order.filter(id => id !== nodeId),
      },
    };
  }
  return null;
}

export function moveNodeUp(
  tree: Template | Entry | null,
  nodeId: string,
): Template | Entry | null {
  if (tree) {
    const index = tree.metadata.order.indexOf(nodeId);
    if (index <= 0) return tree;

    const newOrder = [...tree.metadata.order];

    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];

    return {
      ...tree,
      metadata: {
        ...tree.metadata,
        order: newOrder,
      },
    };
  }
  return null;
}

export function moveNodeDown(
  tree: Template | Entry | null,
  nodeId: string,
): Template | Entry | null {
  if (tree) {
    const index = tree.metadata.order.indexOf(nodeId);
    if (index === -1 || index >= tree.metadata.order.length - 1) return tree;

    const newOrder = [...tree.metadata.order];
    [newOrder[index], newOrder[index + 1]] = [
      newOrder[index + 1],
      newOrder[index],
    ];

    return {
      ...tree,
      metadata: {
        ...tree.metadata,
        order: newOrder,
      },
    };
  }
  return null;
}

export function updateFieldByPath(
  fields: Record<string, Node>,
  newValue: Node,
): boolean {
  for (const key in fields) {
    const node = fields[key];

    // Found the node
    if (node.id === newValue.id) {
      fields[key] = newValue;
      return true;
    }

    // Search children
    if (node.type === 'section') {
      const found = updateFieldByPath(node.childNodes, newValue);

      if (found) {
        return true;
      }
    }
  }

  return false;
}

export function updateNode(
  nodes: Record<string, Node>,
  nodeId: string,
  updater: (node: Node) => Node,
): Record<string, Node> {
  const next = { ...nodes };

  for (const key of Object.keys(next)) {
    const node = next[key];

    if (node.id === nodeId) {
      next[key] = updater(node);
      return next;
    }

    if (node.type === 'section') {
      next[key] = {
        ...node,
        childNodes: updateNode(node.childNodes, nodeId, updater),
      };
    }
  }

  return next;
}

export function onHandleChange(
  template: Template | Entry | null,
  defaultShown: boolean,
  value: Node,
) {
  if (!template) return template;

  const updated = {
    ...template,
    [value.id]: {
      ...template.fields,
      fields: updateFieldByPath(template.fields, value),
      metadata: {
        ...template.metadata,
      },
    },
  };

  return updated;
}

export function validateTree(nodes: Template) {
  if (!Array.isArray(nodes)) return false;

  const seenIds = new Set();

  for (const node of nodes) {
    if (!validateNode(node)) return false;

    if (seenIds.has(node.id)) return false;
    seenIds.add(node.id);
  }

  return true;
}

export function validateNode(node: Node) {
  return false; // TODO implement validation based on types
}

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
