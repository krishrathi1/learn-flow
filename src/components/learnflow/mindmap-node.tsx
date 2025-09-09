export interface MindMapNodeData {
  value: string;
  children: MindMapNodeData[];
}

interface MindMapNodeProps {
  node: MindMapNodeData;
}

export default function MindMapNode({ node }: MindMapNodeProps) {
  return (
    <div className="mind-map-node">
      <div className="mind-map-node-value">{node.value}</div>
      {node.children && node.children.length > 0 && (
        <div className="mind-map-node-children">
          {node.children.map((child) => (
            <MindMapNode key={child.value} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
